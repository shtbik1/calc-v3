import { configureStore } from "@reduxjs/toolkit"

import routingReducer from "@/store/routingSlice/routingSlice"
import authReducer from "@/store/slices/authSlice"

const store = configureStore({
  reducer: {
    authToken: authReducer,
    routing: routingReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
