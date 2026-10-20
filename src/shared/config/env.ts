const DEFAULT_API_URL = 'https://api.green-api.com'

export const API_URL: string = (import.meta.env.VITE_GREEN_API_URL || DEFAULT_API_URL).replace(
  /\/+$/,
  '',
)
