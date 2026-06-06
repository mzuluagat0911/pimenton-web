"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
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

const SCROLL_ROTATION: Record<PlatformRing, number> = {
  inner: 360,
  middle: -270,
  outer: 180,
};

function ScrollRingGroup({
  ring,
  ringPlatforms,
  ringRotate,
  logoRotate,
  reduced,
}: {
  ring: PlatformRing;
  ringPlatforms: PositionedPlatform[];
  ringRotate: ReturnType<typeof useTransform<number, number>>;
  logoRotate: ReturnType<typeof useTransform<number, number>>;
  reduced: boolean;
}) {
  const delays = packetDelays(ringPlatforms.length);
  return (
    <motion.div
      className="absolute inset-0"
      style={reduced ? undefined : { rotate: ringRotate }}
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
            ...(reduced ? {} : { rotate: logoRotate }),
          }}
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

export function ControlRoomScroll() {
  const { eyebrow, heading } = copy.controlRoom;
  const positioned = buildPositions();
  const reduced = useReducedMotion() ?? false;

  const spacerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ["start start", "end end"],
  });

  // Smooth the raw progress with a spring so rotations don't jitter on
  // jumpy scrolls — equivalent feel to GSAP's scrub:1.
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.5,
  });

  const innerRingRot = useTransform(smoothed, [0, 1], [0, SCROLL_ROTATION.inner]);
  const middleRingRot = useTransform(smoothed, [0, 1], [0, SCROLL_ROTATION.middle]);
  const outerRingRot = useTransform(smoothed, [0, 1], [0, SCROLL_ROTATION.outer]);

  const innerLogoRot = useTransform(smoothed, [0, 1], [0, -SCROLL_ROTATION.inner]);
  const middleLogoRot = useTransform(smoothed, [0, 1], [0, -SCROLL_ROTATION.middle]);
  const outerLogoRot = useTransform(smoothed, [0, 1], [0, -SCROLL_ROTATION.outer]);

  const ringTransforms: Record<
    PlatformRing,
    {
      ringRotate: ReturnType<typeof useTransform<number, number>>;
      logoRotate: ReturnType<typeof useTransform<number, number>>;
    }
  > = {
    inner: { ringRotate: innerRingRot, logoRotate: innerLogoRot },
    middle: { ringRotate: middleRingRot, logoRotate: middleLogoRot },
    outer: { ringRotate: outerRingRot, logoRotate: outerLogoRot },
  };

  return (
    // The section wraps a normal-flow heading + a scroll-pin block.
    // Only the ring is pinned; the heading scrolls past naturally above
    // it. Spacer is 200vh so the sticky 100vh child provides 100vh of
    // scroll runway for the rotation tween while staying centered in
    // viewport during the pin.
    <section className="relative bg-pimenton-dark py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-[5%] sm:px-16 lg:px-24">
        <p className="flex items-center text-pimenton-accent text-xs sm:text-sm uppercase tracking-[0.22em] font-medium">
          <span aria-hidden className="mr-3 inline-block h-px w-8 bg-pimenton-accent" />
          {eyebrow}
        </p>
        <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] tracking-tight text-pimenton-text-on-dark">
          {heading}
        </h2>
      </div>

      <div ref={spacerRef} className="relative mt-12 h-[200vh] sm:mt-20">
        <div className="sticky top-0 flex h-screen items-center px-[5%] sm:px-16 lg:px-24">
          <div className="mx-auto w-full max-w-7xl">
            <div className="relative mx-auto aspect-square w-full max-w-[760px]">
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
                <ScrollRingGroup
                  key={ring}
                  ring={ring}
                  ringPlatforms={positioned.filter((p) => p.ring === ring)}
                  ringRotate={ringTransforms[ring].ringRotate}
                  logoRotate={ringTransforms[ring].logoRotate}
                  reduced={reduced}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
