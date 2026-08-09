import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const v = process.env[name];
  if (!v || !v.trim()) {
    throw new Error(`Falta la variable ${name} (ponla en .env local o como GitHub Secret).`);
  }
  return v;
}

function int(name: string, fallback: number): number {
  const n = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(n) ? n : fallback;
}

export const env = {
  ANTHROPIC_API_KEY: required("ANTHROPIC_API_KEY"),
  MODEL: process.env.MODEL ?? "claude-opus-4-8",
  MAX_POSTS_PER_RUN: int("MAX_POSTS_PER_RUN", 1),
  SITE_URL: (process.env.SITE_URL ?? "https://pimenton.io").replace(/\/$/, ""),
  SEED_PIMENTON: process.env.SEED_PIMENTON ?? "",
  SEED_CONTROL_ROOM: process.env.SEED_CONTROL_ROOM ?? "",
  /** Si está set (pimenton | control-room), solo corre ese carril. */
  LANE: (process.env.LANE ?? "").trim(),
} as const;
