import crypto from "crypto"

import { NextResponse } from "next/server"
import NodeRSA from "node-rsa"

import { privateKey } from "@/utils/constants"

export async function POST(request: Request) {
  const { message } = await request.json()

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 })
  }

  const hash = crypto.createHash("sha256").update(message).digest()

  const key = new NodeRSA(privateKey)
  const signature = key.sign(hash, "base64")

  return NextResponse.json({ message, signature })
}
