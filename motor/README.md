# Motor de blog — Pimentón (SEO/GEO, automático)

Clon estructural del motor de Picante: agentes que **idean, redactan y publican**
blogs bilingües (ES/EN) como HTML estático en `public/blog`. Corre con
**GitHub Actions** + API Anthropic. **No usa CMS ni Supabase.**

## Cómo funciona

```
GitHub Actions (cron) → Buscador → Redactor (ES+EN) → Render → public/blog/*.html
→ commit a main → Vercel despliega
```

- **Estado:** `motor/data/state.json` (no repite keywords).
- **Carriles:** `pimenton` (agencia) y `control-room` (ops), brand en `src/config/brand/`.
- **Teasers:** marcadores en `data/blog-teasers/*.html` → componente React en la home.

## Local

```bash
cd motor
cp .env.example .env   # ANTHROPIC_API_KEY
npm install
npm run ideas          # solo ideación
npm run run            # genera HTML en public/blog
```

Regenerar índices sin Anthropic:

```bash
node --import tsx scripts/rebuild-indexes.mjs
```

## GitHub

1. Secret `ANTHROPIC_API_KEY`
2. Actions → Workflow permissions → **Read and write**
3. Actions → "Motor de blog" → Run workflow
