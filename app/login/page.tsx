"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { login } from "@/lib/api"
import { useSession } from "@/lib/session"
import Logo from "@/components/Logo"

export default function LoginPage() {
  const router = useRouter()
  const { setSession } = useSession()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!identifier.trim() || !password.trim()) { setError("Saisissez identifiant et mot de passe."); return }
    setLoading(true)
    try {
      const sess = await login(identifier.trim(), password)
      setSession(sess)
      router.push("/mon-compte")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Identifiants incorrects")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem-200px)] max-w-md flex-col justify-center px-4 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo size={56} />
        <h1 className="text-2xl font-black text-slate-900">Connexion</h1>
        <p className="text-sm text-slate-500">Accédez à votre espace client Vita Fresh</p>
      </div>

      <form onSubmit={handleSubmit} className="card mt-8 flex flex-col gap-4 p-6">
        {error && (
          <p className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Email ou téléphone</label>
          <input value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="vous@email.ma" className="input" autoComplete="username" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Mot de passe</label>
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="input pr-12"
            />
            <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
              {showPwd ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-2 w-full justify-center py-3">
          {loading ? "Connexion…" : "Se connecter"}
        </button>

        <div className="mt-2 border-t border-slate-100 pt-4 text-center">
          <p className="text-xs text-slate-500">Pas encore de compte ?</p>
          <Link href="/inscription" className="mt-1 inline-block text-sm font-semibold text-brand hover:underline">Créer un compte →</Link>
        </div>
      </form>

      <p className="mt-6 text-center text-xs text-slate-400">
        Vous êtes un membre de l'équipe ?{" "}
        <a href="https://erp.vita-core.org" className="font-semibold text-brand hover:underline">Accédez à l'ERP →</a>
      </p>
    </div>
  )
}
