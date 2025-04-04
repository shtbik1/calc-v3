import { NextResponse } from "next/server"

import { supabaseServ } from "@/utils/supabaseUser"

interface ExchangeRate {
  date: string
  currency: string
  amount: number
  rate: number
}

interface CurrencyStats {
  original: {
    min: number | null
    max: number | null
    avg: number | null
  }
  normalized: {
    min: number | null
    max: number | null
    avg: number | null
  }
}

interface CurrencyReport {
  dateRange: {
    requestedStart: string
    requestedEnd: string
    actualStart: string | null
    actualEnd: string | null
  }
  currencies: {
    [key: string]: CurrencyStats
  }
}

export async function POST(req: Request) {
  try {
    const { startDate, endDate, currencies } = await req.json()

    // Validate input
    if (!startDate || !endDate || !currencies || !Array.isArray(currencies)) {
      return NextResponse.json(
        {
          error:
            "Invalid request data. startDate, endDate and currencies array are required.",
        },
        { status: 400 },
      )
    }

    const report: CurrencyReport = {
      dateRange: {
        requestedStart: startDate,
        requestedEnd: endDate,
        actualStart: null,
        actualEnd: null,
      },
      currencies: {},
    }

    // Get actual date range from database
    const { data: dateRangeData, error: dateRangeError } = await supabaseServ
      .from("currency_rates")
      .select("date")
      .gte("date", startDate)
      .lte("date", endDate)
      .in("currency", currencies)
      .order("date")

    if (dateRangeError) {
      throw dateRangeError
    }

    if (dateRangeData && dateRangeData.length > 0) {
      report.dateRange.actualStart = dateRangeData[0].date
      report.dateRange.actualEnd = dateRangeData[dateRangeData.length - 1].date
    }

    // Get stats for each currency
    for (const currency of currencies) {
      const { data, error } = await supabaseServ
        .from("currency_rates")
        .select("rate, amount")
        .eq("currency", currency)
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date")

      if (error) {
        throw error
      }

      if (!data || data.length === 0) {
        report.currencies[currency] = {
          original: {
            min: null,
            max: null,
            avg: null,
          },
          normalized: {
            min: null,
            max: null,
            avg: null,
          },
        }
        continue
      }

      const rates = data.map((r) => r.rate)
      const amount = data[0].amount // Amount should be the same for all records

      // Calculate original stats
      const min = Math.min(...rates)
      const max = Math.max(...rates)
      const avg = rates.reduce((a, b) => a + b, 0) / rates.length

      // Calculate normalized stats (per 1 unit)
      const normalizedRates = rates.map((r) => r / amount)
      const normalizedMin = Math.min(...normalizedRates)
      const normalizedMax = Math.max(...normalizedRates)
      const normalizedAvg =
        normalizedRates.reduce((a, b) => a + b, 0) / normalizedRates.length

      report.currencies[currency] = {
        original: {
          min,
          max,
          avg,
        },
        normalized: {
          min: normalizedMin,
          max: normalizedMax,
          avg: normalizedAvg,
        },
      }
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error generating currency report:", error)
    return NextResponse.json(
      {
        error: "Failed to generate currency report",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
