import { PostgrestError } from "@supabase/supabase-js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

import { supabaseServ } from "@/utils/supabaseUser"

import { User } from "../interface"

export async function POST(req: Request) {
  const body = await req.json()
  const SECRET_JWT = process.env.NEXT_JWT_SECRET as string

  const {
    data: user,
    error: fetchError,
  }: {
    data: User
    error: PostgrestError | null
  } = await supabaseServ
    .from("users")
    .select("*")
    .eq("login", body.login)
    .single()

  if (fetchError) {
    console.error("Error fetching user:", fetchError)
    return NextResponse.json({ error: "missing" }, { status: 404 })
  }

  const isPasswordValid = await bcrypt.compare(
    body.password,
    user?.password as string,
  )
  if (!isPasswordValid) {
    return NextResponse.json({ error: "password" }, { status: 401 })
  }

  if (user) {
    const token = jwt.sign(
      { login: user.login, user_id: user.user_id },
      SECRET_JWT,
      { expiresIn: "7d" },
    )

    const response = NextResponse.json({
      user: { login: user.login },
      token,
    })
    response.headers.append(
      "Set-Cookie",
      `token=${token}; Path=/; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`,
    )
    return response
  }
}
