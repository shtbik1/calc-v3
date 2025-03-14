"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type ActionType = boolean | null

interface ActionsState {
  clearHistory: ActionType
}

const initialState: ActionsState = {
  clearHistory: false,
}

const actionsSlice = createSlice({
  name: "actionsState",
  initialState,
  reducers: {
    setClearHistoryAction: (state, action: PayloadAction<ActionType>) => {
      state.clearHistory = action.payload
    },
  },
})

export const { setClearHistoryAction } = actionsSlice.actions

export default actionsSlice.reducer
