import { COOKIE_KEYS } from "./constants"

export const setCookie = (
  name: (typeof COOKIE_KEYS)[keyof typeof COOKIE_KEYS],
  value: string,
  maxAge?: number | string,
) => {
  const domainWithoutSubdomains = window.location.hostname
    .split(".")
    .slice(-2)
    .join(".")

  let cookie = `${name}=${value}; Domain=.${domainWithoutSubdomains}; path=/;`

  if (maxAge) {
    cookie += `Max-Age=${maxAge};`
  }

  document.cookie = cookie
}

export const deleteCookie = (
  name: (typeof COOKIE_KEYS)[keyof typeof COOKIE_KEYS],
) => {
  const domainWithoutSubdomains = window.location.hostname
    .split(".")
    .slice(-2)
    .join(".")

  const cookie = `${name}=""; Domain=.${domainWithoutSubdomains}; path=/; Max-Age=${-1};`

  document.cookie = cookie
}
