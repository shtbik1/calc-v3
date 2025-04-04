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
    const { startDate, endDate, currencies } = await req.json()

    // Validate input
    if (
      !startDate ||
      !endDate ||
      !currencies ||
      !Array.isArray(currencies) ||
      currencies.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid request data. startDate, endDate and currencies array are required.",
        },
        { status: 400 },
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format. Please use YYYY-MM-DD format." },
        { status: 400 },
      )
    }

    if (start > end) {
      return NextResponse.json(
        { error: "startDate must be earlier than or equal to endDate" },
        { status: 400 },
      )
    }

    const results = {
      success: true,
      syncedDates: [] as string[],
      failedDates: [] as string[],
      totalDates: 0,
      syncedRates: 0,
    }

    // Get years between start and end dates
    const startYear = start.getFullYear()
    const endYear = end.getFullYear()
    const years = Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i,
    )

    // Fetch data for each year
    for (const currentYear of years) {
      try {
        const response = await fetch(
          `https://www.cnb.cz/en/financial_markets/foreign_exchange_market/exchange_rate_fixing/year.txt?year=${currentYear}`,
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch rates for year ${currentYear}`)
        }

        const text = await response.text()
        const lines = text.split("\n").filter((line) => line.trim())

        // Parse header to get currency order and amounts
        const header = lines[0].split("|")
        const [headerDate, ...headerCurrencies] = header // Separate "Date" from currencies
        console.log("Header currencies:", headerCurrencies)

        // Parse currencies from header
        const currencyData = currencies
          .map((currency) => {
            // Find currency in header currencies (not including "Date" column)
            const headerIndex = headerCurrencies.findIndex((col) => {
              const match = col.trim().match(/(\d+)?\s*([A-Z]{3})$/)
              return match && match[2] === currency
            })

            if (headerIndex === -1) return null

            // Parse amount from the header
            const match = headerCurrencies[headerIndex]
              .trim()
              .match(/(\d+)?\s*([A-Z]{3})$/)
            const amount = match && match[1] ? parseInt(match[1]) : 1

            return {
              index: headerIndex, // This index is now relative to values array
              amount,
            }
          })
          .filter(
            (data): data is { index: number; amount: number } => data !== null,
          )

        // Debug logging
        const firstLine = lines[1].split("|")
        const [firstDate, ...firstValues] = firstLine

        console.log("First line data:")
        console.log("Date:", firstDate)
        console.log(
          "Currency indices:",
          currencyData.map((d) => d.index),
        )
        console.log(
          "Values at indices:",
          currencyData.map((d) => firstValues[d.index]),
        )

        if (currencyData.length === 0) {
          throw new Error(
            `No matching currencies found in CNB data for year ${currentYear}`,
          )
        }

        // Process each line of data
        const data = lines.slice(1).flatMap((line) => {
          const [dateStr, ...values] = line.split("|")
          const [day, month, yearStr] = dateStr.split(".")
          const rateDate = new Date(`${yearStr}-${month}-${day}`)

          // Check if date is within range
          if (rateDate < start || rateDate > end) {
            return []
          }

          // Check if month is within range for the current year
          const currentMonth = rateDate.getMonth()
          const isFirstYear = currentYear === start.getFullYear()
          const isLastYear = currentYear === end.getFullYear()

          if (isFirstYear && currentMonth < start.getMonth()) {
            return []
          }
          if (isLastYear && currentMonth > end.getMonth()) {
            return []
          }

          const isoDate = rateDate.toISOString().split("T")[0]

          return currencyData
            .map(({ index, amount }, i) => {
              const stringValue = values[index].trim()
              const rateValue = Number(stringValue)
              if (isNaN(rateValue)) return null

              return {
                date: isoDate,
                currency: currencies[i],
                amount,
                rate: rateValue,
              }
            })
            .filter((rate): rate is ExchangeRate => rate !== null)
        })

        if (data.length > 0) {
          // Delete existing rates for these dates and currencies
          await supabaseServ
            .from("currency_rates")
            .delete()
            .in(
              "date",
              data.map((rate) => rate.date),
            )
            .in("currency", currencies)

          // Insert new rates
          const { error } = await supabaseServ
            .from("currency_rates")
            .insert(data)

          if (error) {
            throw error
          }

          const uniqueDates = new Set(data.map((rate) => rate.date))
          results.syncedDates.push(...Array.from(uniqueDates))
          results.syncedRates += data.length
        }
      } catch (error) {
        console.error(`Error processing year ${currentYear}:`, error)
        results.failedDates.push(
          ...(Array.from({ length: 365 }, (_, i) => {
            const date = new Date(currentYear, 0, i + 1)
            return date >= start && date <= end
              ? date.toISOString().split("T")[0]
              : null
          }).filter(Boolean) as string[]),
        )
      }
    }

    results.totalDates = results.syncedDates.length + results.failedDates.length
    return NextResponse.json(results)
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
