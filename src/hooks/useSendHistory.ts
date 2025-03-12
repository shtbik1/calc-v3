"use client"

import { useMutation } from "@tanstack/react-query"

import { API_ROUTES } from "@/utils/constants"

type ResponseSuccess = null

type ResponseError = { error: string }

type FetchSendHistoryResponse =
  | { success: true; result: ResponseSuccess }
  | { success: false; result: ResponseError }

type PayloadData = {
  formulaLink: string
  formulaName: string
}

async function sendHistory(
  data: PayloadData,
): Promise<FetchSendHistoryResponse> {
  const response = await fetch(API_ROUTES.formulas.addHistory, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({
      formulaLink: data.formulaLink,
      formulaName: data.formulaName,
    }),
  }).catch((error) => error)

  const res = response.json ? await response.json().catch((e: Error) => e) : {}

  if (response.ok) {
    return { success: true, result: res }
  }

  return { success: false, result: res }
}

export const useSendHistory = () =>
  useMutation({
    mutationFn: (data: PayloadData) => sendHistory(data),
  })
