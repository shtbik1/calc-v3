import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"

import { COOKIE_KEYS } from "@/utils/constants"
import { supabaseServ } from "@/utils/supabaseUser"

import { JwtData } from "../../interface"

const SECRET_JWT = process.env.NEXT_JWT_SECRET as string

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE_KEYS.token)
  if (!cookie || !cookie.value) {
    return NextResponse.json(
      { success: false, error: "unauthorized" },
      { status: 403 },
    )
  }

  let decoded: JwtData
  try {
    decoded = jwt.verify(cookie.value, SECRET_JWT) as JwtData
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "invalid_token" },
      { status: 401 },
    )
  }

  const { formulaLink } = await request.json()

  const { data: existingData, error: fetchError } = await supabaseServ
    .from("favourites")
    .select("liked_formulas")
    .eq("user_id", decoded.user_id)
    .single()

  if (fetchError && fetchError.code !== "PGRST116") {
    return NextResponse.json(
      { success: false, error: fetchError.message },
      { status: 500 },
    )
  }

  if (!existingData || !existingData.liked_formulas) {
    return NextResponse.json(
      { success: false, error: "Запись не найдена" },
      { status: 404 },
    )
  }

  const updatedFormulas = { ...existingData.liked_formulas }

  if (updatedFormulas[formulaLink]) {
    delete updatedFormulas[formulaLink]
  } else {
    return NextResponse.json(
      { success: false, error: "Формула не найдена в избранном" },
      { status: 404 },
    )
  }

  const { error: upsertError } = await supabaseServ.from("favourites").upsert(
    {
      user_id: decoded.user_id,
      login: decoded.login,
      liked_formulas: updatedFormulas,
    },
    { onConflict: "user_id" },
  )

  if (upsertError) {
    return NextResponse.json(
      { success: false, error: upsertError.message },
      { status: 500 },
    )
  }

  return NextResponse.json({})
}
