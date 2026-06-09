"use client";

import { motion, useReducedMotion } from "motion/react";
import { copy } from "@/data/copy";
import { CenterIsologo } from "./CenterIsologo";
import {
  buildPositions,
  packetDelays,
  RING_ORDER,
  RING_RADII,
  type PositionedPlatform,
} from "./shared";
import type { PlatformRing } from "@/data/platforms";

const ROTATION: Record<PlatformRing, { degrees: number; duration: number }> = {
  inner: { degrees: 360, duration: 90 },
  middle: { degrees: -360, duration: 140 },
  outer: { degrees: 360, duration: 200 },
};

function RingGroup({
  ring,
  ringPlatforms,
  reduced,
}: {
  ring: PlatformRing;
  ringPlatforms: PositionedPlatform[];
  reduced: boolean;
}) {
  const { degrees, duration } = ROTATION[ring];
  const delays = packetDelays(ringPlatforms.length);
  const rotateTransition = reduced
    ? undefined
    : { duration, repeat: Infinity, ease: "linear" as const };

  return (
    <motion.div
      className="absolute inset-0"
      animate={reduced ? undefined : { rotate: degrees }}
      transition={rotateTransition}
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {ringPlatforms.map((p) => (
          <line
            key={`line-${p.id}`}
            x1={50 + p.startXPct}
            y1={50 + p.startYPct}
            x2={50 + p.xPct}
            y2={50 + p.yPct}
            stroke="var(--color-pimenton-accent)"
            strokeOpacity="0.25"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {!reduced &&
          ringPlatforms.map((p, i) => (
            <motion.circle
              key={`packet-${p.id}`}
              r="0.8"
              fill="var(--color-pimenton-accent)"
              initial={{ cx: 50 + p.xPct, cy: 50 + p.yPct, opacity: 0 }}
              animate={{
                cx: [50 + p.xPct, 50 + p.startXPct],
                cy: [50 + p.yPct, 50 + p.startYPct],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.2,
                delay: delays[i].initial,
                repeat: Infinity,
                repeatDelay: delays[i].repeat,
                times: [0, 0.15, 0.85, 1],
                ease: "easeIn",
              }}
            />
          ))}
      </svg>

      {ringPlatforms.map((p) => (
        <motion.div
          key={p.id}
          className="absolute aspect-square w-[11.5%]"
          style={{
            left: `${50 + p.xPct}%`,
            top: `${50 + p.yPct}%`,
            x: "-50%",
            y: "-50%",
          }}
          animate={reduced ? undefined : { rotate: -degrees }}
          transition={rotateTransition}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full border border-pimenton-dark-border bg-pimenton-dark-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.logo}
              alt={p.name}
              className="max-h-[68%] max-w-[68%] object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function ControlRoomAutonomous() {
  const { eyebrow, heading } = copy.controlRoom;
  const positioned = buildPositions();
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="relative bg-pimenton-dark px-[5%] sm:px-16 lg:px-24 py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <p className="flex items-center text-pimenton-accent text-xs sm:text-sm uppercase tracking-[0.22em] font-medium">
          <span aria-hidden className="mr-3 inline-block h-px w-8 bg-pimenton-accent" />
          {eyebrow}
        </p>
        <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] tracking-tight text-pimenton-text-on-dark">
          {heading}
        </h2>

        <div className="relative mx-auto mt-12 aspect-square w-full max-w-[760px] sm:mt-20">
          {RING_ORDER.map((ring) => (
            <div
              key={ring}
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-pimenton-text-on-dark-muted/15"
              style={{
                width: `${RING_RADII[ring] * 200}%`,
                height: `${RING_RADII[ring] * 200}%`,
              }}
            />
          ))}

          <CenterIsologo
            className="absolute left-1/2 top-1/2 z-20 w-[18%] -translate-x-1/2 -translate-y-1/2"
            glowInset="-60%"
          />

          {RING_ORDER.map((ring) => (
            <RingGroup
              key={ring}
              ring={ring}
              ringPlatforms={positioned.filter((p) => p.ring === ring)}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
