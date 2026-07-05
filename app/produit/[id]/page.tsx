"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { fetchCatalogue } from "@/lib/api"
import { useCart } from "@/lib/cart"
import { money } from "@/lib/format"
import type { Product } from "@/lib/types"

const FAMILLE_ICON: Record<string, string> = {
  "Légumes fruits": "🍅", "Légumes racines": "🥕", "Légumes feuilles": "🥦",
  "Herbes aromatiques": "🌿", "Agrumes": "🍊", "Fruits tropicaux": "🍌",
  "Fruits rouges": "🍓", "Fruits secs": "🌰",
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { add } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchCatalogue()
      .then(all => {
        if (cancelled) return
        const decoded = decodeURIComponent(id)
        setProduct(all.find(p => p.id === decoded) ?? null)
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="card aspect-square animate-pulse bg-slate-100" />
          <div className="space-y-4">
            <div className="h-8 w-1/2 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
            <div className="h-12 w-32 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Produit introuvable</h1>
        <p className="mt-2 text-slate-600">Ce produit n'existe plus ou a été retiré du catalogue.</p>
        <Link href="/catalogue" className="btn-primary mt-6 inline-flex">← Retour au catalogue</Link>
      </div>
    )
  }

  const price = product.prixVente ?? product.prix
  const inStock = product.stockDisponible > 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Link href="/catalogue" className="btn-ghost mb-6">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Catalogue
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Image */}
        <div className="card flex aspect-square items-center justify-center bg-gradient-to-br from-brand-50 to-white p-10">
          {product.imageUrl || product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl ?? product.image} alt={product.nom} className="h-full w-full object-contain" />
          ) : (
            <span className="text-[12rem]">{FAMILLE_ICON[product.famille ?? ""] ?? "🥗"}</span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          {product.famille && <span className="chip self-start">{FAMILLE_ICON[product.famille] ?? ""} {product.famille}</span>}
          <h1 className="text-3xl font-black text-slate-900 md:text-4xl">{product.nom}</h1>
          {product.nomAr && <p className="-mt-2 text-xl text-slate-500" dir="rtl">{product.nomAr}</p>}

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-brand">{money(price)}</span>
            <span className="text-base text-slate-500">/{product.unite}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`chip ${inStock ? "border-brand/30 bg-brand/5 text-brand" : "border-red-200 bg-red-50 text-red-700"}`}>
              {inStock ? `✓ En stock (${product.stockDisponible} ${product.unite})` : "Rupture"}
            </span>
            {product.conditionnement && <span className="chip">📦 {product.conditionnement}</span>}
          </div>

          {product.description && (
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{product.description}</p>
          )}

          {/* Add to cart */}
          <div className="card mt-4 flex flex-col gap-4 p-5">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700">Quantité</span>
              <div className="flex items-center rounded-xl border border-slate-200">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-1.5 text-lg text-slate-500 hover:text-brand">−</button>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={e => setQty(Math.max(1, Number(e.target.value) || 1))}
                  className="w-16 border-x border-slate-200 px-2 py-1.5 text-center text-sm font-bold focus:outline-none"
                />
                <button onClick={() => setQty(q => q + 1)} className="px-3 py-1.5 text-lg text-slate-500 hover:text-brand">+</button>
              </div>
              <span className="text-sm text-slate-500">{product.unite}</span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-sm text-slate-500">Sous-total</span>
              <span className="text-2xl font-black text-brand">{money(price * qty)}</span>
            </div>

            <button
              onClick={() => { add(product, qty); setAdded(true); setTimeout(() => setAdded(false), 1500) }}
              disabled={!inStock}
              className="btn-primary w-full py-3">
              {added ? "✓ Ajouté au panier" : "Ajouter au panier"}
            </button>
            <button
              onClick={() => { add(product, qty); router.push("/panier") }}
              disabled={!inStock}
              className="btn-outline w-full py-3">
              Commander maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
