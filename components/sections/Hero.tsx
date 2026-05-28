"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { copy } from "@/data/copy";

const NOISE_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero() {
  const {
    eyebrow,
    headline,
    headlineAccent,
    subhead,
    ctaPrimary,
    ctaSecondary,
    scrollLabel,
  } = copy.hero;

  const [headStart, headEnd] = headline.split(headlineAccent);
  const shouldReduceMotion = useReducedMotion();
  const [videoLoaded, setVideoLoaded] = useState(false);

  const fadeUp = (delay: number, duration: number, y: number) => ({
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration, ease: EASE },
  });

  const fadeOnly = (delay: number, duration: number) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay, duration, ease: EASE },
  });

  return (
    <section className="relative h-screen w-full overflow-hidden bg-pimenton-dark">
      <motion.video
        src="/assets/video/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
        onLoadedData={() => setVideoLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: videoLoaded ? 1 : 0 }}
        transition={{ duration: 1.2, ease: EASE }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-transparent via-pimenton-dark/40 to-pimenton-dark/80"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{ backgroundImage: NOISE_SVG }}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="h-20 shrink-0" />

        <div className="flex flex-1 items-end pb-20 sm:pb-24 px-8 sm:px-16 lg:px-24">
          <div className="w-full max-w-6xl">
            <motion.p
              {...fadeUp(0.2, 0.6, 12)}
              className="flex items-center text-pimenton-accent text-xs sm:text-sm uppercase tracking-[0.22em] font-medium"
            >
              <span aria-hidden className="mr-3 inline-block h-px w-8 bg-pimenton-accent" />
              {eyebrow}
            </motion.p>

            <motion.h1
              {...fadeUp(0.4, 0.8, 24)}
              className="mt-6 text-5xl sm:text-7xl lg:text-8xl font-semibold leading-[1.02] tracking-tight text-pimenton-text-on-dark"
            >
              {headStart}
              <span className="italic font-medium text-pimenton-accent">
                {headlineAccent}
              </span>
              {headEnd}
            </motion.h1>

            <motion.p
              {...fadeUp(0.7, 0.7, 16)}
              className="mt-6 max-w-2xl text-lg sm:text-xl font-light leading-relaxed text-pimenton-text-on-dark/85"
            >
              {subhead}
            </motion.p>

            <motion.div
              {...fadeUp(0.9, 0.7, 16)}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <a
                href={ctaPrimary.href}
                className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-pimenton-accent px-8 py-4 font-medium text-pimenton-bg transition-colors duration-300 hover:bg-pimenton-accent-hover"
              >
                {ctaPrimary.label}
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>

              <a
                href={ctaSecondary.href}
                className="inline-flex cursor-pointer items-center justify-center rounded-full border border-pimenton-text-on-dark/30 px-8 py-4 font-medium text-pimenton-text-on-dark backdrop-blur-sm transition-colors duration-300 hover:border-pimenton-text-on-dark/80 hover:bg-pimenton-text-on-dark/5"
              >
                {ctaSecondary.label}
              </a>
            </motion.div>
          </div>
        </div>

        <motion.div
          {...fadeOnly(1.4, 1)}
          className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-pimenton-text-on-dark/50">
            {scrollLabel}
          </span>
          <motion.span
            aria-hidden
            animate={shouldReduceMotion ? undefined : { y: [0, 6, 0] }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }
            className="block h-8 w-px bg-gradient-to-b from-pimenton-text-on-dark/50 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
