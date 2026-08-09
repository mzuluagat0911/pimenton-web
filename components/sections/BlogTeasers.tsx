import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

type Destino = "pimenton" | "control-room";

const TEASER_FILES: Record<Destino, string> = {
  pimenton: "home.html",
  "control-room": "control-room.html",
};

function extractTeaserHtml(raw: string, destino: Destino): string {
  const start = `<!-- BLOG_TEASER:${destino} -->`;
  const end = `<!-- /BLOG_TEASER:${destino} -->`;
  const i = raw.indexOf(start);
  const j = raw.indexOf(end);
  if (i === -1 || j === -1 || j < i) return raw.trim();
  return raw.slice(i + start.length, j).trim();
}

/**
 * Lee el fragmento HTML que el motor inyecta entre marcadores BLOG_TEASER
 * (mismo patrón que Picante en index.html / pulse.html).
 */
export function BlogTeasers({
  destino = "pimenton",
  className = "",
}: {
  destino?: Destino;
  className?: string;
}) {
  const file = TEASER_FILES[destino];
  const path = join(process.cwd(), "data", "blog-teasers", file);
  let inner = "";
  if (existsSync(path)) {
    inner = extractTeaserHtml(readFileSync(path, "utf8"), destino);
  }

  const hub = destino === "control-room" ? "/blog/control-room" : "/blog";

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
        <a href={hub}>Ver todos los artículos →</a>
      </p>
    </section>
  );
}
