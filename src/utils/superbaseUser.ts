import { createClient } from "@supabase/supabase-js"

import { DB_API_KEY, DB_URL } from "./constants"

export const supabase = createClient(DB_URL!, DB_API_KEY!)

// const res = await supabase.auth.signInWithPassword({
//   email: process.env.NEXT_SUPABASE_DB_MAIL || "",
//   password: process.env.NEXT_SUPABASE_DB_PASS || "",
// })
