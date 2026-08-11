import Link from "next/link"
import Logo from "./Logo"

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-24 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo size={32} />
              <span className="text-base font-black tracking-tight text-brand">VITA FRESH</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Fruits & légumes ultra-frais, livrés à Casablanca. Service B2B et particuliers.
            </p>
          </div>
          <FooterCol title="Boutique" links={[
            { href: "/catalogue", label: "Catalogue" },
            { href: "/livraison", label: "Livraison" },
            { href: "/professionnels", label: "Pro / CHR" },
          ]} />
          <FooterCol title="Mon espace" links={[
            { href: "/login", label: "Connexion" },
            { href: "/inscription", label: "Créer un compte" },
            { href: "/mon-compte", label: "Mon compte" },
          ]} />
          <FooterCol title="Contact" links={[
            { href: "mailto:contact@vita-core.org", label: "contact@vita-core.org" },
            { href: "tel:+212600000000", label: "+212 6 00 00 00 00" },
            { href: "https://erp.vita-agro.com", label: "Espace ERP →", external: true },
          ]} />
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 md:flex-row">
          <p className="text-xs text-slate-500">&copy; {year} <span className="font-semibold text-slate-700">Vita Agro Capital</span> — Tous droits réservés</p>
          <p className="text-xs text-slate-400" dir="rtl">جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string; external?: boolean }[] }) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</h4>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map(l => (
          <li key={l.href}>
            {l.external ? (
              <a href={l.href} target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:text-brand">{l.label}</a>
            ) : (
              <Link href={l.href} className="text-sm text-slate-600 hover:text-brand">{l.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
