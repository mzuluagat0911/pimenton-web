import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { blogPath, type Locale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/seo";

type Destino = "pimenton" | "control-room";

const TEASER_BASE: Record<Destino, string> = {
  pimenton: "home",
  "control-room": "control-room",
};

const MORE: Record<Locale, string> = {
  es: "Ver todos los artículos →",
  en: "See all articles →",
  it: "Vedi tutti gli articoli →",
};

function extractTeaserHtml(raw: string, destino: Destino): string {
  const start = `<!-- BLOG_TEASER:${destino} -->`;
  const end = `<!-- /BLOG_TEASER:${destino} -->`;
  const i = raw.indexOf(start);
  const j = raw.indexOf(end);
  if (i === -1 || j === -1 || j < i) return raw.trim();
  return raw.slice(i + start.length, j).trim();
}

function teaserPath(destino: Destino, lang: Locale): string {
  const base = TEASER_BASE[destino];
  const dir = join(process.cwd(), "data", "blog-teasers");
  const localized = join(dir, lang === "es" ? `${base}.html` : `${base}.${lang}.html`);
  return existsSync(localized) ? localized : join(dir, `${base}.html`);
}

/**
 * Lee el fragmento HTML que el motor inyecta entre marcadores BLOG_TEASER
 * (mismo patrón que Picante en index.html / pulse.html), en el idioma de la URL.
 */
export async function BlogTeasers({
  destino = "pimenton",
  className = "",
}: {
  destino?: Destino;
  className?: string;
}) {
  const lang = await getRequestLocale();
  const path = teaserPath(destino, lang);
  let inner = "";
  if (existsSync(path)) {
    inner = extractTeaserHtml(readFileSync(path, "utf8"), destino);
  }

  const hub = blogPath(lang, destino === "control-room" ? "control-room" : undefined);

  return (
    <section
      className={`blog-teasers blog-teasers--${destino} ${className}`.trim()}
      aria-label={destino === "control-room" ? "Blog Control Room" : "Blog Pimentón"}
    >
      <div
        className="blog-teasers-grid"
        dangerouslySetInnerHTML={{ __html: inner }}
      />
      <p className="blog-teasers-more">
        <a href={hub}>{MORE[lang]}</a>
      </p>
    </section>
  );
}
