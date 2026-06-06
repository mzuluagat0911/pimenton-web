"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { ExternalLink } from "lucide-react";
import { copy } from "@/data/copy";
import { clients, type Client } from "@/data/clients";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Loop length in seconds at normal speed. The rAF loop advances a
// progress value 0→1 over this many seconds, so changing the "speed"
// multiplier never recomputes elapsed time the way CSS does —
// progress always advances incrementally from its current value.
const TOP_LOOP_SECONDS = 70;
const BOTTOM_LOOP_SECONDS = 90;

// Speed targets. 1 = normal, 0.25 = 4× slower.
const NORMAL_SPEED = 1;
const HOVER_SPEED = 0.25;
// Per-frame approach toward target speed — produces a smooth ramp
// instead of an abrupt change when hover toggles.
const SPEED_LERP = 0.08;

function ClientCard({
  client,
  reduced,
}: {
  client: Client;
  reduced: boolean;
}) {
  const hasIG = client.instagram !== null;

  // The flipper element rotates; the outer wrapper does NOT. That keeps
  // the pointer hit area stable while the inner element rotates 180°.
  const flipper = (
    <div
      className={`absolute inset-0 transition-transform duration-700 ease-out [transform-style:preserve-3d] group-hover/coin:[transform:rotateY(180deg)] ${
        reduced ? "!transform-none" : ""
      }`}
    >
      {/* FRONT — the logo */}
      <div className="absolute inset-0 overflow-hidden rounded-full bg-pimenton-dark [backface-visibility:hidden]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={client.logo}
          alt={client.name}
          className="h-full w-full object-cover"
          loading="lazy"
          draggable={false}
        />
      </div>
      {/* BACK — flag + name + (optional IG hint) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-full bg-pimenton-dark px-4 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]"
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={client.flag}
          alt=""
          className="size-5 rounded-full object-cover ring-1 ring-pimenton-dark-border sm:size-6"
        />
        <span className="line-clamp-3 text-xs font-medium leading-tight text-pimenton-text-on-dark sm:text-sm">
          {client.name}
        </span>
        {hasIG && (
          <ExternalLink className="size-4 text-pimenton-accent sm:size-5" />
        )}
      </div>
    </div>
  );

  const wrapperClasses =
    "group/coin relative shrink-0 size-24 sm:size-36 lg:size-[176px] [perspective:1000px]";

  if (hasIG) {
    return (
      <a
        href={client.instagram ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={`${wrapperClasses} block`}
        aria-label={`${client.name} en Instagram`}
      >
        {flipper}
      </a>
    );
  }
  return (
    <div className={wrapperClasses} aria-label={client.name}>
      {flipper}
    </div>
  );
}

function MarqueeRow({
  items,
  direction,
  loopSeconds,
  reduced,
}: {
  items: Client[];
  direction: "left" | "right";
  loopSeconds: number;
  reduced: boolean;
}) {
  // Progress value in [0, 1) — wraps modulo 1, never resets to satisfy a
  // duration change. Smooth deceleration is a separate state.
  const progress = useMotionValue(0);

  // Direction is just a different mapping over the same progress. For
  // both directions the wrap point lands on visually-identical content
  // because the items are duplicated to fill 2× the track width.
  const xValue = useTransform(
    progress,
    [0, 1],
    direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
  );

  // Hover state lives in a ref so the rAF loop can read it without
  // re-subscribing or causing re-renders. The effect runs once on
  // mount and lasts for the lifetime of the row.
  const hoveredRef = useRef(false);

  useEffect(() => {
    if (reduced) return;
    let frameId = 0;
    let lastTs = performance.now();
    let currentSpeed = NORMAL_SPEED;

    const tick = (now: number) => {
      const dt = (now - lastTs) / 1000; // seconds since last frame
      lastTs = now;

      // Approach the target speed gradually — easeOut feel without an
      // extra spring lib. After ~30 frames (~0.5s) we're at ≥90%.
      const targetSpeed = hoveredRef.current ? HOVER_SPEED : NORMAL_SPEED;
      currentSpeed += (targetSpeed - currentSpeed) * SPEED_LERP;

      // Advance progress in [0,1) — never resets, never jumps. Speed
      // changes scale dt's contribution rather than re-deriving from
      // elapsed time.
      let next = progress.get() + (dt / loopSeconds) * currentSpeed;
      if (next >= 1) next -= 1;
      else if (next < 0) next += 1;
      progress.set(next);

      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [progress, loopSeconds, reduced]);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
    >
      <motion.div
        className="flex w-max gap-6 will-change-transform sm:gap-8 lg:gap-10"
        style={reduced ? undefined : { x: xValue }}
      >
        {/* Duplicate the set so the track is 2× — the wrap from 1 to 0
            shows identical content, making the loop seamless. */}
        {[...items, ...items].map((client, i) => (
          <ClientCard
            key={`${client.logo}-${i}`}
            client={client}
            reduced={reduced}
          />
        ))}
      </motion.div>
    </div>
  );
}

export function ClientWall() {
  const { eyebrow, heading, headingAccent } = copy.wall;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduced = useReducedMotion() ?? false;

  // Split clients into two rows by parity so countries interleave
  const rowA = clients.filter((_, i) => i % 2 === 0);
  const rowB = clients.filter((_, i) => i % 2 === 1);

  const [headStart, headEnd] = heading.split(headingAccent);

  return (
    <section
      ref={ref}
      className="bg-pimenton-bg py-24 sm:py-32 overflow-hidden"
    >
      {/* Heading sits inside the same px+max-w envelope as every other
          section. Marquee below bleeds full-width on purpose. */}
      <div className="px-8 sm:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">
        <motion.p
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={
            inView
              ? { opacity: 1, y: 0 }
              : reduced
                ? { opacity: 0 }
                : { opacity: 0, y: 12 }
          }
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-center text-pimenton-accent text-xs sm:text-sm uppercase tracking-[0.22em] font-medium"
        >
          <span
            aria-hidden
            className="mr-3 inline-block h-px w-8 bg-pimenton-accent"
          />
          {eyebrow}
        </motion.p>
        <motion.h2
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={
            inView
              ? { opacity: 1, y: 0 }
              : reduced
                ? { opacity: 0 }
                : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mt-6 max-w-3xl text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-4xl"
        >
          {headStart}
          <span className="text-pimenton-accent">{headingAccent}</span>
          {headEnd}
        </motion.h2>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
        className="mt-12 flex flex-col gap-4 sm:mt-16 sm:gap-6"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
        }}
      >
        <MarqueeRow
          items={rowA}
          direction="left"
          loopSeconds={TOP_LOOP_SECONDS}
          reduced={reduced}
        />
        <MarqueeRow
          items={rowB}
          direction="right"
          loopSeconds={BOTTOM_LOOP_SECONDS}
          reduced={reduced}
        />
      </motion.div>
    </section>
  );
}
