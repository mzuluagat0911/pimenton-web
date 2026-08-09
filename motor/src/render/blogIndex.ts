import type { Destino, PublishedPost } from "../lib/state.js";
import { WHATSAPP_CTA_EN, WHATSAPP_CTA_ES } from "../config/cta.js";

type IndexLang = "es" | "en";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function formatDate(iso: string, lang: IndexLang): string {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Hub unificado: Pimentón + Control Room juntos. */
const HUB = {
  es: {
    title: "Blog | Pimentón",
    description:
      "Delivery, apps y ops para restaurantes en LATAM y USA. Rentabilidad, P&L y Control Room — guías citables.",
    eyebrow: "Blog Pimentón",
    h1: "Delivery rentable para restaurantes",
    lead: "Apps, comisiones, P&L y ops multi-sucursal — sin humo. Para dueños en LATAM y USA que quieren margen y claridad.",
    cta: "WhatsApp",
    empty: "Pronto, los primeros artículos.",
    path: "/blog",
    agenda: WHATSAPP_CTA_ES,
    brandHref: "/es",
    brandAlt: "Pimentón",
    logo: "/assets/logos/principal/logo-coral.webp",
  },
  en: {
    title: "Blog | Pimentón",
    description:
      "Delivery, apps, and ops for restaurants in LATAM and the US. Profitability, P&L, and Control Room — citable guides.",
    eyebrow: "Pimentón Blog",
    h1: "Profitable delivery for restaurants",
    lead: "Apps, fees, P&L, and multi-location ops — no fluff. For owners in LATAM and the US who want margin and clarity.",
    cta: "WhatsApp",
    empty: "First articles coming soon.",
    path: "/en/blog",
    agenda: WHATSAPP_CTA_EN,
    brandHref: "/en",
    brandAlt: "Pimentón",
    logo: "/assets/logos/principal/logo-coral.webp",
  },
} as const;

function mapPost(p: PublishedPost, lang: IndexLang) {
  if (lang === "en" && p.pathEn) {
    return {
      href: p.pathEn,
      title: p.titleEn ?? p.title,
      description: p.descriptionEn ?? p.description,
      date: p.date,
      destino: p.destino,
    };
  }
  return {
    href: p.path,
    title: p.title,
    description: p.description,
    date: p.date,
    destino: p.destino,
  };
}

function postsAll(posts: PublishedPost[], lang: IndexLang) {
  return posts.slice().reverse().map((p) => mapPost(p, lang));
}

function postsFor(posts: PublishedPost[], destino: Destino, lang: IndexLang) {
  return posts
    .filter((p) => p.destino === destino)
    .slice()
    .reverse()
    .map((p) => mapPost(p, lang));
}

function laneLabel(destino: Destino, lang: IndexLang): string {
  if (destino === "control-room") return lang === "es" ? "Control Room" : "Control Room";
  return lang === "es" ? "Delivery" : "Delivery";
}

/** Índice unificado /blog (todos los carriles). */
export function renderBlogIndex(
  posts: PublishedPost[],
  siteUrl: string,
  _destino: Destino | "all" = "all",
  lang: IndexLang = "es",
): string {
  const c = HUB[lang];
  const list = postsAll(posts, lang);
  const canonical = `${siteUrl}${c.path}`;
  const altEs = `${siteUrl}${HUB.es.path}`;
  const altEn = `${siteUrl}${HUB.en.path}`;

  const cards = list
    .map(
      (p, i) => `        <a class="post-card${i === 0 ? " post-card--featured" : ""}" href="${p.href}">
          <div class="post-card-meta">
            <span class="lane">${esc(laneLabel(p.destino, lang))}</span>
            ·
            <time datetime="${esc(p.date)}">${esc(formatDate(p.date, lang))}</time>
          </div>
          <h2>${esc(p.title)}</h2>
          <p>${esc(p.description)}</p>
          <span class="post-card-more" aria-hidden="true">${lang === "es" ? "Leer" : "Read"} →</span>
        </a>`,
    )
    .join("\n");

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(c.title)}</title>
    <meta name="description" content="${esc(c.description)}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="es" href="${altEs}" />
    <link rel="alternate" hreflang="en" href="${altEn}" />
    <link rel="alternate" hreflang="x-default" href="${altEs}" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="theme-color" content="#E84B3C" />
    <style>
      :root {
        --accent:#E84B3C; --ink:#0F0F0E; --muted:#6B6967; --line:#E8DCC7;
        --bg:#FAF1E3; --card:#FFFFFF; --topbar:rgba(250,241,227,.88);
      }
      * { box-sizing:border-box; }
      body {
        margin:0;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        color:var(--ink); background:var(--bg); -webkit-font-smoothing:antialiased;
      }
      a { color:inherit; text-decoration:none; }
      .topbar { position:sticky; top:0; z-index:20; background:var(--topbar); backdrop-filter:blur(12px); border-bottom:1px solid var(--line); }
      .topbar-inner { max-width:1120px; margin:0 auto; padding:14px 24px; display:flex; justify-content:space-between; align-items:center; gap:16px; }
      .brand img { height:28px; display:block; }
      .top-actions { display:flex; align-items:center; gap:18px; font-size:14px; font-weight:500; }
      .lang a { opacity:.5; }
      .lang a.active { opacity:1; }
      .btn-cta { font-weight:600; color:var(--accent); }
      .hero { max-width:1120px; margin:0 auto; padding:64px 24px 28px; }
      .eyebrow { color:var(--accent); font-weight:700; font-size:12px; letter-spacing:.14em; text-transform:uppercase; display:inline-flex; align-items:center; gap:8px; }
      .eyebrow::before { content:""; width:6px; height:6px; border-radius:50%; background:var(--accent); }
      h1 { font-weight:700; font-size:clamp(2.4rem,6vw,3.4rem); line-height:1.08; margin:16px 0 14px; letter-spacing:-.02em; max-width:18ch; }
      .lead { color:var(--muted); font-size:1.08rem; line-height:1.6; max-width:48ch; margin:0; }
      .grid { max-width:1120px; margin:0 auto; padding:24px 24px 96px; display:grid; gap:18px; }
      @media (min-width:820px) {
        .grid { grid-template-columns:1.2fr 1fr; align-items:stretch; }
        .post-card--featured { grid-row: span 2; }
      }
      .post-card {
        display:flex; flex-direction:column; gap:12px;
        background:var(--card); border:1px solid var(--line);
        border-radius:18px; padding:28px 26px 24px;
        transition: transform .2s ease, border-color .2s ease;
      }
      .post-card:hover { transform:translateY(-2px); border-color:rgba(232,75,60,.45); }
      .post-card-meta { font-size:13px; color:var(--muted); font-weight:500; }
      .post-card-meta .lane { color:var(--accent); font-weight:700; }
      .post-card h2 {
        font-weight:700;
        font-size:clamp(1.35rem,2.4vw,1.7rem); line-height:1.2; margin:0; letter-spacing:-.015em;
      }
      .post-card--featured h2 { font-size:clamp(1.7rem,3.2vw,2.15rem); }
      .post-card p { color:var(--muted); margin:0; line-height:1.6; flex:1; }
      .post-card-more { margin-top:8px; font-size:14px; font-weight:600; color:var(--accent); }
      .empty { color:var(--muted); padding:40px 0; }
    </style>
  </head>
  <body>
    <header class="topbar">
      <div class="topbar-inner">
        <a class="brand" href="${c.brandHref}" aria-label="${esc(c.brandAlt)}"><img src="${c.logo}" alt="${esc(c.brandAlt)}" /></a>
        <div class="top-actions">
          <span class="lang">
            <a href="${HUB.es.path}" hreflang="es" class="${lang === "es" ? "active" : ""}">ES</a>
            ·
            <a href="${HUB.en.path}" hreflang="en" class="${lang === "en" ? "active" : ""}">EN</a>
          </span>
          <a class="btn-cta" href="${c.agenda}" target="_blank" rel="noopener noreferrer">${c.cta}</a>
        </div>
      </div>
    </header>
    <header class="hero">
      <p class="eyebrow">${c.eyebrow}</p>
      <h1>${c.h1}</h1>
      <p class="lead">${c.lead}</p>
    </header>
    <main class="grid">
${cards || `      <p class="empty">${c.empty}</p>`}
    </main>
  </body>
</html>
`;
}

/** Cards HTML para incrustar en landings (todos los carriles por defecto). */
export function renderBlogTeaserCards(
  posts: PublishedPost[],
  destino: Destino | "all" = "all",
  lang: IndexLang = "es",
  limit = 3,
): string {
  const list =
    destino === "all"
      ? postsAll(posts, lang).slice(0, limit)
      : postsFor(posts, destino, lang).slice(0, limit);
  if (!list.length) {
    return lang === "es"
      ? `<p class="blog-teaser-empty">Pronto publicamos las primeras guías.</p>`
      : `<p class="blog-teaser-empty">First guides coming soon.</p>`;
  }
  return list
    .map(
      (p) => `<a class="blog-teaser-card" href="${p.href}">
  <time datetime="${esc(p.date)}">${esc(formatDate(p.date, lang))}</time>
  <h3>${esc(p.title)}</h3>
  <p>${esc(p.description)}</p>
  <span class="blog-teaser-more">${lang === "es" ? "Leer artículo" : "Read article"} →</span>
</a>`,
    )
    .join("\n");
}
