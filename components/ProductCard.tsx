"use client"

import { useState } from "react"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { money } from "@/lib/format"
import { useCart } from "@/lib/cart"

const FAMILLE_ICON: Record<string, string> = {
  "Légumes fruits": "🍅",
  "Légumes racines": "🥕",
  "Légumes feuilles": "🥦",
  "Herbes aromatiques": "🌿",
  "Agrumes": "🍊",
  "Fruits tropicaux": "🍌",
  "Fruits rouges": "🍓",
  "Fruits secs": "🌰",
}

export default function ProductCard({ product }: { product: Product }) {
  const { add, lines } = useCart()
  const inCart = lines.some(l => l.productId === product.id)
  const inStock = product.stockDisponible > 0
  const price = product.prixVente ?? product.prix
  const [justAdded, setJustAdded] = useState(false)

  const handleAdd = () => {
    if (!inStock) return
    add(product, 1)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  return (
    <div className="card flex flex-col overflow-hidden">
      <Link href={`/produit/${encodeURIComponent(product.id)}`} className="flex aspect-square items-center justify-center bg-gradient-to-br from-brand-50 to-white p-6">
        {product.imageUrl || product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl ?? product.image} alt={product.nom} className="h-full w-full object-contain" />
        ) : (
          <span className="text-7xl">{FAMILLE_ICON[product.famille ?? ""] ?? "🥗"}</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/produit/${encodeURIComponent(product.id)}`} className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-900 hover:text-brand">{product.nom}</h3>
            {product.nomAr && <p className="truncate text-xs text-slate-400" dir="rtl">{product.nomAr}</p>}
          </Link>
          {!inStock && <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">Rupture</span>}
        </div>

        {product.famille && (
          <span className="self-start chip">{FAMILLE_ICON[product.famille] ?? ""} {product.famille}</span>
        )}

        <div className="mt-auto flex items-baseline gap-1">
          <span className="text-xl font-black text-brand">{money(price)}</span>
          <span className="text-xs text-slate-500">/{product.unite}</span>
        </div>

        <button
          onClick={handleAdd}
          disabled={!inStock}
          className={`mt-1 w-full rounded-xl py-2.5 text-xs font-bold transition-all ${
            justAdded ? "bg-brand-accent text-brand-dark" :
            inCart ? "border border-brand bg-brand/10 text-brand" :
            inStock ? "bg-brand text-white hover:bg-brand-dark" :
            "cursor-not-allowed bg-slate-100 text-slate-400"
          }`}>
          {justAdded ? "✓ Ajouté !" : inCart ? "Dans le panier" : inStock ? "+ Ajouter au panier" : "Indisponible"}
        </button>
      </div>
    </div>
  )
}
