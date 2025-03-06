export const DB_URL = process.env.NEXT_SUPABASE_URL
export const DB_API_KEY = process.env.NEXT_SUPABASE_ANON_KEY

const SEARCH_ROOT = "/search"
const FORMULAS_ROOT = "/formulas"
export const ROUTES = {
  search: {
    root: SEARCH_ROOT,
  },
  formulas: {
    root: FORMULAS_ROOT,
  },
}

export const constants = {
  g: 9.80665,
}
