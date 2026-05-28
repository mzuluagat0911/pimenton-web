"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { copy } from "@/data/copy";
import { clients, type Client } from "@/data/clients";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function ClientCard({
  client,
  reduced,
}: {
  client: Client;
  reduced: boolean;
}) {
  const hasIG = client.instagram !== null;
  const inner = (
    <div
      // The flip wrapper — preserve-3d so the two faces orbit a shared axis.
      className={`group/card relative size-16 transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)] sm:size-20 lg:size-[88px] ${
        reduced ? "[&_*]:!transform-none" : ""
      }`}
      style={{ transformOrigin: "center" }}
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
        className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-full bg-pimenton-dark px-2 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]"
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={client.flag}
          alt=""
          className="size-3.5 rounded-full object-cover ring-1 ring-pimenton-dark-border sm:size-4"
        />
        <span className="line-clamp-2 text-[9px] font-medium leading-tight text-pimenton-text-on-dark sm:text-[10px]">
          {client.name}
        </span>
        {hasIG && (
          <ExternalLink className="size-2.5 text-pimenton-accent" />
        )}
      </div>
    </div>
  );

  if (hasIG) {
    return (
      <a
        href={client.instagram ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="block shrink-0 [perspective:1000px]"
        aria-label={`${client.name} en Instagram`}
      >
        {inner}
      </a>
    );
  }
  return (
    <div
      className="shrink-0 [perspective:1000px]"
      aria-label={client.name}
    >
      {inner}
    </div>
  );
}

function MarqueeRow({
  items,
  direction,
  duration,
  reduced,
}: {
  items: Client[];
  direction: "left" | "right";
  duration: number;
  reduced: boolean;
}) {
  const animationName =
    direction === "left" ? "pim-marquee-left" : "pim-marquee-right";

  return (
    // group wrapper — hovering ANY child pauses the track via the
    // [&:has(:hover)] selector below. Works on touch via tap-and-hold too.
    <div className="group/row relative overflow-hidden">
      <div
        className="flex w-max gap-4 sm:gap-6 group-hover/row:[animation-play-state:paused] motion-reduce:!animate-none"
        style={
          reduced
            ? undefined
            : {
                animation: `${animationName} ${duration}s linear infinite`,
                willChange: "transform",
              }
        }
      >
        {/* Duplicate the set so the track is 2x — 0 → -50% loops seamlessly */}
        {[...items, ...items].map((client, i) => (
          <ClientCard
            key={`${client.logo}-${i}`}
            client={client}
            reduced={reduced}
          />
        ))}
      </div>
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
      <div className="mx-auto w-full max-w-7xl px-8 sm:px-16 lg:px-24">
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
          className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-5xl"
        >
          {headStart}
          <span className="text-pimenton-accent">{headingAccent}</span>
          {headEnd}
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
        className="mt-12 flex flex-col gap-4 sm:mt-16 sm:gap-6"
        style={{
          // Soft fade on the horizontal edges so logos don't pop in/out
          maskImage:
            "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
        }}
      >
        <MarqueeRow
          items={rowA}
          direction="left"
          duration={70}
          reduced={reduced}
        />
        <MarqueeRow
          items={rowB}
          direction="right"
          duration={90}
          reduced={reduced}
        />
      </motion.div>
    </section>
  );
}
