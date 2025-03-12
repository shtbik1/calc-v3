"use client"

import { useMutation } from "@tanstack/react-query"

import { API_ROUTES } from "@/utils/constants"

type ResponseSuccess = { existingData: { [key: string]: true } }

type ResponseError = { error: string }

type FetchGetFavoriteResponse =
  | { success: true; result: ResponseSuccess }
  | { success: false; result: ResponseError }

async function getFavorite(): Promise<FetchGetFavoriteResponse> {
  const response = await fetch(API_ROUTES.formulas.getFavorite, {
    method: "GET",

    credentials: "same-origin",
  }).catch((error) => error)

  const res = response.json ? await response.json().catch((e: Error) => e) : {}

  if (response.ok) {
    return { success: true, result: res }
  }

  return { success: false, result: res }
}

export const useGetFavorite = () =>
  useMutation({
    mutationFn: () => getFavorite(),
  })
