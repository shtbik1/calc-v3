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
export const API_AUTH = API + "/auth"
export const API_FORMULAS = API + "/formulas"
export const API_PROFILE = API + "/profile"
export const API_FORMULAS_HISTORY = API_FORMULAS + "/history"
export const API_FORMULAS_FAVORITE = API_FORMULAS + "/favorite"
export const API_ROUTES = {
  auth: {
    root: API_AUTH,
    signup: `${API_AUTH}/signup`,
    signin: `${API_AUTH}/signin`,
  },
  profile: {
    root: API_PROFILE,
    getInfo: API_PROFILE + "/get-info",
  },
  formulas: {
    root: API_FORMULAS,
    getFormulas: API_FORMULAS,
    history: {
      root: API_FORMULAS_HISTORY,
      add: `${API_FORMULAS_HISTORY}/add`,
      get: `${API_FORMULAS_HISTORY}/get`,
      delete: `${API_FORMULAS_HISTORY}/delete`,
    },
    favorite: {
      root: API_FORMULAS_FAVORITE,
      add: `${API_FORMULAS_FAVORITE}/add`,
      get: `${API_FORMULAS_FAVORITE}/get`,
      delete: `${API_FORMULAS_FAVORITE}/delete`,
    },
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
