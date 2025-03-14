"use client"

import { useMutation } from "@tanstack/react-query"

import { API_ROUTES } from "@/utils/constants"

type ResponseSuccess = {}
type ResponseError = { error: string }

type FetchDeleteFiltersResponse =
  | { success: true; result: ResponseSuccess }
  | { success: false; result: ResponseError }

type PayloadData = { filters: { [key: number]: Array<string> } }

async function deleteFilters(
  data: PayloadData,
): Promise<FetchDeleteFiltersResponse> {
  const response = await fetch(API_ROUTES.formulas.filters.delete, {
    method: "DELETE",
    credentials: "same-origin",
    body: JSON.stringify(data),
  }).catch((error) => error)

  const res = response.json ? await response.json().catch((e: Error) => e) : {}

  if (response.ok) {
    return { success: true, result: res }
  }

  return { success: false, result: res }
}

export const useDeleteFilters = () =>
  useMutation({
    mutationFn: (data: PayloadData) => deleteFilters(data),
  })
