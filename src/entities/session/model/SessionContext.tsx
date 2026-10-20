import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export interface Credentials {
  idInstance: string
  apiTokenInstance: string
}

interface SessionContextValue {
  credentials: Credentials | null
  login: (credentials: Credentials) => void
  logout: () => void
}

const STORAGE_KEY = 'session'

const SessionContext = createContext<SessionContextValue | null>(null)

function readStoredCredentials(): Credentials | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Credentials) : null
  } catch {
    return null
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<Credentials | null>(readStoredCredentials)

  const login = useCallback((next: Credentials) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setCredentials(next)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setCredentials(null)
  }, [])

  const value = useMemo(() => ({ credentials, login, logout }), [credentials, login, logout])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error('useSession must be used within SessionProvider')
  }

  return context
}
