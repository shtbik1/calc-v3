"use client"

import { useMutation } from "@tanstack/react-query"

import { API_ROUTES } from "@/utils/constants"

type ResponseSuccess = {
  login: string
}

type ResponseError = { error: string }

type FetchGetProfileInfoResponse =
  | { success: true; result: ResponseSuccess }
  | { success: false; result: ResponseError }

async function getProfileInfo(): Promise<FetchGetProfileInfoResponse> {
  const response = await fetch(API_ROUTES.profile.getInfo, {
    method: "GET",

    credentials: "same-origin",
  }).catch((error) => error)

  const res = response.json ? await response.json().catch((e: Error) => e) : {}

  if (response.ok) {
    return { success: true, result: res }
  }

  return { success: false, result: res }
}

export const useGetProfileInfo = () =>
  useMutation({
    mutationFn: () => getProfileInfo(),
  })
