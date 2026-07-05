import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Pro & CHR — Hôtels, restaurants, marchands",
  description: "Vita Fresh fournit hôtels, restaurants, cafés et marchands à Casablanca. Tarifs négociés, facturation, livraisons récurrentes.",
}

export default function ProsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-black text-slate-900">Pour les professionnels</h1>
      <p className="mt-2 text-lg text-slate-600">Hôtels, restaurants, cafés, marchands — un partenaire fiable pour vos approvisionnements quotidiens.</p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          { t: "Tarifs négociés", d: "Grille CHR ou Marchand selon votre profil, marges optimisées sur les volumes." },
          { t: "Facturation pro", d: "Factures conformes, paiement à 30j, encours négociable." },
          { t: "Livraisons récurrentes", d: "Planning hebdomadaire, livraisons J+1, gestion des absences." },
          { t: "Espace pro dédié", d: "Tableau de bord, suivi commandes, factures, wallet fidélité." },
          { t: "Compte multi-utilisateurs", d: "Propriétaire + Gérant : chacun son accès, vous gardez le contrôle." },
          { t: "Parrainage", d: "Récompenses pour chaque commerce que vous nous présentez." },
        ].map(b => (
          <div key={b.t} className="card p-6">
            <h3 className="font-bold text-slate-900">{b.t}</h3>
            <p className="mt-1 text-sm text-slate-600">{b.d}</p>
          </div>
        ))}
      </div>

      <div className="card mt-12 flex flex-col gap-3 bg-gradient-to-br from-brand-50 to-white p-8 text-center">
        <h2 className="text-2xl font-black text-slate-900">Prêt à démarrer ?</h2>
        <p className="text-slate-600">Créez votre compte pro en 1 minute. Activation manuelle sous 24h.</p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link href="/inscription" className="btn-primary">Créer un compte pro</Link>
          <a href="mailto:contact@vita-core.org" className="btn-outline">Parler à un commercial</a>
        </div>
      </div>
    </div>
  )
}
