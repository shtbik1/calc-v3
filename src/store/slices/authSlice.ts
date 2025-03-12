"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthTokenState {
  authToken: string | null
}

const initialState: AuthTokenState = {
  authToken: "",
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string | null>) => {
      state.authToken = action.payload
      localStorage.setItem("authToken", action.payload || "")
    },
  },
})

export const { setAuthToken } = authSlice.actions

export default authSlice.reducer
