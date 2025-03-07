import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

import { supabaseServ } from "@/utils/superbaseUser"

export async function POST(req: Request) {
  const body = await req.json()
  const SECRET_JWT = process.env.NEXT_JWT_SECRET as string

  const { data: user, error: fetchError } = await supabaseServ
    .from("users")
    .select("*")
    .eq("login", body.login)
    .single()

  if (fetchError) {
    console.error("Error fetching user:", fetchError)
    return NextResponse.json({ error: "missing" }, { status: 404 })
  }

  const isPasswordValid = await bcrypt.compare(body.password, user.password)
  if (!isPasswordValid) {
    return NextResponse.json({ error: "password" }, { status: 401 })
  }

  const token = jwt.sign({ login: user.login }, SECRET_JWT, { expiresIn: "7d" })

  const response = NextResponse.json({
    success: true,
    user: { login: user.login },
    token,
  })
  response.headers.append(
    "Set-Cookie",
    `token=${token}; Path=/; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`,
  )

  return response
}
