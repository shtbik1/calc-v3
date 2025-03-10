export type User = {
  user_id: number
  login: string
  password: string
} | null

export type JwtData = {
  user_id: number
  login: string
  exp: number
  iat: number
}
