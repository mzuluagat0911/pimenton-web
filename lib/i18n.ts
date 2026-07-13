export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Idioma del primer segmento de la URL (`/es/...`, `/en/...`). */
export function getLocaleFromPathname(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : DEFAULT_LOCALE;
}

/** Quita el prefijo de idioma y devuelve la ruta interna (`/servicios`, `/`). */
export function stripLocaleFromPathname(pathname: string): string {
  const segment = pathname.split("/")[1];
  if (!isLocale(segment)) return pathname || "/";
  const rest = pathname.slice(segment.length + 1);
  return rest === "" ? "/" : rest.startsWith("/") ? rest : `/${rest}`;
}

/** Agrega el prefijo de idioma a rutas internas. Deja externos y anclas locales intactos. */
export function withLocale(path: string, locale: Locale): string {
  if (
    path.startsWith("http") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:")
  ) {
    return path;
  }
  if (path.startsWith("#")) return path;
  if (path === "/") return `/${locale}`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

/** Misma ruta, otro idioma (para el toggle ES/EN). */
export function switchLocalePath(pathname: string, locale: Locale): string {
  return withLocale(stripLocaleFromPathname(pathname), locale);
}

export function isHomePath(pathname: string): boolean {
  return stripLocaleFromPathname(pathname) === "/";
}
