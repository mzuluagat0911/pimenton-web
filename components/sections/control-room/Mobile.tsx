"use client";

import { copy } from "@/data/copy";
import { platforms, type PlatformRing } from "@/data/platforms";
import { CenterIsologo } from "./CenterIsologo";

const TIER_LABELS: Record<PlatformRing, string> = {
  inner: "Food Apps",
  middle: "Operación",
  outer: "Tecnología & IA",
};

const TIER_GRID: Record<PlatformRing, string> = {
  inner: "grid-cols-3",
  middle: "grid-cols-2 max-w-[220px] mx-auto",
  outer: "grid-cols-2 max-w-[220px] mx-auto",
};

const TIER_ORDER: PlatformRing[] = ["inner", "middle", "outer"];

export function ControlRoomMobile() {
  const { eyebrow, heading } = copy.controlRoom;

  return (
    <section className="relative bg-pimenton-dark px-[5%] py-20 sm:px-12">
      <div className="mx-auto w-full max-w-2xl">
        <p className="flex items-center text-pimenton-accent text-xs uppercase tracking-[0.22em] font-medium">
          <span aria-hidden className="mr-3 inline-block h-px w-8 bg-pimenton-accent" />
          {eyebrow}
        </p>
        <h2 className="mt-6 text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text-on-dark">
          {heading}
        </h2>

        <div className="mt-14 flex flex-col items-center gap-12">
          <CenterIsologo className="w-32" glowInset="-55%" />

          <div className="flex w-full flex-col gap-10">
            {TIER_ORDER.map((ring) => {
              const items = platforms.filter((p) => p.ring === ring);
              return (
                <div key={ring}>
                  <p className="text-center font-mono text-[10px] uppercase tracking-[0.22em] text-pimenton-text-on-dark-muted">
                    {TIER_LABELS[ring]}
                  </p>
                  <div
                    className={`mt-4 grid justify-items-center gap-3 ${TIER_GRID[ring]}`}
                  >
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex aspect-square w-full max-w-[80px] items-center justify-center rounded-full border border-pimenton-dark-border bg-pimenton-dark-surface"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.logo}
                          alt={item.name}
                          className="max-h-[58%] max-w-[58%] object-contain"
                          style={{ filter: "brightness(0) invert(1)" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
