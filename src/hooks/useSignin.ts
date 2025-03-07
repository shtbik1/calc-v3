"use client"

import { useMutation } from "@tanstack/react-query"

type ResponseSuccess = { token: string }

type ResponseError = { error: string }

export type FetchCarsResponse =
  | { success: true; result: ResponseSuccess }
  | { success: false; result: ResponseError }

type PayloadData = {
  login: string
  password: string
}

async function tryLogin(data: PayloadData): Promise<FetchCarsResponse> {
  const response = await fetch("/api/signin", {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((error) => error)

  const res = response.json ? await response.json().catch((e: Error) => e) : {}

  console.log(res)

  if (response.ok) {
    return { success: true, result: res }
  }

  return { success: false, result: res }
}

export const useSignin = () =>
  useMutation({
    mutationFn: (data: PayloadData) => tryLogin(data),
  })
