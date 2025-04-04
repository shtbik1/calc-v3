"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

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

const AVAILABLE_CURRENCIES = [
  "AUD",
  "BRL",
  "BGN",
  "CAD",
  "CNY",
  "HRK",
  "DKK",
  "EUR",
  "HKD",
  "HUF",
  "ISK",
  "XDR",
  "INR",
  "IDR",
  "ILS",
  "JPY",
  "MYR",
  "MXN",
  "NZD",
  "NOK",
  "PHP",
  "PLN",
  "RON",
  "RUB",
  "SGD",
  "ZAR",
  "KRW",
  "SEK",
  "CHF",
  "THB",
  "TRY",
  "GBP",
  "USD",
]

export default function CurrencyPage() {
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [report, setReport] = useState<CurrencyReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [serverResponse, setServerResponse] = useState<string>("")
  const [syncHour, setSyncHour] = useState(0)
  const [syncMinute, setSyncMinute] = useState(1)
  const [syncCurrencies, setSyncCurrencies] = useState<string[]>([])
  const [configLoading, setConfigLoading] = useState(false)

  useEffect(() => {
    // Load sync configuration
    const loadConfig = async () => {
      try {
        const response = await fetch("/api/currency/config")
        if (!response.ok) throw new Error("Failed to load config")
        const data = await response.json()
        setSyncHour(data.hour)
        setSyncMinute(data.minute)
        setSyncCurrencies(data.currencies)
      } catch (err) {
        console.error("Error loading config:", err)
      }
    }
    loadConfig()
  }, [])

  const handleSaveConfig = async () => {
    setConfigLoading(true)
    try {
      const response = await fetch("/api/currency/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hour: syncHour,
          minute: syncMinute,
          currencies: syncCurrencies,
        }),
      })

      if (!response.ok) throw new Error("Failed to save config")
      setServerResponse("Configuration saved successfully")
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save configuration",
      )
    } finally {
      setConfigLoading(false)
    }
  }

  const handleSyncCurrencyChange = (currency: string) => {
    setSyncCurrencies((prev) =>
      prev.includes(currency)
        ? prev.filter((c) => c !== currency)
        : [...prev, currency],
    )
  }

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrencies((prev) =>
      prev.includes(currency)
        ? prev.filter((c) => c !== currency)
        : [...prev, currency],
    )
  }

  const handleSync = async () => {
    if (selectedCurrencies.length === 0) return

    setLoading(true)
    setError(null)
    setServerResponse("")

    try {
      const response = await fetch("/api/currency/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toISOString().split("T")[0],
          currencies: selectedCurrencies,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to sync")
      }

      const data = await response.json()
      if (data.success) {
        const formattedResponse = `Курсы валют на ${data.data.date}:\n\n${data.data.rates
          .map(
            (rate: { currency: string; amount: number; rate: number }) =>
              `${rate.currency}: ${(rate.rate / rate.amount).toFixed(4)} CZK (${rate.amount} ${rate.currency} = ${rate.rate} CZK)`,
          )
          .join("\n")}`
        setServerResponse(formattedResponse)
      } else {
        setServerResponse(JSON.stringify(data, null, 2))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSyncRange = async () => {
    if (selectedCurrencies.length === 0 || !startDate || !endDate) return

    setLoading(true)
    setError(null)
    setServerResponse("")

    try {
      const response = await fetch("/api/currency/sync-range", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate,
          endDate,
          currencies: selectedCurrencies,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to sync range")
      }

      const data = await response.json()
      if (data.success) {
        const formattedResponse =
          `Синхронизация курсов валют за период с ${startDate} по ${endDate}:\n\n` +
          `Всего дат: ${data.totalDates}\n` +
          `Успешно синхронизировано: ${data.syncedDates.length}\n` +
          `Не удалось синхронизировать: ${data.failedDates.length}\n` +
          `Всего курсов: ${data.syncedRates}\n\n` +
          (data.failedDates.length > 0
            ? `Даты с ошибками:\n${data.failedDates.join("\n")}\n\n`
            : "") +
          `Успешно синхронизированные даты:\n${data.syncedDates.join("\n")}`
        setServerResponse(formattedResponse)
      } else {
        setServerResponse(JSON.stringify(data, null, 2))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleGetReport = async () => {
    if (selectedCurrencies.length === 0 || !startDate || !endDate) return

    setLoading(true)
    setError(null)
    setServerResponse("")

    try {
      const response = await fetch("/api/currency/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate,
          endDate,
          currencies: selectedCurrencies,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get report")
      }

      const data = await response.json()
      setReport(data)
      setServerResponse(JSON.stringify(data, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString)
    return date instanceof Date && !isNaN(date.getTime())
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Exchange Rates</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Sync Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1">Sync Time</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                max="23"
                value={syncHour}
                onChange={(e) => setSyncHour(parseInt(e.target.value))}
                className="border rounded p-2 w-20"
                disabled={configLoading}
              />
              <span className="flex items-center">:</span>
              <input
                type="number"
                min="0"
                max="59"
                value={syncMinute}
                onChange={(e) => setSyncMinute(parseInt(e.target.value))}
                className="border rounded p-2 w-20"
                disabled={configLoading}
              />
            </div>
          </div>
          <div>
            <label className="block mb-1">Currencies to Sync</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_CURRENCIES.map((currency) => (
                <label key={currency} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={syncCurrencies.includes(currency)}
                    onChange={() => handleSyncCurrencyChange(currency)}
                    className="rounded"
                    disabled={configLoading}
                  />
                  <span>{currency}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <Button
          onClick={handleSaveConfig}
          disabled={configLoading}
          className="mt-4"
        >
          {configLoading ? "Saving..." : "Save Configuration"}
        </Button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Manual Sync</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Select Currencies</h2>
          <div className="grid grid-cols-4 gap-2">
            {AVAILABLE_CURRENCIES.map((currency) => (
              <label key={currency} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCurrencies.includes(currency)}
                  onChange={() => handleCurrencyChange(currency)}
                  className="form-checkbox"
                  disabled={loading}
                />
                <span>{currency}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Date Range</h2>
          <div className="flex space-x-4">
            <div>
              <label className="block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded p-2"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded p-2"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="space-x-4 mb-4">
          <Button
            onClick={handleSync}
            disabled={selectedCurrencies.length === 0 || loading}
          >
            {loading ? "Loading..." : "Sync Today"}
          </Button>
          <Button
            onClick={handleSyncRange}
            disabled={
              selectedCurrencies.length === 0 ||
              !isValidDate(startDate) ||
              !isValidDate(endDate) ||
              loading
            }
          >
            {loading ? "Loading..." : "Sync Range"}
          </Button>
          <Button
            onClick={handleGetReport}
            disabled={
              selectedCurrencies.length === 0 ||
              !isValidDate(startDate) ||
              !isValidDate(endDate) ||
              loading
            }
          >
            {loading ? "Loading..." : "Get Report"}
          </Button>
        </div>

        {serverResponse && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Server Response</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {serverResponse}
            </pre>
          </div>
        )}
      </div>

      {report && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Report</h2>

          <div className="mb-4 p-4 bg-gray-50 rounded">
            <h3 className="font-medium mb-2">Date Range</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Requested Range:</p>
                <p>
                  {report.dateRange.requestedStart} -{" "}
                  {report.dateRange.requestedEnd}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Data Range:</p>
                <p>
                  {report.dateRange.actualStart
                    ? report.dateRange.actualStart
                    : "N/A"}{" "}
                  -{" "}
                  {report.dateRange.actualEnd
                    ? report.dateRange.actualEnd
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {Object.entries(report.currencies).map(([currency, stats]) => (
              <div key={currency} className="border rounded p-4">
                <h3 className="font-semibold mb-2">{currency}</h3>

                <div className="mb-4">
                  <h4 className="text-lg font-medium mb-2">
                    Оригинальные курсы
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-gray-600">Min:</span>
                      <span className="ml-2">
                        {stats.original.min?.toFixed(4) || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Max:</span>
                      <span className="ml-2">
                        {stats.original.max?.toFixed(4) || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg:</span>
                      <span className="ml-2">
                        {stats.original.avg?.toFixed(4) || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-2">
                    Курсы за 1 единицу
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-gray-600">Min:</span>
                      <span className="ml-2">
                        {stats.normalized.min?.toFixed(4) || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Max:</span>
                      <span className="ml-2">
                        {stats.normalized.max?.toFixed(4) || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg:</span>
                      <span className="ml-2">
                        {stats.normalized.avg?.toFixed(4) || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
