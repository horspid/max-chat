import { API_URL } from '@/shared/config/env'

export interface ApiCredentials {
  idInstance: string
  apiTokenInstance: string
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function greenApiPost<TResponse>(
  credentials: ApiCredentials,
  method: string,
  body: Record<string, unknown>,
): Promise<TResponse> {
  const instance = encodeURIComponent(credentials.idInstance)
  const token = encodeURIComponent(credentials.apiTokenInstance)
  const url = `${API_URL}/waInstance${instance}/${method}/${token}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new ApiError(response.status, `Request failed with status ${response.status}`)
  }

  return response.json() as Promise<TResponse>
}
