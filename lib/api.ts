// API client. On the browser, uses same-origin URLs (the /api/* proxy in
// next.config.ts forwards to the ERP). On the server (SSR/RSC), Node's fetch
// rejects relative URLs — so we hit the ERP backend directly.

import type { Product, AccountSession, OrderPayload } from "./types"

const ERP_API = process.env.NEXT_PUBLIC_API_URL ?? "https://erp.vita-core.org"
const BASE = typeof window === "undefined" ? ERP_API : ""

async function getJson<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts.headers ?? {}) },
    cache: opts.cache ?? "no-store",
  })
  if (!res.ok) {
    let msg = res.statusText
    try { const j = await res.json(); msg = j.error ?? j.message ?? msg } catch {}
    throw new Error(msg || `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

// ── Catalogue ─────────────────────────────────────────────────────────────────
export function fetchCatalogue(params: { q?: string; famille?: string; tag?: string } = {}): Promise<Product[]> {
  const qs = new URLSearchParams()
  if (params.q) qs.set("q", params.q)
  if (params.famille) qs.set("famille", params.famille)
  if (params.tag) qs.set("tag", params.tag)
  const suffix = qs.toString() ? `?${qs}` : ""
  return getJson<Product[]>(`/api/ext/catalogue${suffix}`)
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export function login(identifier: string, password: string): Promise<AccountSession> {
  return getJson<AccountSession>("/api/ext/auth", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  })
}

export interface SignupInput {
  nom: string
  telephone: string
  email?: string
  type?: "client" | "fournisseur"
  sousType?: "particulier" | "chr" | "marchand" | string
  adresse?: string
  ville?: string
  gps_lat?: number
  gps_lng?: number
  gps_consent?: boolean
}

export function signup(input: SignupInput): Promise<{ ok: boolean; password?: string; userId?: string; message?: string }> {
  return getJson("/api/ext/demande-compte", {
    method: "POST",
    body: JSON.stringify({ type: "client", ...input }),
  })
}

export function fetchAccount(token: string): Promise<AccountSession> {
  return getJson<AccountSession>("/api/ext/mon-compte", {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ── Orders ────────────────────────────────────────────────────────────────────
export function submitOrder(order: OrderPayload, token?: string): Promise<{ ok: boolean; id?: string; error?: string }> {
  return getJson("/api/ext/commandes", {
    method: "POST",
    body: JSON.stringify(order),
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

export function fetchOrders(telephone: string): Promise<unknown[]> {
  return getJson(`/api/ext/commandes?tel=${encodeURIComponent(telephone)}`)
}
