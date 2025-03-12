import { NextResponse } from "next/server"

import { supabase } from "@/utils/supabaseUser"

export async function GET() {
  const { data, error } = await supabase
    .from("formulas_names")
    .select("name, link")

  if (error) {
    return NextResponse.error()
  }

  return NextResponse.json(data)
}
