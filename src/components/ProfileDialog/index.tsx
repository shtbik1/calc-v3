"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"

import Cookies from "js-cookie"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"

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
import { Skeleton } from "@/components/ui/skeleton"
import { useDeleteHistory } from "@/hooks/useDeleteHistory"
import { useGetProfileInfo } from "@/hooks/useGetProfileInfo"
import { setClearHistoryAction } from "@/store/slices/actionsSlice"
import { setAuthToken } from "@/store/slices/authSlice"
import { COOKIE_KEYS } from "@/utils/constants"

export const ProfileDialog = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const dispath = useDispatch()

  const { mutateAsync: getInfo, isPending: getInfoPending } =
    useGetProfileInfo()
  const { mutateAsync: deleteHistory, isPending: deleteHistoryPending } =
    useDeleteHistory()

  const [profileLogin, setProfileLogin] = useState("")

  const disabled = deleteHistoryPending || getInfoPending

  const handleLogout = () => {
    Cookies.remove(COOKIE_KEYS.token)
    dispath(setAuthToken(null))
    setOpen(false)
  }

  const handleClearHistory = async () => {
    const res = await deleteHistory()
    if (res.success) {
      dispath(setClearHistoryAction(true))
      toast.success("История успешно очищена")
    }
    if (!res.success) {
      toast.error("Ошибка при попытке очистить историю")
    }
  }

  useEffect(() => {
    ;(async () => {
      if (open) {
        const res = await getInfo()
        if (res.success) {
          setProfileLogin(res.result.login)
        }
        if (!res.success) {
          toast.error("Error while loading profile info")
        }
      }
    })()

    return () => {
      setProfileLogin("")
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <div className="h-6 w-6">
          <ProfileIcon />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Приветствуем,{" "}
            {getInfoPending && !profileLogin && (
              <Skeleton className="h-[22px] w-100" />
            )}
            {profileLogin}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <p>Доступные возможности:</p>
          <Button disabled={disabled} onClick={handleClearHistory}>
            Очистить историю посещения
          </Button>
        </div>
        <DialogFooter className="w-full !justify-between">
          <Button disabled={disabled} onClick={handleLogout}>
            Выйти
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
