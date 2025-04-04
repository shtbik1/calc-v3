import { NextResponse } from "next/server"

import { supabaseServ } from "@/utils/supabaseUser"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    // Verify CRON_SECRET
    const cronSecret = req.headers.get("x-vercel-cron-secret")
    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get sync configuration
    const { data: config, error: configError } = await supabaseServ
      .from("currency_sync_config")
      .select("*")
      .single()

    if (configError) {
      if (configError.code === "PGRST116") {
        // No configuration found
        return NextResponse.json(
          { message: "No sync configuration found" },
          { status: 200 },
        )
      }
      throw configError
    }

    if (!config.currencies || config.currencies.length === 0) {
      return NextResponse.json(
        { message: "No currencies configured for sync" },
        { status: 200 },
      )
    }

    // Get current time in Czech time (CET/CEST)
    const now = new Date()
    const czechTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Europe/Prague" }),
    )

    // Check if it's time to sync based on user configuration
    if (
      czechTime.getHours() !== config.hour ||
      czechTime.getMinutes() !== config.minute
    ) {
      return NextResponse.json(
        { message: "Not time to sync yet" },
        { status: 200 },
      )
    }

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

    // Fetch exchange rates from CNB API
    const response = await fetch(
      `https://www.cnb.cz/en/financial_markets/foreign_exchange_market/exchange_rate_fixing/daily.txt?date=${formattedDate}`,
    )

    if (!response.ok) {
      throw new Error(
        `Failed to fetch exchange rates. Status: ${response.status}`,
      )
    }

    const text = await response.text()
    const lines = text.split("\n")

    if (lines.length < 3) {
      throw new Error("Invalid response format from CNB API")
    }

    // Parse the date from the first line
    const dateMatch = lines[0].match(/(\d{1,2} \w{3} \d{4})/)
    if (!dateMatch) {
      throw new Error("Could not parse date from CNB API response")
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

    // Filter rates based on configured currencies
    const filteredRates = rates.filter((rate) =>
      config.currencies.includes(rate.currency),
    )

    if (filteredRates.length === 0) {
      return NextResponse.json(
        { message: "No matching currencies found in the response" },
        { status: 200 },
      )
    }

    // Delete existing rates for this date and currencies
    const { error: deleteError } = await supabaseServ
      .from("currency_rates")
      .delete()
      .eq("date", isoDate)
      .in("currency", config.currencies)

    if (deleteError) {
      throw deleteError
    }

    // Insert new rates
    const { error: insertError } = await supabaseServ
      .from("currency_rates")
      .insert(filteredRates)

    if (insertError) {
      throw insertError
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
    console.error("Error in currency sync cron job:", error)
    return NextResponse.json(
      {
        error: "Failed to sync exchange rates",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
