"use client"
import { useState } from "react"
import Link from "next/link"
type Suggestion={id:string;nom:string;unite:string;prix:number|null;available:boolean}
export default function ShopAssistant(){
 const [open,setOpen]=useState(false),[question,setQuestion]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState("")
 const [result,setResult]=useState<{intent:string;products:Suggestion[]}|null>(null)
 async function ask(value=question){
  if(busy||!value.trim())return
  setQuestion(value);setBusy(true);setError("");setResult(null)
  try{const r=await fetch("/api/ext/shop-assistant",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:value}),signal:AbortSignal.timeout(35000)});const b=await r.json();if(!r.ok)throw Error(b.error||"Assistant indisponible.");setResult(b)}
  catch(e){setError(e instanceof Error?e.message:"Assistant indisponible.")}finally{setBusy(false)}
 }
 return <div className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)]">
  {!open?<button className="rounded-full bg-emerald-800 px-5 py-3 text-white shadow-lg" onClick={()=>setOpen(true)}>Conseil produits · IA</button>:<section aria-label="Assistant produits Vita Fresh" className="flex max-h-[80dvh] w-96 max-w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl">
   <header className="flex items-center justify-between bg-emerald-800 p-4 text-white"><h2 className="font-semibold">Votre sélection Vita Fresh</h2><button aria-label="Fermer l’assistant" className="p-2" onClick={()=>setOpen(false)}>✕</button></header>
   <div className="overflow-y-auto p-4 space-y-3">
    <p className="text-sm">Décrivez votre repas ou les produits recherchés, en français, arabe ou darija. Je vous propose une sélection du catalogue.</p>
    <div className="flex flex-wrap gap-2">{["Légumes pour un couscous","Fruits disponibles","Bghit maticha"].map(q=><button key={q} disabled={busy} onClick={()=>void ask(q)} className="rounded-full border px-3 py-2 text-xs disabled:opacity-50">{q}</button>)}</div>
    <form onSubmit={e=>{e.preventDefault();void ask()}} className="space-y-2"><label className="block text-sm">Votre besoin<textarea maxLength={1000} value={question} onChange={e=>setQuestion(e.target.value)} className="mt-1 min-h-20 w-full rounded-lg border bg-white p-2 text-slate-900"/></label><p className="text-xs text-slate-500">Votre demande est traitée par Groq. Ne saisissez pas de données personnelles.</p><button disabled={busy||!question.trim()} className="w-full rounded-lg bg-emerald-800 p-3 text-white disabled:opacity-50">{busy?"Recherche dans le catalogue…":"Proposer une sélection"}</button></form>
    <div aria-live="polite">{error&&<p role="alert" className="text-sm text-red-700">{error}</p>}{result&&<div className="space-y-3">
     <p className="text-sm">{result.intent!=="products"?"Pour une livraison, un suivi ou une demande particulière, contactez notre équipe depuis la page Contact. Aucun délai n’est confirmé par cet assistant.":result.products.length?"Voici des produits du catalogue correspondant à votre demande. Vérifiez les quantités et le prix final avant de commander.":"Aucun produit correspondant trouvé. Essayez un nom de produit ou consultez le catalogue."}</p>
     {result.products.map(p=><Link key={p.id} href={`/produit/${encodeURIComponent(p.id)}`} className="block rounded-xl border p-3 hover:border-emerald-600"><strong>{p.nom}</strong><div className="text-sm">{p.prix===null?"Prix à confirmer":`${p.prix.toLocaleString("fr-MA")} DH / ${p.unite}`} · {p.available?"Disponible au catalogue":"Disponibilité à confirmer"}</div><span className="text-xs text-emerald-800">Voir le produit →</span></Link>)}
     <Link href={result.intent==="products"?"/catalogue":"/contact"} className="inline-block text-sm underline">{result.intent==="products"?"Voir tout le catalogue":"Contacter l’équipe"}</Link>
    </div>}</div>
   </div>
  </section>}
 </div>
}
