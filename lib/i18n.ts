export const LOCALES = ["es", "en", "it"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

/** Header que el middleware inyecta en el rewrite para que el server conozca el idioma. */
export const LOCALE_HEADER = "x-pimenton-locale";

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

/** Misma ruta, otro idioma (para el selector ES/EN/IT). */
export function switchLocalePath(pathname: string, locale: Locale): string {
  return withLocale(stripLocaleFromPathname(pathname), locale);
}

export function isHomePath(pathname: string): boolean {
  return stripLocaleFromPathname(pathname) === "/";
}

/** Copy de title/description/OG por idioma (preview WhatsApp / SEO). */
export const siteMeta = {
  es: {
    title: "Pimentón — Escalamos tu Delivery y Canales Digitales",
    description:
      "Growth Partner especializado en delivery para restaurantes. Operamos tus canales digitales en LATAM y Europa. +500 restaurantes confían en nosotros.",
    ogTitle: "Pimentón — Growth Partner para tu Delivery",
    ogDescription: "Potenciamos tu delivery y canales digitales.",
    ogImage: "/og-default.png?v=3",
    ogLocale: "es_AR",
  },
  en: {
    title: "Pimentón — We Scale Your Delivery & Digital Channels",
    description:
      "Growth Partner specialized in restaurant delivery. We operate your digital channels across LATAM and Europe. +500 restaurants trust us.",
    ogTitle: "Pimentón — Growth Partner for your Delivery",
    ogDescription: "We grow your delivery and digital channels.",
    ogImage: "/og-en.png?v=3",
    ogLocale: "en_US",
  },
  it: {
    title: "Pimentón — Facciamo crescere il tuo Delivery e i Canali Digitali",
    description:
      "Growth Partner specializzato nel delivery per ristoranti. Gestiamo i tuoi canali digitali in LATAM ed Europa. Oltre 500 ristoranti si fidano di noi.",
    ogTitle: "Pimentón — Growth Partner per il tuo Delivery",
    ogDescription: "Facciamo crescere il tuo delivery e i tuoi canali digitali.",
    ogImage: "/og-it.png?v=3",
    ogLocale: "it_IT",
  },
} as const;

export const OG_LOCALES: Record<Locale, string> = {
  es: "es_AR",
  en: "en_US",
  it: "it_IT",
};

/** Ruta del blog estático por idioma (`/blog`, `/en/blog`, `/it/blog`). */
export function blogPath(locale: Locale, slug?: string): string {
  const base = locale === "es" ? "/blog" : `/${locale}/blog`;
  return slug ? `${base}/${slug}` : base;
}
