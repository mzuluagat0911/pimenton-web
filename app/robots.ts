import type { MetadataRoute } from "next";

const SITE = "https://pimenton.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /lab/* son demos internas, no contenido público.
      disallow: "/lab/",
    },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
