"use client"

import { useMutation } from "@tanstack/react-query"

import { API_ROUTES } from "@/utils/constants"

type ResponseSuccess = { filters: Array<string> }

type ResponseError = { error: string }

type FetchSendFiltersResponse =
  | { success: true; result: ResponseSuccess }
  | { success: false; result: ResponseError }

type PayloadData = { filters: Array<string> }

async function sendFilters(
  data: PayloadData,
): Promise<FetchSendFiltersResponse> {
  const response = await fetch(API_ROUTES.formulas.filters.add, {
    method: "POST",
    credentials: "same-origin",
    body: JSON.stringify(data),
  }).catch((error) => error)

  const res = response.json ? await response.json().catch((e: Error) => e) : {}

  if (response.ok) {
    return { success: true, result: res }
  }

  return { success: false, result: res }
}

export const useSendFilters = () =>
  useMutation({
    mutationFn: (data: PayloadData) => sendFilters(data),
  })
