"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Inter as FontSans } from "next/font/google"
import { ToastContainer } from "react-toastify"

import "./globals.css"
import { Header } from "@/components/Header"

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
        <QueryClientProvider client={client}>
          <ToastContainer position="bottom-center" />
          <Header />
          {children}
        </QueryClientProvider>
      </body>
    </html>
  )
}
