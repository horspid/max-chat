import { API_URL } from '@/shared/config/env'

export interface ApiCredentials {
  idInstance: string
  apiTokenInstance: string
}

interface RequestOptions {
  httpMethod: 'GET' | 'POST' | 'DELETE'
  method: string
  params?: Array<string | number>
  query?: Record<string, string | number>
  body?: Record<string, unknown>
  signal?: AbortSignal
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function greenApiRequest<TResponse>(
  credentials: ApiCredentials,
  { httpMethod, method, params = [], query, body, signal }: RequestOptions,
): Promise<TResponse> {
  const instance = encodeURIComponent(credentials.idInstance)
  const token = encodeURIComponent(credentials.apiTokenInstance)
  const extraPath = params.map((param) => `/${encodeURIComponent(String(param))}`).join('')
  const search = query ? `?${new URLSearchParams(query as Record<string, string>).toString()}` : ''
  const url = `${API_URL}/waInstance${instance}/${method}/${token}${extraPath}${search}`

  const response = await fetch(url, {
    method: httpMethod,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  })

  if (!response.ok) {
    throw new ApiError(response.status, `Request failed with status ${response.status}`)
  }

  return response.json() as Promise<TResponse>
}

export function greenApiPost<TResponse>(
  credentials: ApiCredentials,
  method: string,
  body: Record<string, unknown>,
) {
  return greenApiRequest<TResponse>(credentials, { httpMethod: 'POST', method, body })
}
