import type { MetadataRoute } from "next";
import { casos } from "@/data/casos";
import { insights } from "@/data/insights";

import { SITE_URL as SITE } from "@/lib/site";

// Solo rutas públicas existentes. /lab/* queda fuera (no es contenido
// público).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: `${SITE}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE}/servicios`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE}/como-lo-hacemos`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE}/contacto`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE}/faq`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE}/equipo`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE}/casos`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Una entrada por caso (desde el data layer — se suman solas).
    ...casos.map((c) => ({
      url: `${SITE}/casos/${c.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE}/insights`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Una entrada por artículo (desde el data layer).
    ...insights.map((a) => ({
      url: `${SITE}/insights/${a.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
