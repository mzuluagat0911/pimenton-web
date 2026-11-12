import type { Metadata } from "next";
import { headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_HEADER,
  LOCALES,
  OG_LOCALES,
  withLocale,
  type Locale,
} from "@/lib/i18n";
import { absoluteUrl } from "@/lib/site";

export type Localized = Record<Locale, string>;

/** `{ es, en, it, x-default }` para `alternates.languages`. */
export function languageAlternates(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of LOCALES) out[l] = withLocale(path, l);
  out["x-default"] = withLocale(path, DEFAULT_LOCALE);
  return out;
}

export const OG_IMAGES: Record<Locale, string> = {
  es: "/og-default.png",
  en: "/og-en.png",
  it: "/og-it.png",
};

export async function getRequestLocale(): Promise<Locale> {
  const h = await headers();
  const raw = h.get(LOCALE_HEADER);
  if (isLocale(raw ?? "")) return raw as Locale;
  return DEFAULT_LOCALE;
}

const ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

/** URL absoluta del host canónico, con prefijo de idioma. */
export function localeUrl(path: string, locale: Locale): string {
  return absoluteUrl(withLocale(path, locale));
}

export function breadcrumbList(
  locale: Locale,
  crumbs: { name: Localized; path: string }[],
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name[locale],
      item: localeUrl(crumb.path, locale),
    })),
  };
}

export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Metadata por idioma. El canonical es la URL de ese idioma
 * (`/es/servicios`, `/en/servicios`), con hreflang recíproco.
 * El merge de Next es shallow: hay que declarar OG y Twitter completos.
 */
export async function pageMetadata(opts: {
  path: string;
  title: Localized;
  description: Localized;
  ogDescription?: Localized;
  twitterDescription?: Localized;
  keywords?: Record<Locale, string[]>;
  ogAlt?: Localized;
  image?: { url: string; width: number; height: number; alt: Localized };
  ogType?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
}): Promise<Metadata> {
  const lang = await getRequestLocale();
  const title = opts.title[lang];
  const description = opts.description[lang];
  const ogDescription = (opts.ogDescription ?? opts.description)[lang];
  const twitterDescription = (opts.twitterDescription ?? opts.description)[lang];
  const canonical = withLocale(opts.path, lang);
  const image = opts.image ?? {
    url: OG_IMAGES[lang],
    width: 1200,
    height: 630,
    alt: opts.ogAlt ?? { es: "Pimentón", en: "Pimentón", it: "Pimentón" },
  };

  return {
    title,
    description,
    keywords: opts.keywords?.[lang],
    alternates: {
      canonical,
      languages: languageAlternates(opts.path),
    },
    robots: ROBOTS,
    openGraph: {
      type: opts.ogType ?? "website",
      siteName: "Pimentón",
      locale: OG_LOCALES[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALES[l]),
      url: absoluteUrl(canonical),
      title,
      description: ogDescription,
      publishedTime: opts.publishedTime,
      authors: opts.authors,
      images: [
        {
          url: image.url,
          width: image.width,
          height: image.height,
          alt: image.alt[lang],
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: twitterDescription,
      images: [image.url],
    },
  };
}
