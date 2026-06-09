import type { MetadataRoute } from "next";

const SITE = "https://pimenton.io";

// Solo rutas públicas existentes. /contacto todavía no existe (se agrega
// cuando se cree esa página). /lab/* queda fuera (no es contenido público).
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
  ];
}
