import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { log } from "../lib/logger.js";
import { env } from "../config/env.js";
import { renderArticle, type ArticleDraft, type RenderContext } from "../render/template.js";
import { linkCoverPair } from "../render/visuals.js";
import { renderBlogIndex, renderBlogTeaserCards } from "../render/blogIndex.js";
import { renderSitemap } from "../render/sitemap.js";
import type { Destino, Idea, Language, WriterOutput } from "../types.js";
import type { PublishedPost } from "../lib/state.js";
import { writeDraft } from "./writer.js";

const here = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(here, "..", "..", "..");
/** Next sirve estáticos desde public/ — ahí viven blog/, en/blog/ e it/blog/. */
const PUBLIC_ROOT = join(REPO_ROOT, "public");

/** Carpeta pública del blog por idioma (ES sin prefijo: /blog). */
const BLOG_DIR: Record<Language, string[]> = {
  es: ["blog"],
  en: ["en", "blog"],
  it: ["it", "blog"],
};

export function blogPathFor(lang: Language, slug: string): string {
  return `/${[...BLOG_DIR[lang], slug].join("/")}`;
}

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
  if (lang === "es") return `Por ${brand} · ${date} · ${min} min de lectura`;
  if (lang === "it") return `Di ${brand} · ${date} · ${min} min di lettura`;
  return `By ${brand} · ${date} · ${min} min read`;
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

function writeArticle(lang: Language, slug: string, html: string): void {
  const dir = join(PUBLIC_ROOT, ...BLOG_DIR[lang]);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${slug}.html`), html, "utf8");
}

/** Publica los borradores ES/EN (+IT si existe) ya redactados. */
export function publishDrafts(
  destino: Destino,
  idea: Idea,
  es: WriterOutput,
  en: WriterOutput,
  date = new Date().toISOString().slice(0, 10),
  it?: WriterOutput,
): PublishedPost {
  const ctx: RenderContext = {
    siteUrl: env.SITE_URL,
    esPath: blogPathFor("es", es.slug),
    enPath: blogPathFor("en", en.slug),
    itPath: it ? blogPathFor("it", it.slug) : undefined,
  };
  linkCoverPair(es.slug, en.slug);
  if (it) linkCoverPair(es.slug, it.slug);

  writeArticle("es", es.slug, renderArticle(toArticle(destino, "es", es, date), ctx));
  writeArticle("en", en.slug, renderArticle(toArticle(destino, "en", en, date), ctx));
  if (it) writeArticle("it", it.slug, renderArticle(toArticle(destino, "it", it, date), ctx));
  log.ok(
    `[${destino}] Publicado: ${[ctx.esPath, ctx.enPath, ctx.itPath].filter(Boolean).join(" + ")}`,
  );

  return {
    slug: es.slug,
    destino,
    keyword: idea.keyword_primary,
    date,
    title: es.title,
    description: es.meta_description,
    path: ctx.esPath,
    pathEn: ctx.enPath,
    titleEn: en.title,
    descriptionEn: en.meta_description,
    ...(it && {
      pathIt: ctx.itPath,
      titleIt: it.title,
      descriptionIt: it.meta_description,
    }),
  };
}

export async function publishIdea(destino: Destino, idea: Idea): Promise<PublishedPost> {
  const date = new Date().toISOString().slice(0, 10);
  const [es, en, it] = await Promise.all([
    writeDraft(destino, idea, "es"),
    writeDraft(destino, idea, "en"),
    writeDraft(destino, idea, "it"),
  ]);
  return publishDrafts(destino, idea, es, en, date, it);
}

function patchTeaser(filePath: string, destino: Destino, cardsHtml: string): void {
  const start = `<!-- BLOG_TEASER:${destino} -->`;
  const end = `<!-- /BLOG_TEASER:${destino} -->`;
  if (!existsSync(filePath)) {
    writeFileSync(filePath, `${start}\n${cardsHtml}\n${end}\n`, "utf8");
    log.ok(`Teaser ${destino} creado en ${filePath}`);
    return;
  }
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

/** Archivo de teasers por idioma: `home.html` (ES), `home.en.html`, `home.it.html`. */
function teaserFile(base: string, lang: Language): string {
  return lang === "es" ? `${base}.html` : `${base}.${lang}.html`;
}

/** Regenera índices ES/EN/IT, sitemap-blog y teasers. */
export function rebuildIndex(posts: PublishedPost[]): void {
  const teasersDir = join(REPO_ROOT, "data", "blog-teasers");
  mkdirSync(teasersDir, { recursive: true });

  for (const lang of ["es", "en", "it"] as const) {
    const dir = join(PUBLIC_ROOT, ...BLOG_DIR[lang]);
    mkdirSync(dir, { recursive: true });
    const hub = renderBlogIndex(posts, env.SITE_URL, "all", lang);
    writeFileSync(join(dir, "index.html"), hub, "utf8");
    // Alias legacy: /blog/control-room → mismo hub unificado
    writeFileSync(join(dir, "control-room.html"), hub, "utf8");

    const cards = renderBlogTeaserCards(posts, "all", lang, 3);
    patchTeaser(join(teasersDir, teaserFile("home", lang)), "pimenton", cards);
    patchTeaser(join(teasersDir, teaserFile("control-room", lang)), "control-room", cards);
  }

  writeFileSync(join(PUBLIC_ROOT, "sitemap-blog.xml"), renderSitemap(posts, env.SITE_URL), "utf8");
  log.ok("Índices ES/EN/IT + teasers + sitemap-blog regenerados.");
}
