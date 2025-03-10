"use client"

import { useEffect, useState } from "react"

import Cookies from "js-cookie"
import jwt from "jsonwebtoken"
import { usePathname, useRouter } from "next/navigation"

import { COOKIE_KEYS, ROUTES } from "@/utils/constants"

import { LoginDialog } from "../LoginDialog"
import { ProfileDialog } from "../ProfileDialog"
import { Button } from "../ui/button"

export const Header = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [displayButton, setDisplayButton] = useState(false)

  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const buttonOnClick = () => {
    if (pathname.includes(ROUTES.formulas.root))
      router.replace(ROUTES.search.root)
    return
  }

  const token = Cookies.get(COOKIE_KEYS.token)

  useEffect(() => {
    if (pathname && pathname.includes(ROUTES.formulas.root)) {
      setDisplayButton(true)
    }
    if (pathname && pathname.includes(ROUTES.search.root)) {
      setDisplayButton(false)
    }
  }, [pathname])

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwt.decode(token) as { exp: number } | null
        if (decodedToken && decodedToken.exp) {
          const currentTime = Date.now() / 1000

          if (decodedToken.exp > currentTime) {
            setIsLogin(true)
            return
          } else {
            setIsLogin(false)
            Cookies.remove("token")
            return
          }
        }
      } catch (error) {
        console.error("Error decoding token:", error)
        setIsLogin(false)
      }
    } else {
      setIsLogin(false)
    }
  }, [token])

  return (
    <div
      className={`${pathname.includes("eds") ? "hidden" : ""} p-4 h-[72px] flex justify-between ${!displayButton && "flex-row-reverse"}`}
    >
      {displayButton && <Button onClick={buttonOnClick}>Назад</Button>}
      {!isLogin && <LoginDialog open={isLoginOpen} setOpen={setIsLoginOpen} />}
      {isLogin && (
        <ProfileDialog open={isProfileOpen} setOpen={setIsProfileOpen} />
      )}
    </div>
  )
}
