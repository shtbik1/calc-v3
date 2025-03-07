import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

import { supabaseServ } from "@/utils/superbaseUser"

export async function POST(req: Request) {
  const body = await req.json()
  const SECRET_JWT = process.env.NEXT_JWT_SECRET as string

  const { data: existingUser, error: fetchError } = await supabaseServ
    .from("users")
    .select("login")
    .eq("login", body.login)
    .single()

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error fetching user:", fetchError)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }

  if (existingUser) {
    return NextResponse.json({ error: "duplicate" }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(body.password, 10)

  const { data: newUser, error: insertError } = await supabaseServ
    .from("users")
    .insert([{ login: body.login, password: hashedPassword }])
    .select("login")

  if (insertError) {
    console.error("Error inserting user:", insertError)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }

  const token = jwt.sign({ login: body.login }, SECRET_JWT, { expiresIn: "7d" })

  const response = NextResponse.json({ success: true, user: newUser })
  response.headers.append(
    "Set-Cookie",
    `token=${token}; Path=/; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`,
  )

  return response
}
