import crypto from "crypto"
import { writeFile } from "fs/promises"
import { homedir } from "os"
import { join } from "path"

import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const signature = formData.get("signature") as string
    const encryptedKeyData = formData.get("encryptedKeyData") as string

    if (!file || !signature || !encryptedKeyData) {
      return NextResponse.json(
        { error: "File, signature and encrypted key data are required" },
        { status: 400 },
      )
    }

    // Читаем содержимое зашифрованного файла
    const encryptedBuffer = Buffer.from(await file.arrayBuffer())

    try {
      // Расшифровываем данные ключа
      const privateKeyBuffer = Buffer.from(
        process.env.NEXT_PRIVATE_KEY || "",
        "base64",
      )
      const decryptedKeyData = crypto.privateDecrypt(
        privateKeyBuffer,
        Buffer.from(encryptedKeyData, "base64"),
      )

      // Парсим данные ключа и IV
      const { key, iv } = JSON.parse(decryptedKeyData.toString())

      // Расшифровываем файл
      const keyBuffer = Buffer.from(key, "base64")
      const ivBuffer = Buffer.from(iv, "base64")

      const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        keyBuffer,
        ivBuffer,
      )
      const decrypted = Buffer.concat([
        decipher.update(encryptedBuffer),
        decipher.final(),
      ])

      // Проверяем ЭЦП оригинального файла
      const verify = crypto.createVerify("SHA256")
      verify.update(decrypted)

      // Декодируем публичный ключ из base64
      const publicKeyBuffer = Buffer.from(
        process.env.NEXT_PUBLIC_KEY || "",
        "base64",
      )
      const isValid = verify.verify(
        publicKeyBuffer,
        Buffer.from(signature, "base64"),
      )

      if (!isValid) {
        return NextResponse.json({
          valid: false,
          message: "Digital signature verification failed",
        })
      }

      // Сохраняем расшифрованный файл на рабочем столе
      const desktopPath = join(homedir(), "Desktop")
      const fileName = `decrypted-${file.name}`
      const filePath = join(desktopPath, fileName)
      await writeFile(filePath, decrypted)

      return NextResponse.json({
        valid: true,
        message: "File verified and decrypted successfully",
        filePath: filePath,
      })
    } catch (decryptError) {
      console.error("Decryption error:", decryptError)
      return NextResponse.json({
        valid: false,
        message:
          "Failed to decrypt file. Please check if the encrypted key data is correct.",
      })
    }
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 },
    )
  }
}
