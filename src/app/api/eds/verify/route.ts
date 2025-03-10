import { NextResponse } from "next/server"
import NodeRSA from "node-rsa"

import { publicKey } from "@/utils/constants"

// ЭЦП

export async function POST(request: Request) {
  try {
    const { message, signature } = await request.json()

    if (!message || !signature) {
      return NextResponse.json(
        { error: "Message and signature are required" },
        { status: 400 },
      )
    }

    const key = new NodeRSA(publicKey)

    // Преобразуем сообщение в Buffer
    const messageBuffer = Buffer.from(message, "utf8")

    // Верификация подписи
    const isValid = key.verify(messageBuffer, signature, "utf8", "base64")

    // Дополнительная информация
    const calculatedHash = key.encrypt(messageBuffer, "base64") // Хэш сообщения

    return NextResponse.json({
      isValid,
      calculatedHash,
      message: "Верификация завершена",
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
