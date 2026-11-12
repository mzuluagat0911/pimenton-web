import type { PublishedPost } from "../lib/state.js";

const STATIC_PATHS = [
  "/es",
  "/blog",
  "/en/blog",
  "/it/blog",
  "/blog/control-room",
  "/en/blog/control-room",
  "/it/blog/control-room",
];

/** Genera sitemap-blog.xml con hubs del blog + posts ES/EN/IT. */
export function renderSitemap(posts: PublishedPost[], siteUrl: string): string {
  const urls = new Set<string>(STATIC_PATHS.map((p) => `${siteUrl}${p}`));

  for (const post of posts) {
    urls.add(`${siteUrl}${post.path}`);
    if (post.pathEn) urls.add(`${siteUrl}${post.pathEn}`);
    if (post.pathIt) urls.add(`${siteUrl}${post.pathIt}`);
  }

  const today = new Date().toISOString().slice(0, 10);
  const body = [...urls]
    .sort()
    .map(
      (loc) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}
