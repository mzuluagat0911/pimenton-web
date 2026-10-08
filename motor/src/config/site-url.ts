/** Misma regla que lib/site.ts: el apex redirige a www, así que el host canónico es www. */
export function canonicalSiteUrl(raw: string | undefined): string {
  const fallback = "https://www.pimenton.io";
  const trimmed = (raw ?? fallback).trim().replace(/\/+$/, "");
  try {
    const url = new URL(trimmed);
    if (url.hostname === "pimenton.io") url.hostname = "www.pimenton.io";
    return url.origin;
  } catch {
    return fallback;
  }
}
