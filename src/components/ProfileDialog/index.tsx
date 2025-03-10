import { Dispatch, SetStateAction } from "react"

import Cookies from "js-cookie"

import ProfileIcon from "@/assets/icons/profile_icon.svg"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { COOKIE_KEYS } from "@/utils/constants"

export const ProfileDialog = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const handleLogout = () => {
    Cookies.remove(COOKIE_KEYS.token)
    setOpen(false)
    window.location.reload()
    return
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <div className="h-6 w-6">
          <ProfileIcon />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ваш профиль</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4"></div>
        <DialogFooter className="w-full !justify-between">
          <Button onClick={handleLogout}>Выйти</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
