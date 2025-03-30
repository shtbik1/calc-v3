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
      // Сначала проверяем подпись зашифрованного файла
      const verify = crypto.createVerify("SHA256")
      verify.update(encryptedBuffer)

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
          message:
            "Digital signature verification failed. The encrypted file might have been tampered with.",
          error: "Invalid signature",
        })
      }

      // Если подпись верна, расшифровываем данные ключа
      const privateKeyBuffer = Buffer.from(
        process.env.NEXT_PRIVATE_KEY || "",
        "base64",
      )
      let decryptedKeyData: Buffer
      try {
        decryptedKeyData = crypto.privateDecrypt(
          privateKeyBuffer,
          Buffer.from(encryptedKeyData, "base64"),
        )
      } catch (error) {
        return NextResponse.json({
          valid: false,
          message:
            "Failed to decrypt key data. Please check if the encrypted key data is correct.",
          error: "Invalid encrypted key data format",
        })
      }

      // Парсим данные ключа и IV
      let key: string, iv: string
      try {
        const parsedData = JSON.parse(decryptedKeyData.toString())
        key = parsedData.key
        iv = parsedData.iv
      } catch (error) {
        return NextResponse.json({
          valid: false,
          message:
            "Invalid key data format. The decrypted data is not in the expected format.",
          error: "Invalid key data structure",
        })
      }

      // Расшифровываем файл
      const keyBuffer = Buffer.from(key, "base64")
      const ivBuffer = Buffer.from(iv, "base64")

      let decrypted: Buffer
      try {
        const decipher = crypto.createDecipheriv(
          "aes-256-cbc",
          keyBuffer,
          ivBuffer,
        )
        decrypted = Buffer.concat([
          decipher.update(encryptedBuffer),
          decipher.final(),
        ])
      } catch (error) {
        return NextResponse.json({
          valid: false,
          message:
            "Failed to decrypt file. The encryption key or IV might be incorrect.",
          error: "File decryption failed",
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
          "Failed to process file. Please check if all provided data is correct.",
        error: "Processing error",
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
