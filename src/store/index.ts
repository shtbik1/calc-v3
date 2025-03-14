import { configureStore } from "@reduxjs/toolkit"

import routingReducer from "@/store/routingSlice/routingSlice"
import actionsReducer from "@/store/slices/actionsSlice"
import authReducer from "@/store/slices/authSlice"

const store = configureStore({
  reducer: {
    actionsState: actionsReducer,
    authToken: authReducer,
    routing: routingReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
