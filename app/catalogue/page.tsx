"use client"

import { useEffect, useMemo, useState } from "react"
import { fetchCatalogue } from "@/lib/api"
import type { Product } from "@/lib/types"
import ProductCard from "@/components/ProductCard"

export default function CataloguePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [famille, setFamille] = useState("Toutes")
  const [showOutOfStock, setShowOutOfStock] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchCatalogue()
      .then(data => { if (!cancelled) setProducts(data) })
      .catch(e => { if (!cancelled) setError(e.message ?? "Erreur de chargement") })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const familles = useMemo(() => {
    const set = new Set(products.map(p => p.famille).filter(Boolean) as string[])
    return ["Toutes", ...Array.from(set).sort()]
  }, [products])

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (!showOutOfStock && p.stockDisponible <= 0) return false
      if (famille !== "Toutes" && p.famille !== famille) return false
      if (search) {
        const s = search.toLowerCase()
        if (!p.nom.toLowerCase().includes(s) && !(p.nomAr ?? "").includes(search)) return false
      }
      return true
    })
  }, [products, search, famille, showOutOfStock])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 md:text-4xl">Catalogue</h1>
        <p className="mt-1 text-sm text-slate-500">Tous nos produits, mis à jour quotidiennement.</p>
      </div>

      {/* Filters */}
      <div className="card mb-6 flex flex-col gap-3 p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un produit…"
            className="input pl-10"
          />
        </div>
        <select value={famille} onChange={e => setFamille(e.target.value)} className="input md:w-auto">
          {familles.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={showOutOfStock} onChange={e => setShowOutOfStock(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand" />
          Inclure ruptures
        </label>
      </div>

      {/* States */}
      {loading && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card aspect-[3/4] animate-pulse bg-slate-100" />
          ))}
        </div>
      )}
      {!loading && error && (
        <div className="card flex flex-col items-center gap-3 py-12 text-center">
          <span className="text-4xl">⚠️</span>
          <p className="font-semibold text-slate-700">Erreur de chargement du catalogue</p>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
      )}
      {!loading && !error && filtered.length === 0 && (
        <div className="card flex flex-col items-center gap-3 py-16 text-center">
          <span className="text-4xl">🔍</span>
          <p className="font-semibold text-slate-700">Aucun produit ne correspond</p>
          <p className="text-sm text-slate-500">Modifiez vos filtres pour voir plus de produits.</p>
        </div>
      )}
      {!loading && !error && filtered.length > 0 && (
        <>
          <p className="mb-4 text-sm text-slate-500">{filtered.length} produit{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </div>
  )
}
