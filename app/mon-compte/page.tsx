"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/session"
import { fetchOrders } from "@/lib/api"
import { money } from "@/lib/format"

interface OrderSummary {
  id?: string
  date?: string
  statut?: string
  montantTotal?: number
  montant_total?: number
  nbArticles?: number
  lignes?: { quantite?: number }[]
}

const STATUT: Record<string, { label: string; cls: string }> = {
  en_attente:             { label: "En attente",     cls: "bg-yellow-100 text-yellow-800" },
  en_attente_approbation: { label: "En approbation", cls: "bg-orange-100 text-orange-800" },
  valide:                 { label: "Validée",        cls: "bg-blue-100 text-blue-800" },
  refuse:                 { label: "Refusée",        cls: "bg-red-100 text-red-800" },
  en_transit:             { label: "En livraison",   cls: "bg-cyan-100 text-cyan-800" },
  livre:                  { label: "Livrée",         cls: "bg-green-100 text-green-800" },
}

export default function MonComptePage() {
  const router = useRouter()
  const { session, loading: sessLoading, logout } = useSession()
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessLoading) return
    if (!session) { router.push("/login"); return }
    const tel = session.client?.telephone ?? session.user.telephone
    if (!tel) { setLoading(false); return }
    fetchOrders(tel)
      .then(rows => setOrders(rows as OrderSummary[]))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [session, sessLoading, router])

  if (sessLoading || !session) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center text-slate-500">Chargement…</div>
  }

  const isPro = session.client?.categorie === "chr" || session.client?.categorie === "marchand"

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 md:text-4xl">Bonjour, {session.user.name.split(" ")[0]} 👋</h1>
          <p className="mt-1 text-sm text-slate-500">Votre espace personnel Vita Fresh</p>
        </div>
        <button onClick={() => { logout(); router.push("/") }} className="btn-outline">Se déconnecter</button>
      </div>

      {/* Pro CTA */}
      {isPro && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand/20 bg-brand-50 p-5">
          <div>
            <p className="font-bold text-brand">Vous êtes un professionnel — accédez à votre espace pro</p>
            <p className="text-sm text-brand-dark/70">Tarifs CHR, factures, wallet, parrainage…</p>
          </div>
          <a href="https://erp.vita-core.org" className="btn-primary">Ouvrir l'espace pro →</a>
        </div>
      )}

      {/* KPIs */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Kpi label="Commandes" value={String(orders.length)} icon="📦" />
        <Kpi label="En cours" value={String(orders.filter(o => ["en_attente", "valide", "en_transit"].includes(o.statut ?? "")).length)} icon="⏳" />
        <Kpi label="Livrées" value={String(orders.filter(o => o.statut === "livre").length)} icon="✅" />
      </div>

      {/* Orders */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Mes commandes</h2>
        {loading ? (
          <div className="mt-4 flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="card h-16 animate-pulse bg-slate-100" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="card mt-4 flex flex-col items-center gap-3 py-12 text-center">
            <span className="text-4xl">📭</span>
            <p className="font-semibold text-slate-700">Aucune commande pour l'instant</p>
            <Link href="/catalogue" className="btn-primary mt-2">Passer ma première commande</Link>
          </div>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {orders.map((o, i) => {
              const cfg = STATUT[o.statut ?? "en_attente"] ?? { label: o.statut ?? "—", cls: "bg-slate-100 text-slate-700" }
              const total = o.montantTotal ?? o.montant_total ?? (o.lignes ?? []).length * 0
              const articles = o.nbArticles ?? o.lignes?.length ?? 0
              return (
                <li key={o.id ?? i} className="card flex items-center justify-between p-4">
                  <div>
                    <p className="font-mono text-sm font-bold text-slate-900">{(o.id ?? "—").slice(0, 14)}</p>
                    <p className="text-xs text-slate-500">{o.date ?? ""} · {articles} article{articles > 1 ? "s" : ""}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${cfg.cls}`}>{cfg.label}</span>
                    <span className="font-bold text-brand">{money(total)}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

function Kpi({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-xl">{icon}</div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  )
}
