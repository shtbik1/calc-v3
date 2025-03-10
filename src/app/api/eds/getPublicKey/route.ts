import { NextResponse } from "next/server"

import { publicKey } from "@/utils/constants"

// ЭЦП

export async function GET() {
  return NextResponse.json({ publicKey })
}
