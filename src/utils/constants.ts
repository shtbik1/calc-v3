export const DB_URL = process.env.NEXT_SUPABASE_URL
export const DB_ANON_KEY = process.env.NEXT_SUPABASE_ANON_KEY
export const DB_SERV_KEY = process.env.NEXT_SUPABASE_SERV_KEY

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

export const API = "/api"
export const API_ROUTES = {
  auth: {
    signup: `${API}/signup`,
    signin: `${API}/signin`,
  },
  formulas: {
    addHistory: `${API}/formulas/add-history`,
    getHistory: `${API}/formulas/get-history`,
    getFormulas: `${API}/formulas`,
    addFavorite: `${API}/formulas/add-favorite`,
    getFavorite: `${API}/formulas/get-favorite`,
    deleteFavorite: `${API}/formulas/delete-favorite`,
  },
}

export const constants = {
  g: 9.80665,
}

export const LOCALSTORAGE_KEYS = {}

export const COOKIE_KEYS = {
  token: "token",
}

export const publicKey = process.env.NEXT_RSA_PUBLIC_KEY_DELETE || ""
export const privateKey = process.env.NEXT_RSA_PRIVATE_KEY_DELETE || ""
