import { NextResponse } from "next/server"

import { supabase } from "@/utils/superbaseUser"

export async function GET() {
  const { data, error } = await supabase
    .from("formulas_names")
    .select("name, link") // Указываем только нужные поля

  if (error) {
    return NextResponse.error()
  }

  return NextResponse.json(data)
}
