import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Livraison à Casablanca",
  description: "Livraison standard 24h gratuite dès 150 MAD, ou express 2h. Vita Fresh livre Casablanca et environs.",
}

export default function LivraisonPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-black text-slate-900">Livraison</h1>
      <p className="mt-2 text-lg text-slate-600">Frais, rapide, fiable. Voici comment nous livrons.</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <div className="text-3xl">📦</div>
          <h2 className="mt-3 text-xl font-bold text-slate-900">Livraison standard</h2>
          <p className="mt-1 text-sm text-slate-600">Sous 24h, créneaux 8h–18h.</p>
          <p className="mt-3 font-black text-brand">25 DH<span className="text-sm font-normal text-slate-500"> · gratuite dès 150 DH</span></p>
        </div>
        <div className="card p-6">
          <div className="text-3xl">⚡</div>
          <h2 className="mt-3 text-xl font-bold text-slate-900">Livraison express</h2>
          <p className="mt-1 text-sm text-slate-600">Sous 2h sur Casablanca centre.</p>
          <p className="mt-3 font-black text-brand">50 DH<span className="text-sm font-normal text-slate-500"> · selon créneau</span></p>
        </div>
      </div>

      <div className="card mt-8 p-6">
        <h2 className="text-xl font-bold text-slate-900">Zones desservies</h2>
        <p className="mt-2 text-sm text-slate-600">Tout Casablanca et environs immédiats (Bouskoura, Aïn Sebaa, Mohammedia partiel). Pour d'autres zones, contactez-nous.</p>
      </div>

      <Link href="/catalogue" className="btn-primary mt-10 inline-flex">Commencer mes courses →</Link>
    </div>
  )
}
