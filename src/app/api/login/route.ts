import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return NextResponse.json({ token: body.login + body.password })
}
