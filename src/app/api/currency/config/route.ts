import { NextResponse } from "next/server"

import { supabaseServ } from "@/utils/supabaseUser"

interface SyncConfig {
  hour: number
  minute: number
  currencies: string[]
}

export async function GET() {
  try {
    const { data, error } = await supabaseServ
      .from("currency_sync_config")
      .select("*")
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // No configuration found, return default
        return NextResponse.json({
          hour: 0,
          minute: 1,
          currencies: [],
        })
      }
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching sync configuration:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch sync configuration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const { hour, minute, currencies } = await req.json()

    // Validate input
    if (
      typeof hour !== "number" ||
      typeof minute !== "number" ||
      !Array.isArray(currencies)
    ) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      )
    }

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return NextResponse.json(
        { error: "Invalid time values" },
        { status: 400 },
      )
    }

    // Delete existing configuration
    await supabaseServ.from("currency_sync_config").delete().neq("id", 0)

    // Insert new configuration
    const { error: insertError } = await supabaseServ
      .from("currency_sync_config")
      .insert([{ hour, minute, currencies }])

    if (insertError) {
      throw insertError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving sync configuration:", error)
    return NextResponse.json(
      {
        error: "Failed to save sync configuration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
