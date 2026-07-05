import Link from "next/link"
import { fetchCatalogue } from "@/lib/api"
import ProductCard from "@/components/ProductCard"

export const revalidate = 60

export default async function HomePage() {
  let featured: Awaited<ReturnType<typeof fetchCatalogue>> = []
  try {
    const all = await fetchCatalogue()
    featured = all.filter(a => a.stockDisponible > 0).slice(0, 8)
  } catch { /* SSR data fetch fallback — empty featured */ }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-50">
        <div className="absolute inset-0 -z-10 opacity-10 [background-image:radial-gradient(#1a4d2e_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <span className="chip self-start text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" /> Livraison 24h à Casablanca
            </span>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Fruits & légumes <span className="text-brand">ultra-frais</span>, livrés chez vous.
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              Plus de 500 clients à Casablanca : particuliers, hôtels, restaurants. Catalogue mis à jour quotidiennement.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalogue" className="btn-primary">Voir le catalogue →</Link>
              <Link href="/professionnels" className="btn-outline">Je suis un pro / CHR</Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { k: "500+", v: "clients actifs" },
                { k: "24h",  v: "délai standard" },
                { k: "98%",  v: "satisfaction" },
              ].map(s => (
                <div key={s.k}>
                  <p className="text-2xl font-black text-brand md:text-3xl">{s.k}</p>
                  <p className="text-xs text-slate-500">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-brand-200/60 to-brand-50 blur-2xl" />
            <div className="grid grid-cols-2 gap-4">
              {["🍅", "🥬", "🍓", "🥕", "🌿", "🍊"].map((e, i) => (
                <div key={i} className="card flex aspect-square items-center justify-center bg-gradient-to-br from-white to-brand-50 text-7xl">
                  {e}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 md:text-3xl">Sélection du jour</h2>
            <p className="mt-1 text-sm text-slate-500">Les produits les plus demandés cette semaine.</p>
          </div>
          <Link href="/catalogue" className="hidden text-sm font-semibold text-brand hover:underline md:inline">Tout voir →</Link>
        </div>
        {featured.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-4xl">🛒</span>
            <h3 className="font-semibold text-slate-700">Catalogue en cours de mise à jour</h3>
            <p className="text-sm text-slate-500">Revenez dans un instant ou contactez-nous au +212 6 00 00 00 00.</p>
            <Link href="/catalogue" className="btn-primary mt-2">Ouvrir le catalogue</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Benefits */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-black text-slate-900 md:text-3xl">Pourquoi Vita Fresh ?</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: "⚡", title: "Livraison rapide", desc: "Standard 24h ou express 2h sur Casablanca." },
              { icon: "🌱", title: "Producteurs locaux", desc: "Circuit court, prix juste, traçabilité totale." },
              { icon: "🏨", title: "B2B / CHR", desc: "Tarifs négociés, facturation, livraisons récurrentes." },
            ].map(b => (
              <div key={b.title} className="card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-2xl">{b.icon}</div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{b.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
