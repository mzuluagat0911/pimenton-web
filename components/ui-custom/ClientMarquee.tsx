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
import { clients, type Client } from "@/data/clients";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Loop length in seconds at normal speed. The rAF loop advances a
// progress value 0→1 over this many seconds, so changing the "speed"
// multiplier never recomputes elapsed time the way CSS does —
// progress always advances incrementally from its current value.
const TOP_LOOP_SECONDS = 70;
const MIDDLE_LOOP_SECONDS = 90;
const BOTTOM_LOOP_SECONDS = 80;

const NORMAL_SPEED = 1;
const HOVER_SPEED = 0.25;
const SPEED_LERP = 0.08;

function ClientCard({
  client,
  reduced,
}: {
  client: Client;
  reduced: boolean;
}) {
  const hasIG = client.instagram !== null;

  const flipper = (
    <div
      className={`absolute inset-0 transition-transform duration-700 ease-out [transform-style:preserve-3d] group-hover/coin:[transform:rotateY(180deg)] ${
        reduced ? "!transform-none" : ""
      }`}
    >
      {/* FRONT — logo */}
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
  const progress = useMotionValue(0);
  const xValue = useTransform(
    progress,
    [0, 1],
    direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
  );
  const hoveredRef = useRef(false);

  useEffect(() => {
    if (reduced) return;
    let frameId = 0;
    let lastTs = performance.now();
    let currentSpeed = NORMAL_SPEED;

    const tick = (now: number) => {
      const dt = (now - lastTs) / 1000;
      lastTs = now;

      const targetSpeed = hoveredRef.current ? HOVER_SPEED : NORMAL_SPEED;
      currentSpeed += (targetSpeed - currentSpeed) * SPEED_LERP;

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

/**
 * Two full-bleed marquee rows of client logos (coin flip on hover).
 * No heading, no padding — the parent positions and sizes it.
 * Use inside a section with `overflow-hidden` so the rows can extend
 * past the viewport edge cleanly.
 */
export function ClientMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });
  const reduced = useReducedMotion() ?? false;

  // Split clients into three rows by modulo 3 so countries interleave
  // across all three rows (no row becomes "the Argentina row").
  const rowA = clients.filter((_, i) => i % 3 === 0);
  const rowB = clients.filter((_, i) => i % 3 === 1);
  const rowC = clients.filter((_, i) => i % 3 === 2);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="flex flex-col gap-4 sm:gap-6"
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
        loopSeconds={MIDDLE_LOOP_SECONDS}
        reduced={reduced}
      />
      <MarqueeRow
        items={rowC}
        direction="left"
        loopSeconds={BOTTOM_LOOP_SECONDS}
        reduced={reduced}
      />
    </motion.div>
  );
}
