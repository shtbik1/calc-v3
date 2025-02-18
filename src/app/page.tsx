"use client"

import { useEffect } from "react"

import { useRouter } from "next/navigation"

import { ROUTES } from "@/utils/constants"

const MainPage = () => {
  const router = useRouter()
  useEffect(() => {
    router.replace(ROUTES.search.root)
  }, [])
}

export default MainPage
