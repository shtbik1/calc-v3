"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Secure File Transfer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button className="w-full" onClick={() => router.push("/sender")}>
              Send Encrypted File
            </Button>

            <Button
              className="w-full"
              variant="outline"
              onClick={() => router.push("/receiver")}
            >
              Receive and Decrypt File
            </Button>
          </div>

          <div className="mt-8 text-sm text-gray-600">
            <h2 className="font-medium mb-2">How it works:</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                To send a file:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Click &quot;Send Encrypted File&quot;</li>
                  <li>Select your file</li>
                  <li>Enter recipient&apos;s email</li>
                  <li>Click &quot;Send File&quot;</li>
                </ul>
              </li>
              <li>
                To receive a file:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Click &quot;Receive and Decrypt File&quot;</li>
                  <li>Enter your email</li>
                  <li>Click &quot;Check Inbox&quot;</li>
                  <li>Select the file and enter decryption details</li>
                  <li>Click &quot;Verify and Decrypt&quot;</li>
                </ul>
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
