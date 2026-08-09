process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "sk-rebuild-only";
process.env.SITE_URL = process.env.SITE_URL || "https://pimenton.io";

const { loadState } = await import("../src/lib/state.js");
const { rebuildIndex } = await import("../src/agents/publisher.js");

rebuildIndex(loadState().published);
