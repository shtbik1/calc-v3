"use client"

import { useMutation } from "@tanstack/react-query"

import { API_ROUTES } from "@/utils/constants"

type ResponseSuccess = Array<{ name: string; link: string }>

type ResponseError = { error: string }

type FetchSendFavoriteResponse =
  | { success: true; result: ResponseSuccess }
  | { success: false; result: ResponseError }

type PayloadData = {
  formulaLink: string
}

async function sendFavorite(
  data: PayloadData,
): Promise<FetchSendFavoriteResponse> {
  const response = await fetch(API_ROUTES.formulas.favorite.add, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({ formulaLink: data.formulaLink }),
  }).catch((error) => error)

  const res = response.json ? await response.json().catch((e: Error) => e) : {}

  if (response.ok) {
    return { success: true, result: res }
  }

  return { success: false, result: res }
}

export const useSendFavorite = () =>
  useMutation({
    mutationFn: (data: PayloadData) => sendFavorite(data),
  })
