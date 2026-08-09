import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Evita que Next tome motor/package-lock.json (u otro lockfile padre) como root.
  turbopack: { root },
  outputFileTracingRoot: root,

  // Blog SEO/GEO: HTML estático generado por /motor en public/blog.
  async rewrites() {
    return [
      { source: "/blog", destination: "/blog/index.html" },
      { source: "/blog/:slug", destination: "/blog/:slug.html" },
      { source: "/en/blog", destination: "/en/blog/index.html" },
      { source: "/en/blog/:slug", destination: "/en/blog/:slug.html" },
    ];
  },
};

export default nextConfig;
