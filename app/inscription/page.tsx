"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { signup } from "@/lib/api"
import Logo from "@/components/Logo"

// Next 15 requires useSearchParams() under a Suspense boundary during prerender.
export default function SignupPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-16 text-center text-slate-500">Chargement…</div>}>
      <SignupForm />
    </Suspense>
  )
}

type SousType = "particulier" | "chr" | "marchand"

const TYPES: { v: SousType; label: string; emoji: string; desc: string }[] = [
  { v: "particulier", label: "Particulier",        emoji: "🧑",  desc: "Achats personnels" },
  { v: "chr",         label: "CHR / Hôtel / Resto", emoji: "🍽️", desc: "Cafés, hôtels, restaurants" },
  { v: "marchand",    label: "Marchand / Épicier", emoji: "🏪",  desc: "Épicerie, alimentation" },
]

function SignupForm() {
  const [form, setForm] = useState({
    nom: "", telephone: "", email: "", adresse: "", ville: "Casablanca",
    sousType: "particulier" as SousType,
  })
  const [gpsConsent, setGpsConsent] = useState(false)
  const [gps, setGps] = useState<{ lat?: number; lng?: number }>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<{ password?: string; referralApplied?: boolean } | null>(null)

  // Parrainage code from URL (?parrain=VITA-XXXXXX) — applied after signup
  const searchParams = useSearchParams()
  const [parrainCode, setParrainCode] = useState("")
  useEffect(() => {
    const p = searchParams?.get("parrain")?.trim().toUpperCase()
    if (p && /^VITA-[A-Z0-9]{4,12}$/i.test(p)) setParrainCode(p)
  }, [searchParams])

  const captureGps = () => {
    if (!navigator.geolocation) { setError("Géolocalisation non supportée par votre navigateur."); return }
    navigator.geolocation.getCurrentPosition(
      pos => { setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGpsConsent(true) },
      () => setError("Impossible d'obtenir votre position."),
      { timeout: 8000 }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!form.nom.trim() || !form.telephone.trim()) { setError("Nom et téléphone sont requis."); return }
    setLoading(true)
    try {
      const res = await signup({
        nom: form.nom.trim(),
        telephone: form.telephone.trim(),
        email: form.email.trim() || undefined,
        adresse: form.adresse.trim() || undefined,
        ville: form.ville.trim() || undefined,
        type: "client",
        sousType: form.sousType,
        gps_lat: gps.lat,
        gps_lng: gps.lng,
        gps_consent: gpsConsent,
      })
      if ((res as { ok?: boolean }).ok === false) throw new Error((res as { message?: string }).message ?? "Échec de l'inscription")

      // Apply parrainage if a valid code came in via ?parrain=…
      let referralApplied = false
      const filleulClientId = (res as { clientId?: string; userId?: string }).clientId
                              ?? (res as { clientId?: string; userId?: string }).userId
      if (parrainCode && filleulClientId) {
        try {
          const r = await fetch("/api/portal/referrals/apply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ parrainCode, filleulClientId }),
          })
          referralApplied = r.ok
        } catch { /* parrainage best-effort */ }
      }
      setSuccess({ password: res.password, referralApplied })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <span className="text-7xl">✅</span>
        <h1 className="mt-4 text-2xl font-black text-slate-900">Compte créé !</h1>
        <p className="mt-2 text-sm text-slate-600">Votre demande est en cours de validation.</p>
        {success.password && (
          <div className="mt-6 rounded-2xl border border-brand/20 bg-brand-50 p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">Votre mot de passe temporaire</p>
            <p className="mt-1 select-all font-mono text-lg font-bold text-brand-dark">{success.password}</p>
            <p className="mt-2 text-xs text-slate-600">Notez-le : il ne sera plus affiché. Vous pourrez le changer après connexion.</p>
          </div>
        )}
        {success.referralApplied && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700">🤝 Parrainage validé</p>
            <p className="mt-1 text-sm text-amber-900">Un bonus de bienvenue sera crédité sur votre Wallet dès votre première commande livrée.</p>
          </div>
        )}
        <Link href="/login" className="btn-primary mt-6 inline-flex">Se connecter →</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo size={56} />
        <h1 className="text-3xl font-black text-slate-900">Créer un compte</h1>
        <p className="text-sm text-slate-500">Rejoignez Vita Fresh en moins d'une minute</p>
      </div>

      <form onSubmit={handleSubmit} className="card mt-8 flex flex-col gap-5 p-6">
        {parrainCode && (
          <div className="rounded-xl border border-brand/30 bg-brand-50 px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">🤝</span>
            <div className="text-sm">
              <p className="font-bold text-brand">Code parrain détecté : <code className="font-mono">{parrainCode}</code></p>
              <p className="text-brand-dark/80 text-xs mt-0.5">Vous recevrez un bonus de bienvenue après votre première commande livrée.</p>
            </div>
          </div>
        )}
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
        )}

        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-slate-700">Vous êtes…</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {TYPES.map(t => (
              <button
                key={t.v}
                type="button"
                onClick={() => setForm({ ...form, sousType: t.v })}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-4 text-center transition-all ${
                  form.sousType === t.v ? "border-brand bg-brand/5" : "border-slate-200 hover:border-brand/40"
                }`}>
                <span className="text-2xl">{t.emoji}</span>
                <span className="text-sm font-bold text-slate-900">{t.label}</span>
                <span className="text-[10px] text-slate-500">{t.desc}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom complet *" value={form.nom} onChange={v => setForm({ ...form, nom: v })} placeholder="Mohamed Alami" />
          <Field label="Téléphone *" value={form.telephone} onChange={v => setForm({ ...form, telephone: v })} placeholder="06 12 34 56 78" type="tel" />
          <Field label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="vous@email.ma" type="email" />
          <Field label="Ville" value={form.ville} onChange={v => setForm({ ...form, ville: v })} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Adresse</label>
          <textarea
            value={form.adresse}
            onChange={e => setForm({ ...form, adresse: e.target.value })}
            rows={2}
            placeholder="Quartier, rue, immeuble…"
            className="input resize-none"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={gpsConsent}
              onChange={e => setGpsConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
              id="gps"
            />
            <div className="flex-1">
              <label htmlFor="gps" className="text-sm font-semibold text-slate-700">Partager ma position GPS</label>
              <p className="text-xs text-slate-500">Optimise nos circuits de livraison.</p>
              {gps.lat && gps.lng && <p className="mt-1 text-xs text-brand">✓ Position capturée</p>}
            </div>
            <button type="button" onClick={captureGps} className="btn-outline px-3 py-1.5 text-xs">Localiser</button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-2 w-full justify-center py-3">
          {loading ? "Création…" : "Créer mon compte"}
        </button>

        <p className="text-center text-xs text-slate-500">
          Déjà inscrit ? <Link href="/login" className="font-semibold text-brand hover:underline">Se connecter</Link>
        </p>
      </form>
    </div>
  )
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input" />
    </div>
  )
}
