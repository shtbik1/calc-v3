import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"

import { JwtData } from "@/app/api/interface"
import { COOKIE_KEYS } from "@/utils/constants"
import { supabaseServ } from "@/utils/supabaseUser"

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

  const currentTime = Math.floor(Date.now() / 1000)
  if (decoded.exp < currentTime) {
    return NextResponse.json({ error: "expired" }, { status: 401 })
  }

  const { filters } = await request.json()

  if (!Array.isArray(filters)) {
    return NextResponse.json({ error: "invalid_data" }, { status: 400 })
  }

  const { data: filtersData, error: fetchError } = await supabaseServ
    .from("filters")
    .select("filters_formulas")
    .eq("user_id", decoded.user_id)
    .single()

  if (fetchError && fetchError.code !== "PGRST116") {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  // Если записи нет, создаём новую
  if (!filtersData) {
    const { data: newFiltersData, error: insertError } = await supabaseServ
      .from("filters")
      .insert({
        user_id: decoded.user_id,
        filters_formulas: { 0: filters }, // Создаём запись с ключом 0
      })
      .select("filters_formulas")
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ filters: newFiltersData.filters_formulas })
  }

  // Если запись есть, добавляем новый фильтр с следующим номером
  const existingFilters = filtersData.filters_formulas

  // Находим следующий доступный номер
  const nextKey = Object.keys(existingFilters).length // Например, если есть 0, следующий будет 1

  // Добавляем новый фильтр
  existingFilters[nextKey] = filters

  // Обновляем запись в базе данных
  const { data: updatedFiltersData, error: updateError } = await supabaseServ
    .from("filters")
    .update({ filters_formulas: existingFilters })
    .eq("user_id", decoded.user_id)
    .select("filters_formulas")
    .single()

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Возвращаем обновлённые данные
  return NextResponse.json({ filters: updatedFiltersData.filters_formulas })
}
