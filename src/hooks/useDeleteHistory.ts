"use client"

import { useMutation } from "@tanstack/react-query"

import { API_ROUTES } from "@/utils/constants"

type ResponseSuccess = null

type ResponseError = { error: string }

type FetchDeleteHistoryResponse =
  | { success: true; result: ResponseSuccess }
  | { success: false; result: ResponseError }

async function deleteHistory(): Promise<FetchDeleteHistoryResponse> {
  const response = await fetch(API_ROUTES.formulas.history.delete, {
    method: "DELETE",
    credentials: "same-origin",
  }).catch((error) => error)

  const res = response.json ? await response.json().catch((e: Error) => e) : {}

  if (response.ok) {
    return { success: true, result: res }
  }

  return { success: false, result: res }
}

export const useDeleteHistory = () =>
  useMutation({
    mutationFn: () => deleteHistory(),
  })
