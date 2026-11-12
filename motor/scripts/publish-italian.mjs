// Publica la versión italiana de los posts ya existentes a partir de las
// traducciones en data/i18n/it/<slug-es>.json, enlaza hreflang/selector IT en
// los HTML ES/EN y regenera índices, teasers y sitemap-blog.
process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "sk-rebuild-only";
process.env.SITE_URL = process.env.SITE_URL || "https://www.pimenton.io";

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadState, saveState } = await import("../src/lib/state.js");
const { rebuildIndex, blogPathFor } = await import("../src/agents/publisher.js");
const { renderArticle } = await import("../src/render/template.js");
const { linkCoverPair } = await import("../src/render/visuals.js");
const { env } = await import("../src/config/env.js");

const here = dirname(fileURLToPath(import.meta.url));
const MOTOR = join(here, "..");
const PUBLIC_ROOT = join(MOTOR, "..", "public");
const I18N_IT = join(MOTOR, "data", "i18n", "it");

function addItalianLinks(file, itPath) {
  if (!existsSync(file)) {
    console.warn(`  ! falta ${file}`);
    return;
  }
  let html = readFileSync(file, "utf8");
  const itUrl = `${env.SITE_URL}${itPath}`;
  html = html.replace(/\n\s*<link rel="alternate" hreflang="it" href="[^"]*" \/>/, "");
  html = html.replace(
    /(\n(\s*)<link rel="alternate" hreflang="en" href="[^"]*" \/>)/,
    `$1\n$2<link rel="alternate" hreflang="it" href="${itUrl}" />`,
  );
  html = html.replace(/\n\s*<a class="[^"]*" href="[^"]*" hreflang="it">IT<\/a>/, "");
  html = html.replace(
    /(\n(\s*)<a class="[^"]*" href="[^"]*" hreflang="en">EN<\/a>)/,
    `$1\n$2<a class="" href="${itPath}" hreflang="it">IT</a>`,
  );
  writeFileSync(file, html, "utf8");
}

const state = loadState();
let published = 0;
mkdirSync(join(PUBLIC_ROOT, "it", "blog"), { recursive: true });

for (const post of state.published) {
  const src = join(I18N_IT, `${post.slug}.json`);
  if (!existsSync(src)) {
    console.warn(`  ! sin traducción IT para ${post.slug}`);
    continue;
  }
  const it = JSON.parse(readFileSync(src, "utf8"));
  const itPath = blogPathFor("it", it.slug);
  const ctx = {
    siteUrl: env.SITE_URL,
    esPath: post.path,
    enPath: post.pathEn ?? post.path,
    itPath,
  };

  linkCoverPair(post.slug, it.slug);
  const html = renderArticle(
    {
      destino: post.destino,
      lang: "it",
      slug: it.slug,
      title: it.title,
      headline: it.headline,
      metaDescription: it.meta_description,
      keywords: it.keywords,
      eyebrow: it.eyebrow,
      answerHtml: it.answer_html,
      byline: it.byline,
      bodyHtml: it.body_html,
      faq: it.faq,
      datePublished: post.date,
    },
    ctx,
  );
  writeFileSync(join(PUBLIC_ROOT, "it", "blog", `${it.slug}.html`), html, "utf8");

  addItalianLinks(join(PUBLIC_ROOT, `${post.path.slice(1)}.html`), itPath);
  if (post.pathEn) addItalianLinks(join(PUBLIC_ROOT, `${post.pathEn.slice(1)}.html`), itPath);

  post.pathIt = itPath;
  post.titleIt = it.title;
  post.descriptionIt = it.meta_description;
  published += 1;
  console.log(`  ✓ ${post.path} → ${itPath}`);
}

saveState(state);
rebuildIndex(state.published);
console.log(`Listo: ${published}/${state.published.length} posts en italiano.`);
