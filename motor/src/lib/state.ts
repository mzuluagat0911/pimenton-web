import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(here, "..", "..", "data");
const STATE_FILE = join(DATA_DIR, "state.json");

export type Destino = "pimenton" | "control-room";

export interface PublishedPost {
  slug: string;
  destino: Destino;
  keyword: string;
  date: string;
  title: string;
  description: string;
  path: string; // /blog/<slug>
  pathEn?: string;
  titleEn?: string;
  descriptionEn?: string;
}

interface State {
  covered: Record<Destino, string[]>;
  published: PublishedPost[];
}

const EMPTY: State = {
  covered: { pimenton: [], "control-room": [] },
  published: [],
};

export function loadState(): State {
  if (!existsSync(STATE_FILE)) return structuredClone(EMPTY);
  try {
    const raw = JSON.parse(readFileSync(STATE_FILE, "utf8")) as Partial<State>;
    return {
      covered: {
        pimenton: raw.covered?.pimenton ?? [],
        "control-room": raw.covered?.["control-room"] ?? [],
      },
      published: raw.published ?? [],
    };
  } catch {
    return structuredClone(EMPTY);
  }
}

export function saveState(state: State): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n", "utf8");
}

export function coveredKeywords(state: State, destino: Destino): string[] {
  return state.covered[destino];
}

export function markPublished(state: State, post: PublishedPost): void {
  if (!state.covered[post.destino].includes(post.keyword)) {
    state.covered[post.destino].push(post.keyword);
  }
  state.published.push(post);
}
