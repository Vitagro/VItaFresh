import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Vita Fresh à Casablanca. Email, téléphone, WhatsApp.",
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-black text-slate-900">Contact</h1>
      <p className="mt-2 text-lg text-slate-600">Une question, une commande spéciale ? Nous sommes à votre écoute.</p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <a href="tel:+212600000000" className="card flex items-center gap-4 p-5 hover:border-brand">
          <span className="text-3xl">📞</span>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Téléphone</p>
            <p className="font-bold text-slate-900">+212 6 00 00 00 00</p>
          </div>
        </a>
        <a href="mailto:contact@vita-core.org" className="card flex items-center gap-4 p-5 hover:border-brand">
          <span className="text-3xl">✉️</span>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Email</p>
            <p className="font-bold text-slate-900">contact@vita-core.org</p>
          </div>
        </a>
        <a href="https://wa.me/212600000000" target="_blank" rel="noreferrer" className="card flex items-center gap-4 p-5 hover:border-brand">
          <span className="text-3xl">💬</span>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">WhatsApp</p>
            <p className="font-bold text-slate-900">+212 6 00 00 00 00</p>
          </div>
        </a>
        <div className="card flex items-center gap-4 p-5">
          <span className="text-3xl">📍</span>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Adresse</p>
            <p className="font-bold text-slate-900">Casablanca, Maroc</p>
          </div>
        </div>
      </div>
    </div>
  )
}
