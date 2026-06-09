import type { MetadataRoute } from "next";

const SITE = "https://pimenton.io";

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
      priority: 0.9,
    },
    {
      url: `${SITE}/como-lo-hacemos`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE}/contacto`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE}/faq`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
