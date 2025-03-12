import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"

import { COOKIE_KEYS } from "@/utils/constants"
import { supabaseServ } from "@/utils/supabaseUser"

import { JwtData } from "../../interface"

const SECRET_JWT = process.env.NEXT_JWT_SECRET as string

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE_KEYS.token)
  if (!cookie || !cookie.value) {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 })
  }

  let decoded: JwtData
  try {
    decoded = jwt.verify(cookie.value, SECRET_JWT) as JwtData
  } catch (error) {
    return NextResponse.json({ error: "invalid_token" }, { status: 401 })
  }

  const { formulaLink } = await request.json()

  const { data: existingData, error: fetchError } = await supabaseServ
    .from("history")
    .select("history_formulas")
    .eq("user_id", decoded.user_id)
    .single()

  if (fetchError && fetchError.code !== "PGRST116") {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  let updatedFormulas: { [key: string]: string } = {}

  if (existingData && existingData.history_formulas) {
    updatedFormulas = { ...existingData.history_formulas }
  }

  updatedFormulas[formulaLink] = new Date().toISOString()

  const { error: upsertError } = await supabaseServ.from("history").upsert(
    {
      user_id: decoded.user_id,
      login: decoded.login,
      history_formulas: updatedFormulas,
    },
    { onConflict: "user_id" },
  )

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  return NextResponse.json({})
}
