"use client";

import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
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
  } = copy.hero;

  const [headStart, headEnd] = headline.split(headlineAccent);
  const shouldReduceMotion = useReducedMotion();
  const [videoLoaded, setVideoLoaded] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ["0%", "0%"] : ["0%", "30%"],
  );
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [1, 1] : [1, 0.3],
  );

  const fadeUp = (delay: number, duration: number, y: number) => ({
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration, ease: EASE },
  });

  const videoAnimate = shouldReduceMotion
    ? { opacity: videoLoaded ? 1 : 0 }
    : { opacity: videoLoaded ? 1 : 0, scale: [1, 1.08] };

  const videoTransition = shouldReduceMotion
    ? { duration: 1.2, ease: EASE }
    : {
        opacity: { duration: 1.2, ease: EASE },
        scale: {
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "easeInOut" as const,
        },
      };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-pimenton-dark"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 will-change-transform"
        style={{ y: parallaxY }}
      >
        <motion.video
          src="/assets/video/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden
          onLoadedData={() => setVideoLoaded(true)}
          initial={{ opacity: 0, scale: 1 }}
          animate={videoAnimate}
          transition={videoTransition}
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
        />
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-transparent via-pimenton-dark/40 to-pimenton-dark/80"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{ backgroundImage: NOISE_SVG }}
      />

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 flex h-full flex-col"
      >
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
      </motion.div>
    </section>
  );
}
