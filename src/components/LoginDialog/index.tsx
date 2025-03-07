import { Dispatch, SetStateAction, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLogin } from "@/hooks/useLogin"

export const LoginDialog = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const { mutateAsync: tryLogin, isPending: loginPending } = useLogin()

  const [userData, setUserData] = useState<{ login: string; password: string }>(
    { login: "", password: "" },
  )

  const handleUserInput = (key: string, value: string) => {
    setUserData((prev) => ({ ...prev, [key]: value }))
  }

  const handleLoginClick = async () => {
    const res = await tryLogin(userData)
    if (res.success) {
      console.log(res.result)
    }
    if (!res.success) {
      console.log(res.result.reason)
    }
  }

  const buttonDisabled = !userData.login || !userData.password || loginPending

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button>Войти</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Войти в аккаунт</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="login">Логин</Label>
            <Input
              onChange={(event) =>
                handleUserInput(event.target.name, event.target.value)
              }
              value={userData.login}
              type="text"
              name="login"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              onChange={(event) =>
                handleUserInput(event.target.name, event.target.value)
              }
              value={userData.password}
              type="password"
              name="password"
            />
          </div>
        </div>
        <DialogFooter className="w-full !justify-between">
          <Button variant="link" className="flex flex-col gap-2 p-1">
            Нет аккаунта? Регистрация
          </Button>
          <Button disabled={buttonDisabled} onClick={handleLoginClick}>
            Войти
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
