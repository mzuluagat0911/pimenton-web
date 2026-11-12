import type { MetadataRoute } from "next";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { casos } from "@/data/casos";
import { insights } from "@/data/insights";
import { blogPath, LOCALES, withLocale } from "@/lib/i18n";

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

interface BlogPost {
  path: string;
  pathEn?: string;
  pathIt?: string;
  date: string;
}

function loadBlogPosts(): BlogPost[] {
  const statePath = join(process.cwd(), "motor", "data", "state.json");
  if (!existsSync(statePath)) return [];
  try {
    const raw = JSON.parse(readFileSync(statePath, "utf8")) as {
      published?: BlogPost[];
    };
    return raw.published ?? [];
  } catch {
    return [];
  }
}

// Solo rutas públicas existentes. /lab/* queda fuera.
// Blog motor: hubs + posts desde motor/data/state.json (fuera de /es|/en|/it).
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

  for (const locale of LOCALES) {
    entries.push(
      {
        url: `${SITE}${blogPath(locale)}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${SITE}${blogPath(locale, "control-room")}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
      },
    );
  }

  for (const post of loadBlogPosts()) {
    for (const path of [post.path, post.pathEn, post.pathIt]) {
      if (!path) continue;
      entries.push({
        url: `${SITE}${path}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.65,
      });
    }
  }

  return entries;
}
