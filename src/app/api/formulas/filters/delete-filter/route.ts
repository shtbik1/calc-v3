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

  const { filters } = await request.json()

  const { data: filtersData, error: fetchError } = await supabaseServ
    .from("filters")
    .select("filters_formulas")
    .eq("user_id", decoded.user_id)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  if (!filtersData) {
    return NextResponse.json({ error: "no_data_found" }, { status: 404 })
  }

  delete filtersData.filters_formulas[Object.keys(filters)[0]]

  // Обновляем запись в базе данных
  const { error: updateError } = await supabaseServ
    .from("filters")
    .update({ filters_formulas: filtersData.filters_formulas })
    .eq("user_id", decoded.user_id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  //   // Возвращаем обновлённые данные
  return NextResponse.json({ data: filtersData.filters_formulas })
}
