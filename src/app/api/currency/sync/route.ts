import { NextResponse } from "next/server"

import { supabaseServ } from "@/utils/supabaseUser"

interface ExchangeRate {
  date: string
  currency: string
  amount: number
  rate: number
}

export async function POST(req: Request) {
  try {
    const { currencies } = await req.json()

    if (!currencies || !Array.isArray(currencies) || currencies.length === 0) {
      return NextResponse.json(
        { error: "Invalid request data. Currencies array is required." },
        { status: 400 },
      )
    }

    // Get current date in Czech time (CET/CEST)
    const now = new Date()
    const czechTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Europe/Prague" }),
    )

    // If before 14:30 CET, use yesterday's date
    const targetDate = new Date(czechTime)
    if (
      czechTime.getHours() < 14 ||
      (czechTime.getHours() === 14 && czechTime.getMinutes() < 30)
    ) {
      targetDate.setDate(targetDate.getDate() - 1)
    }

    // Format date as DD.MM.YYYY
    const formattedDate = `${targetDate.getDate().toString().padStart(2, "0")}.${(targetDate.getMonth() + 1).toString().padStart(2, "0")}.${targetDate.getFullYear()}`

    // Fetch exchange rates from CNB API with date in query parameter
    const response = await fetch(
      `https://www.cnb.cz/en/financial_markets/foreign_exchange_market/exchange_rate_fixing/daily.txt?date=${formattedDate}`,
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch exchange rates. Status: ${response.status}` },
        { status: response.status },
      )
    }

    const text = await response.text()
    console.log(formattedDate)
    console.log("Text:", text)

    const lines = text.split("\n")

    if (lines.length < 3) {
      return NextResponse.json(
        { error: "Invalid response format from CNB API" },
        { status: 500 },
      )
    }

    // Parse the date from the first line
    const dateMatch = lines[0].match(/(\d{1,2} \w{3} \d{4})/)
    if (!dateMatch) {
      return NextResponse.json(
        { error: "Could not parse date from CNB API response" },
        { status: 500 },
      )
    }

    // Format date as YYYY-MM-DD without timezone
    const parsedDate = new Date(dateMatch[1])
    const isoDate = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1).toString().padStart(2, "0")}-${parsedDate.getDate().toString().padStart(2, "0")}`

    // Skip header lines and parse rates
    const rates = lines.slice(2).map((line) => {
      const [country, currency, amount, code, rate] = line.split("|")
      return {
        date: isoDate,
        currency: code,
        amount: parseInt(amount),
        rate: parseFloat(rate),
      }
    })

    // Filter rates based on selected currencies
    const filteredRates = rates.filter((rate) =>
      currencies.includes(rate.currency),
    )

    if (filteredRates.length === 0) {
      return NextResponse.json(
        { error: "No matching currencies found in the response" },
        { status: 404 },
      )
    }

    // Delete existing rates for this date and currencies
    const { error: deleteError } = await supabaseServ
      .from("currency_rates")
      .delete()
      .eq("date", isoDate)
      .in("currency", currencies)

    if (deleteError) {
      console.error("Database error (delete):", deleteError)
      return NextResponse.json(
        { error: `Database error: ${deleteError.message}` },
        { status: 500 },
      )
    }

    // Insert new rates
    const { error: insertError } = await supabaseServ
      .from("currency_rates")
      .insert(filteredRates)

    if (insertError) {
      console.error("Database error (insert):", insertError)
      return NextResponse.json(
        { error: `Database error: ${insertError.message}` },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${filteredRates.length} exchange rates`,
      data: {
        date: isoDate,
        rates: filteredRates,
      },
    })
  } catch (error) {
    console.error("Error syncing exchange rates:", error)
    return NextResponse.json(
      {
        error: "Failed to sync exchange rates",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
