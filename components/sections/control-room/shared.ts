import { platforms, type Platform, type PlatformRing } from "@/data/platforms";

export const RING_RADII: Record<PlatformRing, number> = {
  inner: 0.2,
  middle: 0.35,
  outer: 0.5,
};

export const RING_ORDER: PlatformRing[] = ["inner", "middle", "outer"];

// % of ring-container width, kept in sync with the w-[18%] on CenterIsologo
// so packet/line start points hit its visual edge cleanly.
export const ISOLOGO_RADIUS_PCT = 9;

export type PositionedPlatform = Platform & {
  angleDeg: number;
  xPct: number;
  yPct: number;
  startXPct: number;
  startYPct: number;
  radiusPct: number;
};

export function buildPositions(): PositionedPlatform[] {
  const out: PositionedPlatform[] = [];
  for (const ring of RING_ORDER) {
    const list = platforms.filter((p) => p.ring === ring);
    const radius = RING_RADII[ring];
    list.forEach((p, i) => {
      const angleDeg = (360 / list.length) * i;
      const rad = (angleDeg - 90) * (Math.PI / 180);
      const cosA = Math.cos(rad);
      const sinA = Math.sin(rad);
      out.push({
        ...p,
        angleDeg,
        xPct: cosA * radius * 100,
        yPct: sinA * radius * 100,
        startXPct: cosA * ISOLOGO_RADIUS_PCT,
        startYPct: sinA * ISOLOGO_RADIUS_PCT,
        radiusPct: radius,
      });
    });
  }
  return out;
}

// Deterministic pseudo-random delays per index — phi-distributed for an
// organic, non-synchronized feel without breaking SSR hydration.
const PHI = 1.61803398875;
export function packetDelays(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    initial: ((i * PHI) % 1) * 4,
    repeat: 1.8 + ((i * 0.7) % 1) * 2.5,
  }));
}
