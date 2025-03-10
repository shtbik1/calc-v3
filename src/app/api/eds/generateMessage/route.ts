import crypto from "crypto"

import { NextResponse } from "next/server"
import NodeRSA from "node-rsa"

import { privateKey } from "@/utils/constants"

export async function GET() {
  try {
    const message = crypto.randomUUID()
    const key = new NodeRSA(privateKey)

    const hash = crypto.createHash("sha256").update(message, "utf8").digest()

    const signature = key.sign(hash, "base64", "buffer")

    return NextResponse.json({ message, signature })
  } catch (error) {
    console.error("Ошибка при генерации сообщения:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
