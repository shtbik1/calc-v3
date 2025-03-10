// ЭЦП

import { NextResponse } from "next/server"
import NodeRSA from "node-rsa"

import { privateKey } from "@/utils/constants"

export async function GET() {
  try {
    const message = Math.random().toString(36).substring(7) // Генерация случайного сообщения
    const key = new NodeRSA(privateKey)

    // Преобразуем сообщение в Buffer
    const messageBuffer = Buffer.from(message, "utf8")
    const signature = key.sign(messageBuffer, "base64")

    return NextResponse.json({ message, signature })
  } catch (error) {
    console.error("Ошибка при генерации сообщения:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
