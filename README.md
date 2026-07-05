# Vita Fresh — Boutique en ligne

Next.js 15 + React 19 + TypeScript + Tailwind. Migrée du monolithe HTML (juin 2026).

## Architecture

- **Frontend** : Next.js 15 (App Router), React 19, TypeScript strict, Tailwind 3.
- **Backend** : FreshLink ERP (https://erp.vita-core.org) — **source unique de vérité**.
- **Données** : Supabase (instance partagée avec l'ERP). Pas de duplication de tables.
- **Proxy API** : `/api/*` est rewrite vers `${NEXT_PUBLIC_API_URL}/api/*` (voir `next.config.ts`).
- **État client** : panier + session dans `localStorage` (React Context), sans Redux/Zustand.

## Routes

| Route             | Description                                         |
| ----------------- | --------------------------------------------------- |
| `/`               | Landing : hero, sélection du jour, bénéfices        |
| `/catalogue`      | Liste filtrable (recherche, famille, ruptures)      |
| `/produit/[id]`   | Fiche produit + ajout au panier                     |
| `/panier`         | Panier + récap livraison                            |
| `/checkout`       | Coordonnées de livraison + soumission commande      |
| `/login`          | Connexion (POST `/api/ext/auth`)                    |
| `/inscription`    | Création de compte (POST `/api/ext/demande-compte`) |
| `/mon-compte`     | Dashboard client : KPIs + historique commandes      |
| `/livraison`      | Page commerciale livraison                          |
| `/professionnels` | Page CHR/marchands                                  |
| `/contact`        | Contact                                             |

## APIs ERP consommées

Toutes via le proxy `/api/*` :

- `GET  /api/ext/catalogue` — produits publiés
- `POST /api/ext/auth` — login (bcrypt, auto-upgrade plaintext)
- `POST /api/ext/demande-compte` — signup
- `GET  /api/ext/mon-compte` — profil (Bearer)
- `POST /api/ext/commandes` — passer commande
- `GET  /api/ext/commandes?tel=...` — historique d'un client

## Demarrage

```bash
cp .env.example .env.local   # editer NEXT_PUBLIC_API_URL si different
npm install
npm run dev                  # http://localhost:3000
```

## Deploiement Vercel

- Framework auto-detecte : `nextjs` (force dans `vercel.json`)
- Aucune commande a override
- Variables : `NEXT_PUBLIC_API_URL` (defaut : `https://f-l.vercel.app`)

## Legacy

L'ancien monolithe HTML (469 KB, un seul fichier) est archive dans `legacy/index.html`
pour reference. Il n'est plus servi.
