"use client"

import { useMutation } from "@tanstack/react-query"

import { API_ROUTES } from "@/utils/constants"

type ResponseSuccess = Array<{ name: string; link: string; category: string }>

type ResponseError = { error: string }

type FetchFormulasResponse =
  | { success: true; result: ResponseSuccess }
  | { success: false; result: ResponseError }

async function fetchFormulas(): Promise<FetchFormulasResponse> {
  const response = await fetch(API_ROUTES.formulas.getFormulas, {
    method: "GET",
  }).catch((error) => error)

  const res = response.json ? await response.json().catch((e: Error) => e) : {}

  if (response.ok) {
    return { success: true, result: res }
  }

  return { success: false, result: res }
}

export const useGetFormulas = () =>
  useMutation({
    mutationFn: () => fetchFormulas(),
  })
