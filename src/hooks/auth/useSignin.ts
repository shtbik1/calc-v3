"use client"

import { useMutation } from "@tanstack/react-query"

import { API_ROUTES } from "@/utils/constants"

type ResponseSuccess = {
  user: { login: string }
  token: string
}

type ResponseError = { error: string }

type FetchTryLoginResponse =
  | { success: true; result: ResponseSuccess }
  | { success: false; result: ResponseError }

type PayloadData = {
  login: string
  password: string
}

async function tryLogin(data: PayloadData): Promise<FetchTryLoginResponse> {
  const response = await fetch(API_ROUTES.auth.signin, {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((error) => error)

  const res = response.json ? await response.json().catch((e: Error) => e) : {}

  if (response.ok) {
    return { success: true, result: res }
  }

  return { success: false, result: res }
}

export const useSignin = () =>
  useMutation({
    mutationFn: (data: PayloadData) => tryLogin(data),
  })
