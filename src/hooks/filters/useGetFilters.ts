"use client"

import { useMutation } from "@tanstack/react-query"

import { API_ROUTES } from "@/utils/constants"

type ResponseSuccess = { filters: { [key: number]: Array<string> } }

type ResponseError = { error: string }

type FetchGetFiltersResponse =
  | { success: true; result: ResponseSuccess }
  | { success: false; result: ResponseError }

async function getFilters(): Promise<FetchGetFiltersResponse> {
  const response = await fetch(API_ROUTES.formulas.filters.get, {
    method: "GET",
    credentials: "same-origin",
  }).catch((error) => error)

  const res = response.json ? await response.json().catch((e: Error) => e) : {}

  if (response.ok) {
    return { success: true, result: res }
  }

  return { success: false, result: res }
}

export const useGetFilters = () =>
  useMutation({
    mutationFn: () => getFilters(),
  })
