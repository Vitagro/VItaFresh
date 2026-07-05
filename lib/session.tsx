"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { AccountSession } from "./types"

const KEY = "vita_session_v1"

interface SessionCtx {
  session: AccountSession | null
  loading: boolean
  setSession: (s: AccountSession | null) => void
  logout: () => void
}

const Ctx = createContext<SessionCtx | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AccountSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setSessionState(JSON.parse(raw))
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  const setSession = (s: AccountSession | null) => {
    setSessionState(s)
    try {
      if (s) localStorage.setItem(KEY, JSON.stringify(s))
      else localStorage.removeItem(KEY)
    } catch { /* ignore */ }
  }

  return (
    <Ctx.Provider value={{ session, loading, setSession, logout: () => setSession(null) }}>
      {children}
    </Ctx.Provider>
  )
}

export function useSession() {
  const c = useContext(Ctx)
  if (!c) throw new Error("useSession must be used inside <SessionProvider>")
  return c
}
