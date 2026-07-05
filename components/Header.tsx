"use client"

import Link from "next/link"
import { useState } from "react"
import Logo from "./Logo"
import ThemeToggle from "./ThemeToggle"
import { useCart } from "@/lib/cart"
import { useSession } from "@/lib/session"

export default function Header() {
  const { count } = useCart()
  const { session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: "/catalogue", label: "Catalogue" },
    { href: "/livraison", label: "Livraison" },
    { href: "/professionnels", label: "Pro / CHR" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={36} />
          <div className="flex flex-col leading-tight">
            <span className="text-base font-black tracking-tight text-brand">VITA FRESH</span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Casablanca</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="btn-ghost">{l.label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session ? (
            <Link href="/mon-compte" className="btn-ghost hidden sm:inline-flex">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              {session.user.name.split(" ")[0]}
            </Link>
          ) : (
            <Link href="/login" className="btn-ghost hidden sm:inline-flex">Connexion</Link>
          )}

          <Link href="/panier" className="relative btn-outline">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span className="hidden sm:inline">Panier</span>
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-accent px-1.5 text-[10px] font-bold text-brand-dark">{count}</span>
            )}
          </Link>

          <button onClick={() => setMenuOpen(o => !o)} className="md:hidden btn-ghost" aria-label="Menu">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">{l.label}</Link>
            ))}
            <Link href={session ? "/mon-compte" : "/login"} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              {session ? "Mon compte" : "Connexion"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
