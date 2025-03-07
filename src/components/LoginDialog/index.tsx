import { Dispatch, SetStateAction, useState } from "react"

import { toast } from "react-toastify"

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
import { useSignin } from "@/hooks/useSignin"
import { useSignup } from "@/hooks/useSignup"

export const LoginDialog = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const { mutateAsync: tryLogin, isPending: loginPending } = useSignin()
  const { mutateAsync: tryReg, isPending: regPending } = useSignup()

  const [task, setTask] = useState<"signin" | "signup">("signin")

  const [userData, setUserData] = useState<{ login: string; password: string }>(
    { login: "", password: "" },
  )

  const handleUserInput = (key: string, value: string) => {
    setUserData((prev) => ({ ...prev, [key]: value }))
  }

  const handleLogin = async () => {
    const res = await tryLogin(userData)
    if (res.success) {
      toast("Успешный вход")
      setOpen(false)
    }

    if (!res.success && res.result.error === "password") {
      toast("Неверный пароль")
    }
    if (!res.success && res.result.error === "missing") {
      toast("Пользователь не найден")
    }
  }

  const handleSignup = async () => {
    const res = await tryReg(userData)
    if (res.success) {
      toast("Успешная регистрация")
      setOpen(false)
    }
    if (!res.success && res.result.error === "duplicate") {
      toast("Пользователь с таким логином уже существует")
    }
  }

  const handleLoginClick = async () => {
    switch (task) {
      case "signin":
        await handleLogin()
        break
      case "signup":
        await handleSignup()
        break
    }
  }

  const handleChangeTask = () => {
    setTask(task === "signin" ? "signup" : "signin")
  }

  const buttonDisabled =
    !userData.login || !userData.password || loginPending || regPending

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button>Войти</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {task === "signin" ? "Вход " : "Регистрация"}
          </DialogTitle>
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
          <Button
            onClick={handleChangeTask}
            variant="link"
            className="flex flex-col gap-2 p-1"
          >
            {task === "signin"
              ? "Нет аккаунта? Регистрация"
              : "Есть аккаунт? Войти"}
          </Button>
          <Button disabled={buttonDisabled} onClick={handleLoginClick}>
            {task === "signin" ? "Войти" : "Регистрация"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
