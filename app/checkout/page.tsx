"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart"
import { useSession } from "@/lib/session"
import { submitOrder } from "@/lib/api"
import { money, tomorrow } from "@/lib/format"

const FREE_DELIVERY_THRESHOLD = 150
const STANDARD_DELIVERY_FEE = 25

export default function CheckoutPage() {
  const router = useRouter()
  const { lines, total, count, clear } = useCart()
  const { session } = useSession()

  const [form, setForm] = useState({
    nomClient: "",
    telephone: "",
    email: "",
    adresse: "",
    dateLivraison: tomorrow(),
    notes: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<{ id?: string } | null>(null)

  useEffect(() => {
    if (session?.client) {
      setForm(f => ({
        ...f,
        nomClient: session.client?.nom ?? session.user.name ?? "",
        telephone: session.client?.telephone ?? session.user.telephone ?? "",
        email: session.user.email ?? "",
        adresse: session.client?.adresse ?? "",
      }))
    } else if (session?.user) {
      setForm(f => ({
        ...f,
        nomClient: session.user.name ?? "",
        telephone: session.user.telephone ?? "",
        email: session.user.email ?? "",
      }))
    }
  }, [session])

  const livraison = total >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE
  const grandTotal = total + livraison

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!form.nomClient.trim() || !form.telephone.trim() || !form.adresse.trim()) {
      setError("Merci de remplir nom, téléphone et adresse.")
      return
    }
    if (count === 0) { setError("Votre panier est vide."); return }

    setSubmitting(true)
    try {
      const res = await submitOrder({
        telephone: form.telephone.trim(),
        email: form.email.trim() || undefined,
        nomClient: form.nomClient.trim(),
        adresse: form.adresse.trim(),
        dateLivraison: form.dateLivraison,
        notes: form.notes.trim() || undefined,
        source: "boutique",
        lignes: lines.map(l => ({
          articleId: l.productId,
          articleNom: l.nom,
          unite: l.unite,
          quantite: l.quantite,
          prixUnitaire: l.prix,
        })),
      }, session?.token)
      if (res.ok === false && res.error) throw new Error(res.error)
      setSuccess({ id: res.id })
      clear()
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(`Erreur d'envoi : ${msg}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <span className="text-7xl">🎉</span>
        <h1 className="mt-4 text-3xl font-black text-slate-900">Commande envoyée !</h1>
        <p className="mt-2 text-slate-600">Merci pour votre confiance. Nous vous contactons sous peu pour confirmer.</p>
        {success.id && <p className="mt-1 font-mono text-xs text-slate-400">Réf : {success.id}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/catalogue" className="btn-primary">Continuer mes achats</Link>
          <Link href="/mon-compte" className="btn-outline">Voir mes commandes</Link>
        </div>
      </div>
    )
  }

  if (count === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Votre panier est vide</h1>
        <Link href="/catalogue" className="btn-primary mt-6 inline-flex">Retour au catalogue</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-black text-slate-900 md:text-4xl">Finaliser la commande</h1>
      <p className="mt-1 text-sm text-slate-500">Renseignez vos coordonnées de livraison.</p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="card flex flex-col gap-4 p-6">
          <h2 className="text-lg font-bold text-slate-900">Coordonnées</h2>

          <Field label="Nom complet *" value={form.nomClient} onChange={v => setForm({ ...form, nomClient: v })} placeholder="Mohamed Alami" />
          <Field label="Téléphone *" value={form.telephone} onChange={v => setForm({ ...form, telephone: v })} placeholder="06 12 34 56 78" type="tel" />
          <Field label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="vous@email.ma" type="email" />

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Adresse de livraison *</label>
            <textarea
              value={form.adresse}
              onChange={e => setForm({ ...form, adresse: e.target.value })}
              rows={3}
              placeholder="Quartier, rue, immeuble, étage…"
              className="input resize-none"
            />
          </div>

          <Field label="Date de livraison souhaitée" value={form.dateLivraison} onChange={v => setForm({ ...form, dateLivraison: v })} type="date" min={tomorrow()} />

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Notes (optionnel)</label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={2}
              placeholder="Instructions spéciales, code immeuble…"
              className="input resize-none"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
          )}
        </div>

        {/* Summary */}
        <aside className="card sticky top-24 flex h-fit flex-col gap-3 p-5">
          <h2 className="text-lg font-bold text-slate-900">Votre commande</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {lines.map(l => (
              <li key={l.productId} className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate text-slate-700">{l.nom} <span className="text-slate-400">× {l.quantite}</span></span>
                <span className="shrink-0 font-semibold">{money(l.prix * l.quantite)}</span>
              </li>
            ))}
          </ul>
          <div className="my-2 border-t border-slate-100" />
          <Row label="Sous-total" value={money(total)} />
          <Row label="Livraison" value={livraison === 0 ? "Gratuite" : money(livraison)} accent={livraison === 0 ? "text-brand" : undefined} />
          <div className="my-2 border-t border-slate-100" />
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-slate-700">Total</span>
            <span className="text-2xl font-black text-brand">{money(grandTotal)}</span>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary mt-2 w-full justify-center py-3">
            {submitting ? "Envoi…" : "Confirmer la commande"}
          </button>
          <Link href="/panier" className="btn-ghost w-full justify-center text-xs">Modifier le panier</Link>
        </aside>
      </form>
    </div>
  )
}

function Field({ label, value, onChange, type = "text", placeholder, min }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; min?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        className="input"
      />
    </div>
  )
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex justify-between text-sm text-slate-600">
      <span>{label}</span>
      <span className={`font-semibold ${accent ?? "text-slate-900"}`}>{value}</span>
    </div>
  )
}
