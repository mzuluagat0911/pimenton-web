/**
 * URL base del sitio para todo el SEO: canonicals, Open Graph, JSON-LD,
 * sitemap y robots. Se construye a partir de la variable de entorno
 * NEXT_PUBLIC_SITE_URL.
 *
 * Hoy la web corre en pimenton-web.vercel.app, pero el destino final de
 * producción es https://pimenton.io — que es el valor por defecto (fallback)
 * de abajo. Por eso TODOS los metadatos absolutos ya apuntan a pimenton.io y
 * no hay que rehacer nada al conectar el dominio.
 *
 * AL CONECTAR EL DOMINIO (semana próxima): el único paso es confirmar que la
 * variable NEXT_PUBLIC_SITE_URL esté definida como `https://pimenton.io` en
 * las Environment Variables de Vercel (Production). Nada más que tocar en el
 * código — ni un solo dominio está hardcodeado fuera de este archivo.
 *
 * La barra final se normaliza (se quita) para que `${SITE_URL}/ruta` no
 * genere dobles barras.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pimenton.io"
).replace(/\/+$/, "");

/** Convierte un path relativo (o absoluto) en URL absoluta basada en SITE_URL. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
