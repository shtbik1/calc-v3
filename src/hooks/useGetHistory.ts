"use client"

import { useMutation } from "@tanstack/react-query"

import { API_ROUTES } from "@/utils/constants"

type ResponseSuccess = {
  history: { [key: string]: { addedAt: string; formulaName: string } } | {}
}

type ResponseError = { error: string }

type FetchGetHistoryResponse =
  | { success: true; result: ResponseSuccess }
  | { success: false; result: ResponseError }

async function getHistory(): Promise<FetchGetHistoryResponse> {
  const response = await fetch(API_ROUTES.formulas.getHistory, {
    method: "GET",
    credentials: "same-origin",
  }).catch((error) => error)

  const res = response.json ? await response.json().catch((e: Error) => e) : {}

  if (response.ok) {
    return { success: true, result: res }
  }

  return { success: false, result: res }
}

export const useGetHistory = () =>
  useMutation({
    mutationFn: () => getHistory(),
  })
