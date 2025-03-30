"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function ReceiverPage() {
  const [file, setFile] = useState<File | null>(null)
  const [signature, setSignature] = useState("")
  const [encryptedKeyData, setEncryptedKeyData] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    valid: boolean
    message: string
    filePath?: string
    error?: string
  } | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !signature || !encryptedKeyData) {
      setResult({
        valid: false,
        message: "Please fill in all fields",
      })
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("signature", signature)
      formData.append("encryptedKeyData", encryptedKeyData)

      const response = await fetch("/api/verify", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error:", error)
      setResult({
        valid: false,
        message: "Failed to verify file",
        error: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Verify and Decrypt File</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Select Encrypted File
              </label>
              <Input
                type="file"
                onChange={handleFileChange}
                accept="*/*"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Digital Signature</label>
              <Input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Enter digital signature"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Encrypted Key Data</label>
              <Input
                type="text"
                value={encryptedKeyData}
                onChange={(e) => setEncryptedKeyData(e.target.value)}
                placeholder="Enter encrypted key data"
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify and Decrypt"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/sender")}
              >
                Go to Sender Page
              </Button>
            </div>
          </form>

          {result && (
            <div
              className={`mt-4 p-4 rounded ${
                result.valid ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <p className={result.valid ? "text-green-800" : "text-red-800"}>
                {result.message}
              </p>
              {result.error && (
                <p className="mt-2 text-sm text-red-800">{result.error}</p>
              )}
              {result.filePath && (
                <p className="mt-2 text-sm text-green-800">
                  Decrypted file saved to Desktop as: decrypted-{file?.name}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
