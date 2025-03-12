"use client"

import { useEffect, useState } from "react"

import Cookies from "js-cookie"
import { useDispatch } from "react-redux"

import { setAuthToken } from "@/store/slices/authSlice"
import { COOKIE_KEYS } from "@/utils/constants"

type FieldsProps = "authToken"

export const useRestoreAdminData = (fields: FieldsProps[]) => {
  const dispatch = useDispatch()

  const [restored, setRestored] = useState(false)

  useEffect(() => {
    fields.map((item) => {
      switch (item) {
        case "authToken": {
          const localAuthToken = Cookies.get(COOKIE_KEYS.token)
          if (localAuthToken) {
            dispatch(setAuthToken(localAuthToken))
          }
          break
        }

        default:
          break
      }

      return null
    })
    setRestored(true)
  }, [])

  return { restored }
}
