"use client"

import Link from "next/link"
import { useCart } from "@/lib/cart"
import { money } from "@/lib/format"

const FREE_DELIVERY_THRESHOLD = 150
const STANDARD_DELIVERY_FEE = 25

export default function CartPage() {
  const { lines, setQty, remove, total, count } = useCart()

  const livraison = total >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE
  const grandTotal = total + livraison

  if (count === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <span className="text-6xl">🛒</span>
        <h1 className="mt-4 text-3xl font-black text-slate-900">Votre panier est vide</h1>
        <p className="mt-2 text-slate-500">Découvrez notre catalogue pour ajouter vos premiers produits.</p>
        <Link href="/catalogue" className="btn-primary mt-6 inline-flex">Voir le catalogue →</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-black text-slate-900 md:text-4xl">Votre panier</h1>
      <p className="mt-1 text-sm text-slate-500">{count} article{count > 1 ? "s" : ""}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Lines */}
        <div className="flex flex-col gap-3">
          {lines.map(l => (
            <div key={l.productId} className="card flex items-center gap-4 p-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand-50 text-3xl">🥗</div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-bold text-slate-900">{l.nom}</h3>
                <p className="text-xs text-slate-500">{money(l.prix)} / {l.unite}</p>
              </div>
              <div className="flex items-center rounded-xl border border-slate-200">
                <button onClick={() => setQty(l.productId, l.quantite - 1)} className="px-3 py-1.5 text-lg text-slate-500 hover:text-brand">−</button>
                <input
                  type="number" min={0} value={l.quantite}
                  onChange={e => setQty(l.productId, Number(e.target.value) || 0)}
                  className="w-14 border-x border-slate-200 px-1 py-1.5 text-center text-sm font-bold focus:outline-none"
                />
                <button onClick={() => setQty(l.productId, l.quantite + 1)} className="px-3 py-1.5 text-lg text-slate-500 hover:text-brand">+</button>
              </div>
              <div className="w-24 text-right font-black text-brand">{money(l.prix * l.quantite)}</div>
              <button onClick={() => remove(l.productId)} className="p-2 text-slate-400 hover:text-red-600" aria-label="Retirer">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a2 2 0 012-2h2a2 2 0 012 2v3" /></svg>
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="card sticky top-24 flex h-fit flex-col gap-3 p-5">
          <h2 className="text-lg font-bold text-slate-900">Récapitulatif</h2>
          <div className="flex justify-between text-sm text-slate-600">
            <span>Sous-total</span>
            <span className="font-semibold text-slate-900">{money(total)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <span>Livraison</span>
            <span className={`font-semibold ${livraison === 0 ? "text-brand" : "text-slate-900"}`}>
              {livraison === 0 ? "Gratuite" : money(livraison)}
            </span>
          </div>
          {livraison > 0 && (
            <p className="rounded-xl bg-brand-50 px-3 py-2 text-xs text-brand">
              Plus que <strong>{money(FREE_DELIVERY_THRESHOLD - total)}</strong> pour la livraison gratuite !
            </p>
          )}
          <div className="my-2 border-t border-slate-100" />
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-slate-700">Total</span>
            <span className="text-2xl font-black text-brand">{money(grandTotal)}</span>
          </div>
          <Link href="/checkout" className="btn-primary mt-2 w-full justify-center py-3">Passer commande →</Link>
          <Link href="/catalogue" className="btn-ghost w-full justify-center text-xs">Continuer mes achats</Link>
        </aside>
      </div>
    </div>
  )
}
