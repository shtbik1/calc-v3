"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Inter as FontSans } from "next/font/google"
import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"
import "./globals.css"

import { Header } from "@/components/Header"
import store from "@/store"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const client = new QueryClient()

  return (
    <html lang="ru">
      <body
        className={`${fontSans.variable} min-h-screen bg-pagebg antialiased`}
      >
        <Provider store={store}>
          <QueryClientProvider client={client}>
            <ToastContainer position="bottom-center" />
            <Header />
            {children}
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  )
}
