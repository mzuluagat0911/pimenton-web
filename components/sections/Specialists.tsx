"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { copy } from "@/data/copy";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Phrase = {
  text: string;
  highlight: string;
};

/**
 * Reveal a phrase via overflow-hidden mask + translateY from below.
 * Editorial feel — the text physically emerges from the bottom of an
 * invisible "slot". The highlight word(s) light up to coral a beat
 * after the reveal finishes, so the key idea lands last.
 */
function RevealPhrase({
  phrase,
  reduced,
}: {
  phrase: Phrase;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  const [before, after] = phrase.text.split(phrase.highlight);

  // Reduced motion: plain fade, highlight already coral, no clipping.
  if (reduced) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-4xl font-semibold leading-[1.1] tracking-tight text-pimenton-text-on-dark sm:text-5xl lg:text-6xl">
          {before}
          <span className="text-pimenton-accent">{phrase.highlight}</span>
          {after}
        </p>
      </motion.div>
    );
  }

  return (
    // Outer ref triggers viewport detection; the mask wrapper clips the
    // text until the inner element translates up into place.
    <div ref={ref}>
      <div className="overflow-hidden pb-2">
        <motion.p
          initial={{ y: "110%" }}
          animate={inView ? { y: "0%" } : { y: "110%" }}
          transition={{ duration: 1.1, ease: EASE }}
          className="text-4xl font-semibold leading-[1.1] tracking-tight text-pimenton-text-on-dark sm:text-5xl lg:text-6xl"
        >
          {before}
          <span
            className={`transition-colors duration-500 delay-[1100ms] ${
              inView ? "text-pimenton-accent" : "text-pimenton-text-on-dark"
            }`}
          >
            {phrase.highlight}
          </span>
          {after}
        </motion.p>
      </div>
    </div>
  );
}

export function Specialists() {
  const { phrase1, phrase2 } = copy.specialists;
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="bg-pimenton-dark px-8 sm:px-16 lg:px-24 py-32 sm:py-48">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-4xl">
          <RevealPhrase phrase={phrase1} reduced={reduced} />
        </div>
        <div className="mt-32 max-w-4xl sm:mt-40 lg:mt-56 lg:ml-auto">
          <RevealPhrase phrase={phrase2} reduced={reduced} />
        </div>
      </div>
    </section>
  );
}
