import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-300px)] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="text-7xl">🍃</span>
      <h1 className="mt-4 text-4xl font-black text-slate-900">Page introuvable</h1>
      <p className="mt-2 text-slate-500">Cette page n'existe pas ou a été déplacée.</p>
      <Link href="/" className="btn-primary mt-6">Retour à l'accueil</Link>
    </div>
  )
}
