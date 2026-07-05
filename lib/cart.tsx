"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type { CartLine, Product } from "./types"

const STORAGE_KEY = "vita_cart_v1"

interface CartCtx {
  lines: CartLine[]
  add: (p: Product, qty?: number) => void
  setQty: (productId: string, qty: number) => void
  remove: (productId: string) => void
  clear: () => void
  count: number
  total: number
}

const Ctx = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setLines(JSON.parse(raw))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lines)) } catch { /* ignore */ }
  }, [lines, hydrated])

  const value = useMemo<CartCtx>(() => ({
    lines,
    add: (p, qty = 1) => {
      const price = p.prixVente ?? p.prix
      setLines(prev => {
        const idx = prev.findIndex(l => l.productId === p.id)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = { ...next[idx], quantite: next[idx].quantite + qty }
          return next
        }
        return [...prev, { productId: p.id, nom: p.nom, unite: p.unite, prix: price, quantite: qty }]
      })
    },
    setQty: (productId, qty) =>
      setLines(prev => prev.map(l => l.productId === productId ? { ...l, quantite: Math.max(0, qty) } : l).filter(l => l.quantite > 0)),
    remove: (productId) => setLines(prev => prev.filter(l => l.productId !== productId)),
    clear: () => setLines([]),
    count: lines.reduce((s, l) => s + l.quantite, 0),
    total: lines.reduce((s, l) => s + l.quantite * l.prix, 0),
  }), [lines])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error("useCart must be used inside <CartProvider>")
  return c
}
