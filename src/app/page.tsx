"use client"

import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}
