import { NextResponse } from "next/server"
import NodeRSA from "node-rsa"

import { privateKey } from "@/utils/constants"

// ЭЦП

export async function POST(request: Request) {
  const { message } = await request.json()

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 })
  }

  const key = new NodeRSA(privateKey)
  const signature = key.sign(message, "base64", "utf8")

  return NextResponse.json({ message, signature })
}
