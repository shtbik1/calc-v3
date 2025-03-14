import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"

import { JwtData } from "@/app/api/interface"
import { COOKIE_KEYS } from "@/utils/constants"

const SECRET_JWT = process.env.NEXT_JWT_SECRET as string

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_KEYS.token)
  if (!token || !token.value) {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 })
  }

  let decoded: JwtData
  try {
    decoded = jwt.verify(token.value, SECRET_JWT) as JwtData
  } catch (error) {
    return NextResponse.json({ error: "invalid_token" }, { status: 401 })
  }

  const currentTime = Math.floor(Date.now() / 1000)
  if (decoded.exp < currentTime) {
    return NextResponse.json({ error: "expired" }, { status: 401 })
  }

  return NextResponse.json({ login: decoded.login }, { status: 200 })
}
