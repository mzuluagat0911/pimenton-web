# Motor de blog Pimentón — Handoff

Clon estructural de Webpicante/motor, brand Pimentón.

## Arquitectura

```
GitHub Actions (cron domingo 13:00 UTC) ó local (npm run run)
        │  ANTHROPIC_API_KEY (claude-opus-4-8)
        ▼
   Orquestador  ── por cada carril (pimenton / control-room):
        ├─► Buscador   (web_search → JSON ideas)
        ├─► Redactor   (streaming ES + EN)
        ├─► Render     (template.ts — chrome Pimentón)
        └─► Publicador
               · public/blog/<slug>.html + public/en/blog/<slug>.html
               · índices + sitemap-blog.xml
               · teasers en data/blog-teasers/
               · motor/data/state.json
        ▼
   git commit + push main → Vercel
```

## Next.js (diferencias vs Picante HTML puro)

| Picante | Pimentón |
|---------|----------|
| `blog/` en raíz | `public/blog/` (Next sirve estáticos) |
| `index.html` / `pulse.html` teasers | `data/blog-teasers/*.html` + `<BlogTeasers />` |
| `sitemap.xml` raíz | `public/sitemap-blog.xml` + posts en `app/sitemap.ts` |
| vercel rewrites | `next.config.ts` rewrites + middleware excluye `/blog` y `/en/blog` |

## Fase 2 — Tu lado

1. GitHub → Actions → Workflow permissions → Read and write
2. Secret `ANTHROPIC_API_KEY`
3. (Opcional) `motor/.env` local

## Comandos

- `npm run ideas` — solo ideación
- `npm run run` — 1 post por carril (ES+EN)
- `node --import tsx scripts/rebuild-indexes.mjs` — índices sin API
