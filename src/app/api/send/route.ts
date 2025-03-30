import crypto from "crypto"
import { writeFile } from "fs/promises"
import { tmpdir } from "os"
import { join } from "path"

import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Конфигурация email
const transporter = nodemailer.createTransport({
  host: process.env.NEXT_SMTP_HOST,
  port: Number(process.env.NEXT_SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.NEXT_SMTP_USER,
    pass: process.env.NEXT_SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: true,
  },
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const email = formData.get("email") as string

    if (!file || !email) {
      return NextResponse.json(
        { error: "File and email are required" },
        { status: 400 },
      )
    }

    // Читаем содержимое файла
    const buffer = Buffer.from(await file.arrayBuffer())

    // Создаем рандомный ключ шифрования
    const key = crypto.randomBytes(32)
    const iv = crypto.randomBytes(16)

    // Шифруем файл
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv)
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()])

    // Создаем ЭЦП
    const sign = crypto.createSign("SHA256")
    sign.update(buffer)

    // Декодируем приватный ключ из base64
    const privateKeyBuffer = Buffer.from(
      process.env.NEXT_PRIVATE_KEY || "",
      "base64",
    )
    const signature = sign.sign(privateKeyBuffer)

    // Сохраняем зашифрованный файл во временную директорию
    const tempPath = join(tmpdir(), `encrypted-${Date.now()}.bin`)
    await writeFile(tempPath, encrypted)

    // Отправляем email
    await transporter.sendMail({
      from: process.env.NEXT_SMTP_USER,
      to: email,
      subject: "Encrypted File with Digital Signature",
      text: `Please find attached the encrypted file and its digital signature.\n\nDigital Signature: ${signature.toString("base64")}\nEncryption Key: ${key.toString("base64")}\nIV: ${iv.toString("base64")}`,
      html: `
        <p>Please find attached the encrypted file and its digital signature.</p>
        <p><strong>Digital Signature:</strong> ${signature.toString("base64")}</p>
        <p><strong>Encryption Key:</strong> ${key.toString("base64")}</p>
        <p><strong>IV:</strong> ${iv.toString("base64")}</p>
      `,
      attachments: [
        {
          filename: file.name,
          path: tempPath,
        },
      ],
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 },
    )
  }
}
