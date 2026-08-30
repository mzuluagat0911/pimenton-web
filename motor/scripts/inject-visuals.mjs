process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "sk-rebuild-only";
process.env.SITE_URL = process.env.SITE_URL || "https://pimenton.io";

const { readdirSync, readFileSync, writeFileSync } = await import("node:fs");
const { dirname, join } = await import("node:path");
const { fileURLToPath } = await import("node:url");
const { injectArticleVisuals } = await import("../src/render/visuals.js");
const { loadState } = await import("../src/lib/state.js");
const { rebuildIndex } = await import("../src/agents/publisher.js");

const here = dirname(fileURLToPath(import.meta.url));
const REPO = join(here, "..", "..");
const SKIP = new Set(["index.html", "control-room.html"]);

function injectDir(rel, lang) {
  const dir = join(REPO, rel);
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".html") || SKIP.has(file)) continue;
    const slug = file.replace(/\.html$/, "");
    const path = join(dir, file);
    const html = readFileSync(path, "utf8");
    writeFileSync(path, injectArticleVisuals(html, slug, lang), "utf8");
    console.log("visuals →", `${rel}/${file}`);
  }
}

injectDir("public/blog", "es");
injectDir("public/en/blog", "en");
rebuildIndex(loadState().published);
