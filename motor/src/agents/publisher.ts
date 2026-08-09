import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { log } from "../lib/logger.js";
import { env } from "../config/env.js";
import { renderArticle, type ArticleDraft } from "../render/template.js";
import { renderBlogIndex, renderBlogTeaserCards } from "../render/blogIndex.js";
import { renderSitemap } from "../render/sitemap.js";
import type { Destino, Idea, Language, WriterOutput } from "../types.js";
import type { PublishedPost } from "../lib/state.js";
import { writeDraft } from "./writer.js";

const here = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(here, "..", "..", "..");
/** Next sirve estáticos desde public/ — ahí viven blog/ y en/blog/. */
const PUBLIC_ROOT = join(REPO_ROOT, "public");

function words(html: string): number {
  return html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

function readingTime(w: WriterOutput): number {
  return Math.max(3, Math.round((words(w.body_html) + words(w.answer_html)) / 220));
}

function brandName(destino: Destino): string {
  return destino === "control-room" ? "Control Room" : "Pimentón";
}

function byline(destino: Destino, lang: Language, min: number, date: string): string {
  const brand = brandName(destino);
  return lang === "es"
    ? `Por ${brand} · ${date} · ${min} min de lectura`
    : `By ${brand} · ${date} · ${min} min read`;
}

function toArticle(destino: Destino, lang: Language, w: WriterOutput, date: string): ArticleDraft {
  return {
    destino,
    lang,
    slug: w.slug,
    title: w.title,
    headline: w.headline,
    metaDescription: w.meta_description,
    keywords: w.keywords,
    eyebrow: destino === "control-room" ? "Control Room · Ops" : "Delivery & Growth",
    answerHtml: w.answer_html,
    byline: byline(destino, lang, readingTime(w), date),
    bodyHtml: w.body_html,
    faq: w.faq,
    datePublished: date,
  };
}

export async function publishIdea(destino: Destino, idea: Idea): Promise<PublishedPost> {
  const date = new Date().toISOString().slice(0, 10);

  const [es, en] = await Promise.all([
    writeDraft(destino, idea, "es"),
    writeDraft(destino, idea, "en"),
  ]);

  const esPath = `/blog/${es.slug}`;
  const enPath = `/en/blog/${en.slug}`;
  const ctx = { siteUrl: env.SITE_URL, esPath, enPath };

  const esHtml = renderArticle(toArticle(destino, "es", es, date), ctx);
  const enHtml = renderArticle(toArticle(destino, "en", en, date), ctx);

  mkdirSync(join(PUBLIC_ROOT, "blog"), { recursive: true });
  mkdirSync(join(PUBLIC_ROOT, "en", "blog"), { recursive: true });
  writeFileSync(join(PUBLIC_ROOT, "blog", `${es.slug}.html`), esHtml, "utf8");
  writeFileSync(join(PUBLIC_ROOT, "en", "blog", `${en.slug}.html`), enHtml, "utf8");
  log.ok(`[${destino}] Publicado: ${esPath} + ${enPath}`);

  return {
    slug: es.slug,
    destino,
    keyword: idea.keyword_primary,
    date,
    title: es.title,
    description: es.meta_description,
    path: esPath,
    pathEn: enPath,
    titleEn: en.title,
    descriptionEn: en.meta_description,
  };
}

function patchTeaser(filePath: string, destino: Destino, cardsHtml: string): void {
  if (!existsSync(filePath)) {
    log.warn(`No existe ${filePath}; teaser ${destino} omitido.`);
    return;
  }
  const start = `<!-- BLOG_TEASER:${destino} -->`;
  const end = `<!-- /BLOG_TEASER:${destino} -->`;
  const raw = readFileSync(filePath, "utf8");
  const i = raw.indexOf(start);
  const j = raw.indexOf(end);
  if (i === -1 || j === -1 || j < i) {
    log.warn(`Marcadores ${destino} no encontrados en ${filePath}`);
    return;
  }
  const next = raw.slice(0, i + start.length) + "\n" + cardsHtml + "\n          " + raw.slice(j);
  writeFileSync(filePath, next, "utf8");
  log.ok(`Teaser ${destino} actualizado en ${filePath}`);
}

/** Regenera índice unificado ES/EN, sitemap-blog y teasers. */
export function rebuildIndex(posts: PublishedPost[]): void {
  mkdirSync(join(PUBLIC_ROOT, "blog"), { recursive: true });
  mkdirSync(join(PUBLIC_ROOT, "en", "blog"), { recursive: true });

  writeFileSync(
    join(PUBLIC_ROOT, "blog", "index.html"),
    renderBlogIndex(posts, env.SITE_URL, "all", "es"),
    "utf8",
  );
  writeFileSync(
    join(PUBLIC_ROOT, "en", "blog", "index.html"),
    renderBlogIndex(posts, env.SITE_URL, "all", "en"),
    "utf8",
  );
  // Alias legacy: /blog/control-room → mismo hub unificado
  writeFileSync(
    join(PUBLIC_ROOT, "blog", "control-room.html"),
    renderBlogIndex(posts, env.SITE_URL, "all", "es"),
    "utf8",
  );
  writeFileSync(
    join(PUBLIC_ROOT, "en", "blog", "control-room.html"),
    renderBlogIndex(posts, env.SITE_URL, "all", "en"),
    "utf8",
  );
  writeFileSync(join(PUBLIC_ROOT, "sitemap-blog.xml"), renderSitemap(posts, env.SITE_URL), "utf8");

  const teasersDir = join(REPO_ROOT, "data", "blog-teasers");
  mkdirSync(teasersDir, { recursive: true });
  patchTeaser(
    join(teasersDir, "home.html"),
    "pimenton",
    renderBlogTeaserCards(posts, "all", "es", 3),
  );
  patchTeaser(
    join(teasersDir, "control-room.html"),
    "control-room",
    renderBlogTeaserCards(posts, "all", "es", 3),
  );

  log.ok("Índice unificado + teasers + sitemap-blog regenerados.");
}
