import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const SECRET_KEY = process.env.NEXT_JWT_SECRET as string

  const token = jwt.sign({ login: body.login }, SECRET_KEY, { expiresIn: "7d" })

  const response = NextResponse.json({ success: true })

  response.headers.append(
    "Set-Cookie",
    `token=${token}; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`,
  )

  return response
}
