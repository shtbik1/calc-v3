import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"

import { JwtData } from "@/app/api/interface"
import { COOKIE_KEYS } from "@/utils/constants"
import { supabaseServ } from "@/utils/supabaseUser"

const SECRET_JWT = process.env.NEXT_JWT_SECRET as string

export async function DELETE(request: NextRequest) {
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

  const currentTime = Math.floor(Date.now() / 1000)
  if (decoded.exp < currentTime) {
    return NextResponse.json({ error: "expired" }, { status: 401 })
  }

  const { error: deleteError } = await supabaseServ
    .from("history")
    .delete()
    .eq("user_id", decoded.user_id)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  return NextResponse.json({})
}
