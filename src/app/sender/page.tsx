"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function SenderPage() {
  const [file, setFile] = useState<File | null>(null)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    valid: boolean
    message: string
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
    if (!file || !email) {
      setResult({
        valid: false,
        message: "Please select a file and enter recipient email",
      })
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("email", email)

      const response = await fetch("/api/send", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          valid: true,
          message: "File sent successfully!",
        })
        setFile(null)
        setEmail("")
      } else {
        setResult({
          valid: false,
          message: `Error: ${data.error}`,
        })
      }
    } catch (error) {
      console.error("Error:", error)
      setResult({
        valid: false,
        message: "Failed to send file",
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
          <CardTitle>Send Encrypted File</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select File</label>
              <Input
                type="file"
                onChange={handleFileChange}
                accept="*/*"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Recipient Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="recipient@example.com"
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send File"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/receiver")}
              >
                Go to Receiver Page
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
