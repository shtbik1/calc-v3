"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function EDS() {
  const [message, setMessage] = useState("")
  const [signature, setSignature] = useState("")
  const [publicKey, setPublicKey] = useState("")
  const [verificationResult, setVerificationResult] = useState<boolean | null>(
    null,
  )
  const [randomMessage, setRandomMessage] = useState("")
  const [verificationDetails, setVerificationDetails] = useState<{
    calculatedHash?: string
    error?: string
    message?: string
  }>({})

  const handleSign = async () => {
    const response = await fetch("/api/eds/sign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    })
    const data = await response.json()
    setSignature(data.signature)
  }

  const handleVerify = async () => {
    try {
      const response = await fetch("/api/eds/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: randomMessage || message, signature }),
      })
      const data = await response.json()

      if (data.error) {
        setVerificationResult(false)
        setVerificationDetails({
          error: data.error,
          calculatedHash: data.calculatedHash,
        })
      } else {
        setVerificationResult(data.isValid)
        setVerificationDetails({
          calculatedHash: data.calculatedHash,
          message: data.message,
        })
      }
    } catch (error) {
      console.error("Ошибка при верификации:", error)
      setVerificationResult(false)
      setVerificationDetails({
        error: "Произошла ошибка при верификации",
      })
    }
  }

  const handleGetPublicKey = async () => {
    const response = await fetch("/api/eds/getPublicKey")
    const data = await response.json()
    setPublicKey(data.publicKey)
  }

  const handleGenerateMessage = async () => {
    const response = await fetch("/api/eds/generateMessage")
    const data = await response.json()
    setRandomMessage(data.message)
    setSignature(data.signature)
  }

  return (
    <div className="flex gap-4 flex-col p-4">
      <div className="flex flex-col gap-2 max-w-[375px]">
        <h1>Электронная цифровая подпись (ЭЦП)</h1>
        <div className="flex flex-col gap-2 max-w-[375px]">
          <h2>Подписать сообщение</h2>
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите сообщение"
          />
          <Button onClick={handleSign}>Подписать</Button>
          {signature && <p>Подпись: {signature}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2 max-w-[375px]">
        <h2>Верифицировать сообщение</h2>
        <Button onClick={handleVerify}>Верифицировать</Button>
        {verificationResult !== null && (
          <div>
            <p>
              Результат верификации: {verificationResult ? "Успешно" : "Ошибка"}
            </p>
            {verificationDetails.error && (
              <p style={{ color: "red" }}>
                Ошибка: {verificationDetails.error}
              </p>
            )}
            {verificationDetails.message && (
              <p>Сообщение: {verificationDetails.message}</p>
            )}
            {verificationDetails.calculatedHash && (
              <p>Вычисленный хэш: {verificationDetails.calculatedHash}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 max-w-[375px]">
        <h2>Получить публичный ключ</h2>
        <Button onClick={handleGetPublicKey}>Получить ключ</Button>
        {publicKey && <p>Публичный ключ: {publicKey}</p>}
      </div>

      <div className="flex flex-col gap-2 max-w-[375px]">
        <h2>Сгенерировать случайное сообщение</h2>
        <Button onClick={handleGenerateMessage}>Сгенерировать</Button>
        {randomMessage && <p>Случайное сообщение: {randomMessage}</p>}
      </div>
    </div>
  )
}
