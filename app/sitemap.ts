import type { MetadataRoute } from "next";
import { casos } from "@/data/casos";
import { insights } from "@/data/insights";
import { LOCALES, withLocale } from "@/lib/i18n";

import { SITE_URL as SITE } from "@/lib/site";

const STATIC_PATHS = [
  "/",
  "/servicios",
  "/como-lo-hacemos",
  "/contacto",
  "/faq",
  "/equipo",
  "/casos",
  "/insights",
] as const;

// Solo rutas públicas existentes. /lab/* queda fuera (no es contenido
// público). Cada ruta se publica en /es y /en.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE}${withLocale(path, locale)}`,
        lastModified,
        changeFrequency: path === "/insights" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : path === "/contacto" || path === "/faq" ? 0.6 : 0.8,
      });
    }

    for (const c of casos) {
      entries.push({
        url: `${SITE}${withLocale(`/casos/${c.slug}`, locale)}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    for (const a of insights) {
      entries.push({
        url: `${SITE}${withLocale(`/insights/${a.slug}`, locale)}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
