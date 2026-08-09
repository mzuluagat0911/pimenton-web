// Renderizador: convierte un borrador estructurado en HTML estático.
// El agente escribe el CONTENIDO; este módulo pone el chrome (head, nav,
// footer, schema, hreflang) alineado al brand Pimentón.

import type { Destino } from "../lib/state.js";
import { WHATSAPP_CTA_EN, WHATSAPP_CTA_ES } from "../config/cta.js";

export interface FaqItem {
  q: string;
  a: string;
}

export interface ArticleDraft {
  destino: Destino;
  lang: "es" | "en";
  slug: string;
  title: string;
  headline: string;
  metaDescription: string;
  keywords: string[];
  eyebrow: string;
  answerHtml: string;
  byline: string;
  bodyHtml: string;
  faq: FaqItem[];
  datePublished: string;
}

export interface RenderContext {
  siteUrl: string;
  esPath: string;
  enPath: string;
  ogImage?: string;
}

const T = {
  pimenton: {
    es: {
      nav: { home: "Inicio", blog: "Blog", schedule: "WhatsApp" },
      blogHref: "/blog",
      homeHref: "/es",
      ctaTitle: "¿Listo a potenciar tu delivery?",
      ctaText:
        "Escríbenos por WhatsApp. En minutos coordinamos una consultoría gratuita con diagnóstico de canales, ops y próximos pasos.",
      ctaLabel: "Escribir por WhatsApp",
      ctaHref: WHATSAPP_CTA_ES,
      faqTitle: "Preguntas frecuentes",
      footerLinks: `<a href="/es">Inicio</a> · <a href="/blog">Blog</a> · <a href="${WHATSAPP_CTA_ES}">WhatsApp</a>`,
      breadcrumbBlog: "Blog",
      breadcrumbBlogUrl: "/blog",
    },
    en: {
      nav: { home: "Home", blog: "Blog", schedule: "WhatsApp" },
      blogHref: "/en/blog",
      homeHref: "/en",
      ctaTitle: "Ready to supercharge your delivery?",
      ctaText:
        "Message us on WhatsApp. We'll book a free consultancy with a clear diagnosis of channels, ops, and next steps.",
      ctaLabel: "Message on WhatsApp",
      ctaHref: WHATSAPP_CTA_EN,
      faqTitle: "Frequently asked questions",
      footerLinks: `<a href="/en">Home</a> · <a href="/en/blog">Blog</a> · <a href="${WHATSAPP_CTA_EN}">WhatsApp</a>`,
      breadcrumbBlog: "Blog",
      breadcrumbBlogUrl: "/en/blog",
    },
  },
  "control-room": {
    es: {
      nav: { home: "Inicio", blog: "Blog", schedule: "WhatsApp" },
      blogHref: "/blog",
      homeHref: "/es",
      ctaTitle: "¿Quieres ver tu delivery con claridad?",
      ctaText:
        "Escríbenos por WhatsApp. Revisamos qué está rompiendo el ritmo multi-sucursal y qué mover primero.",
      ctaLabel: "Escribir por WhatsApp",
      ctaHref: WHATSAPP_CTA_ES,
      faqTitle: "Preguntas frecuentes",
      footerLinks: `<a href="/es">Inicio</a> · <a href="/blog">Blog</a> · <a href="${WHATSAPP_CTA_ES}">WhatsApp</a>`,
      breadcrumbBlog: "Blog",
      breadcrumbBlogUrl: "/blog",
    },
    en: {
      nav: { home: "Home", blog: "Blog", schedule: "WhatsApp" },
      blogHref: "/en/blog",
      homeHref: "/en",
      ctaTitle: "Want clear visibility on your delivery?",
      ctaText:
        "Message us on WhatsApp. We'll review what's breaking multi-location rhythm and what to fix first.",
      ctaLabel: "Message on WhatsApp",
      ctaHref: WHATSAPP_CTA_EN,
      faqTitle: "Frequently asked questions",
      footerLinks: `<a href="/en">Home</a> · <a href="/en/blog">Blog</a> · <a href="${WHATSAPP_CTA_EN}">WhatsApp</a>`,
      breadcrumbBlog: "Blog",
      breadcrumbBlogUrl: "/en/blog",
    },
  },
} as const;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function faqAccordion(faq: FaqItem[]): string {
  return faq
    .map(
      (f) => `            <details>
              <summary>${esc(f.q)}</summary>
              <p>${esc(f.a)}</p>
            </details>`,
    )
    .join("\n");
}

function jsonLd(draft: ArticleDraft, ctx: RenderContext, canonical: string, ogImage: string): string {
  const t = T[draft.destino][draft.lang];
  const authorName = draft.destino === "control-room" ? "Control Room by Pimentón" : "Pimentón";
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: draft.headline,
    description: draft.metaDescription,
    inLanguage: draft.lang,
    author: { "@type": "Organization", name: authorName, url: `${ctx.siteUrl}${t.homeHref}` },
    publisher: {
      "@type": "Organization",
      name: "Pimentón",
      logo: { "@type": "ImageObject", url: ogImage },
    },
    datePublished: draft.datePublished,
    dateModified: draft.datePublished,
    mainEntityOfPage: canonical,
    image: ogImage,
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: draft.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: draft.lang === "es" ? "Inicio" : "Home",
        item: `${ctx.siteUrl}${t.homeHref}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t.breadcrumbBlog,
        item: `${ctx.siteUrl}${t.breadcrumbBlogUrl}`,
      },
      { "@type": "ListItem", position: 3, name: draft.headline, item: canonical },
    ],
  };
  return [article, faqLd, breadcrumb]
    .map((o) => `    <script type="application/ld+json">\n${JSON.stringify(o, null, 6)}\n    </script>`)
    .join("\n");
}

export function renderArticle(draft: ArticleDraft, ctx: RenderContext): string {
  const t = T[draft.destino][draft.lang];
  const ogImage = ctx.ogImage ?? `${ctx.siteUrl}/og-default.png`;
  const esUrl = `${ctx.siteUrl}${ctx.esPath}`;
  const enUrl = `${ctx.siteUrl}${ctx.enPath}`;
  const canonical = draft.lang === "es" ? esUrl : enUrl;
  const themeClass = draft.destino === "control-room" ? "theme-control-room" : "theme-pimenton";
  const logo =
    draft.destino === "control-room"
      ? "/assets/logos/principal/logo-blanco.webp"
      : "/assets/logos/principal/logo-coral.webp";

  return `<!doctype html>
<html lang="${draft.lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>${esc(draft.title)}</title>
    <meta name="description" content="${esc(draft.metaDescription)}" />
    <meta name="keywords" content="${esc(draft.keywords.join(", "))}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="es" href="${esUrl}" />
    <link rel="alternate" hreflang="en" href="${enUrl}" />
    <link rel="alternate" hreflang="x-default" href="${esUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${esc(draft.title)}" />
    <meta property="og:description" content="${esc(draft.metaDescription)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(draft.title)}" />
    <meta name="twitter:description" content="${esc(draft.metaDescription)}" />
    <meta name="twitter:image" content="${ogImage}" />
    <meta name="theme-color" content="#E84B3C" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
${jsonLd(draft, ctx, canonical, ogImage)}
    <style>
      :root {
        --accent:#E84B3C; --ink:#0F0F0E; --muted:#6B6967; --line:#E8DCC7;
        --bg:#FAF1E3; --card:#FFFFFF; --measure:720px; --topbar:rgba(250,241,227,.88);
        --cta-bg:#0F0F0E; --logo-filter:none;
      }
      .theme-control-room {
        --ink:#FAF1E3; --muted:rgba(250,241,227,.68); --line:rgba(255,255,255,.12);
        --bg:#0F0F0E; --card:#1A1A18; --topbar:rgba(15,15,14,.92); --cta-bg:#1A1A18;
        --logo-filter:none;
      }
      * { box-sizing:border-box; }
      html { scroll-behavior:smooth; }
      body {
        margin:0;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        color:var(--ink); background:var(--bg); line-height:1.7;
        -webkit-font-smoothing:antialiased;
      }
      a { color:inherit; }
      .wrap { max-width:var(--measure); margin:0 auto; padding:0 24px; }
      .topbar { position:sticky; top:0; z-index:50; background:var(--topbar); backdrop-filter:saturate(150%) blur(10px); border-bottom:1px solid var(--line); }
      .topbar-inner { max-width:1120px; margin:0 auto; padding:14px 24px; display:flex; align-items:center; justify-content:space-between; gap:16px; }
      .brand img { height:28px; width:auto; display:block; filter:var(--logo-filter); }
      .topnav { display:flex; align-items:center; gap:22px; font-size:14px; font-weight:500; }
      .topnav a { text-decoration:none; color:var(--muted); transition:color .2s; }
      .topnav a:hover { color:var(--ink); }
      .lang { display:inline-flex; border:1px solid var(--line); border-radius:999px; overflow:hidden; }
      .lang a { padding:4px 10px; font-size:12px; font-weight:600; text-decoration:none; color:var(--muted); }
      .lang a.active { background:var(--ink); color:var(--bg); }
      @media (max-width:640px){ .topnav .hide-sm{ display:none; } }
      article { padding:56px 0 40px; }
      .eyebrow { display:inline-flex; align-items:center; gap:8px; font-size:12px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--accent); }
      .eyebrow::before { content:""; width:6px; height:6px; border-radius:50%; background:var(--accent); }
      h1 { font-weight:700; font-size:clamp(2.2rem,5.5vw,3.2rem); line-height:1.08; letter-spacing:-.02em; margin:18px 0 20px; }
      .lead-answer { font-size:1.18rem; line-height:1.6; color:var(--ink); border-left:3px solid var(--accent); padding:4px 0 4px 20px; margin:0 0 12px; font-weight:500; }
      .byline { color:var(--muted); font-size:14px; margin-bottom:28px; }
      article h2 { font-weight:700; font-size:clamp(1.45rem,3vw,1.85rem); line-height:1.2; margin:44px 0 12px; letter-spacing:-.015em; }
      article h3 { font-size:1.08rem; font-weight:700; margin:26px 0 6px; }
      article p { margin:0 0 18px; }
      article ul, article ol { margin:0 0 18px; padding-left:22px; }
      article li { margin:8px 0; }
      article strong { font-weight:700; }
      .callout { background:var(--card); border:1px solid var(--line); border-radius:14px; padding:22px 24px; margin:28px 0; }
      .callout p:last-child { margin-bottom:0; }
      .faq details { border-bottom:1px solid var(--line); padding:6px 0; }
      .faq summary { cursor:pointer; font-weight:600; padding:14px 0; list-style:none; display:flex; justify-content:space-between; align-items:center; gap:16px; }
      .faq summary::-webkit-details-marker { display:none; }
      .faq summary::after { content:"+"; color:var(--accent); font-size:1.4rem; line-height:1; }
      .faq details[open] summary::after { content:"–"; }
      .faq details p { margin:0 0 16px; color:var(--muted); }
      .cta { margin:48px 0 8px; background:var(--cta-bg); color:#FAF1E3; border-radius:18px; padding:34px 30px; text-align:center; border:1px solid var(--line); }
      .cta h2 { color:#FAF1E3; margin:0 0 10px; font-size:clamp(1.5rem,3vw,2rem); }
      .cta p { color:rgba(250,241,227,.75); margin:0 auto 22px; max-width:46ch; }
      .btn { display:inline-block; background:var(--accent); color:#fff; text-decoration:none; font-weight:600; padding:14px 26px; border-radius:999px; transition:transform .15s,opacity .2s; }
      .btn:hover { transform:translateY(-1px); opacity:.95; }
      footer { border-top:1px solid var(--line); margin-top:40px; padding:30px 0 50px; }
      .foot { max-width:1120px; margin:0 auto; padding:0 24px; display:flex; flex-wrap:wrap; gap:12px; justify-content:space-between; align-items:center; color:var(--muted); font-size:14px; }
      .foot a { color:var(--muted); text-decoration:none; }
      .foot a:hover { color:var(--ink); }
    </style>
  </head>
  <body class="${themeClass}">
    <header class="topbar">
      <div class="topbar-inner">
        <a class="brand" href="${t.homeHref}" aria-label="Pimentón">
          <img src="${logo}" alt="Pimentón" width="160" height="40" />
        </a>
        <nav class="topnav" aria-label="Principal">
          <a class="hide-sm" href="${t.homeHref}">${t.nav.home}</a>
          <a href="${t.blogHref}">${t.nav.blog}</a>
          <a class="hide-sm" href="${t.ctaHref}">${t.nav.schedule}</a>
          <span class="lang" role="group" aria-label="Idioma">
            <a class="${draft.lang === "es" ? "active" : ""}" href="${ctx.esPath}" hreflang="es">ES</a>
            <a class="${draft.lang === "en" ? "active" : ""}" href="${ctx.enPath}" hreflang="en">EN</a>
          </span>
        </nav>
      </div>
    </header>
    <main>
      <div class="wrap">
        <article>
          <p class="eyebrow">${esc(draft.eyebrow)}</p>
          <h1>${esc(draft.headline)}</h1>
          <p class="lead-answer">${draft.answerHtml}</p>
          <p class="byline">${esc(draft.byline)}</p>
${draft.bodyHtml}
          <h2 id="faq">${t.faqTitle}</h2>
          <div class="faq">
${faqAccordion(draft.faq)}
          </div>
          <div class="cta">
            <h2>${esc(t.ctaTitle)}</h2>
            <p>${esc(t.ctaText)}</p>
            <a class="btn" href="${t.ctaHref}" target="_blank" rel="noopener noreferrer">${esc(t.ctaLabel)}</a>
          </div>
        </article>
      </div>
    </main>
    <footer>
      <div class="foot">
        <p>© 2026 Pimentón</p>
        <p>${t.footerLinks}</p>
      </div>
    </footer>
  </body>
</html>
`;
}
