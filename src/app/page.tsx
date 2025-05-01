"use client"

import { useEffect } from "react"

import { useRouter } from "next/navigation"

import { ROUTES } from "@/utils/constants"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace(ROUTES.search.root)
  }, [])
}
