import { createClient } from "@supabase/supabase-js"

import { DB_ANON_KEY, DB_SERV_KEY, DB_URL } from "./constants"

export const supabase = createClient(DB_URL!, DB_ANON_KEY!)

export const supabaseServ = createClient(DB_URL!, DB_SERV_KEY!)

// const res = await supabase.auth.signInWithPassword({
//   email: process.env.NEXT_SUPABASE_DB_MAIL || "",
//   password: process.env.NEXT_SUPABASE_DB_PASS || "",
// })
