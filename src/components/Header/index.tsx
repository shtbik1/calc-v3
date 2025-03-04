"use client"

import { useEffect, useState } from "react"

import { usePathname, useRouter } from "next/navigation"

import { ROUTES } from "@/utils/constants"

import { LoginDialog } from "../LoginDialog"
import { Button } from "../ui/button"

export const Header = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [displayButton, setDisplayButton] = useState(false)
  const [isLogin, setIsLogin] = useState<false | string>(false)
  const [isOpen, setIsOpen] = useState(false)
  const buttonOnClick = () => {
    if (pathname.includes(ROUTES.formulas.root))
      router.replace(ROUTES.search.root)
    return
  }

  useEffect(() => {
    if (pathname && pathname.includes(ROUTES.formulas.root)) {
      setDisplayButton(true)
    }
    if (pathname && pathname.includes(ROUTES.search.root)) {
      setDisplayButton(false)
    }
  }, [pathname])

  return (
    <div className="p-4 h-[72px] flex justify-between">
      {displayButton && <Button onClick={buttonOnClick}>Назад</Button>}
      {!isLogin && <LoginDialog open={isOpen} setOpen={setIsOpen} />}
      {/* {isLogin &&} */}
    </div>
  )
}
