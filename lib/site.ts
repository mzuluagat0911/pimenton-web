/**
 * Host canónico del sitio: https://www.pimenton.io
 *
 * Vercel responde 308 desde el apex (https://pimenton.io) hacia www.
 * Canonical, Open Graph, JSON-LD, sitemap y robots tienen que usar el host
 * que responde 200. Si NEXT_PUBLIC_SITE_URL sigue en el apex, la normalizamos
 * a www para que un deploy no vuelva a publicar señales hacia una redirección.
 *
 * Otros hosts (previews de Vercel, por ejemplo) se respetan.
 * La barra final se quita para que `${SITE_URL}/ruta` no genere dobles barras.
 */
function canonicalSiteUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, "");
  try {
    const url = new URL(trimmed);
    if (url.hostname === "pimenton.io") url.hostname = "www.pimenton.io";
    return url.origin;
  } catch {
    return "https://www.pimenton.io";
  }
}

export const SITE_URL = canonicalSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pimenton.io",
);

/** Convierte un path relativo (o absoluto) en URL absoluta basada en SITE_URL. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
