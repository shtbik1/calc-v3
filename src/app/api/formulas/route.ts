import { NextResponse } from "next/server"

import { formulas } from "@/utils/formulas"

export async function GET() {
  return NextResponse.json({ formulas })
}
