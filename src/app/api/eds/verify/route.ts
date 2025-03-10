import crypto from "crypto"

import { NextRequest, NextResponse } from "next/server"
import NodeRSA from "node-rsa"

import { publicKey } from "@/utils/constants"

export async function POST(request: NextRequest) {
  try {
    const { message, signature } = await request.json()

    if (!message || !signature) {
      return NextResponse.json(
        { error: "Message and signature are required" },
        { status: 400 },
      )
    }

    const key = new NodeRSA(publicKey)

    const hash = crypto.createHash("sha256").update(message).digest()

    const isValid = key.verify(hash, signature, "buffer", "base64")

    return NextResponse.json({
      isValid,
      message,
      calculatedHash: Buffer.from(hash).toString("hex"),
    })
  } catch (error) {
    console.error("Ошибка при верификации:", error)
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
