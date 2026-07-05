# Site vitrine Vita Fresh (statique)

Site monolithe HTML **actuellement déployé** sur shop.vita-core.org.
C'est la version que le client itère activement (logo, actualités, chatbot, config globale).

## Contenu
- `index.html` — site complet (480 KB, autonome)
- `vercel.json` — proxy `/api/*` → `https://erp.vita-core.org`
- `robots.txt`, `sitemap.xml`, `og-image.svg`

## Déploiement
```bash
vercel deploy --prod   # depuis ce dossier
vercel alias set <url> shop.vita-core.org
```

## Fonctionnalités (juin 2026)
- Logo « VITA FRESH · by Vita Agro Capital »
- Section Actualités (admin-gérable, pubs images)
- Galerie photos/vidéos (YouTube/Vimeo auto-embed)
- Chatbot intelligent (recherche produit live)
- Config GLOBALE via `/api/ext/site-config` (contact + maintenance partagés)
- Aucune clé Supabase exposée (sécurité)

La version Next.js 15 (future) est à la racine du repo. Ce dossier est la
vitrine statique live en attendant la bascule Next.js.
