"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { copy } from "@/data/copy";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

type Phrase = { text: string; highlight: string };

function PhraseStatic({ phrase, inView }: { phrase: Phrase; inView: boolean }) {
  const [before, after] = phrase.text.split(phrase.highlight);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-pimenton-text-on-dark sm:text-4xl lg:text-5xl">
        {before}
        <span className="text-pimenton-accent">{phrase.highlight}</span>
        {after}
      </p>
    </motion.div>
  );
}

export function Specialists() {
  const sectionRef = useRef<HTMLElement>(null);
  const phrase1Ref = useRef<HTMLDivElement>(null);
  const phrase2Ref = useRef<HTMLDivElement>(null);
  const inViewRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { phrase1, phrase2 } = copy.specialists;
  const inView = useInView(inViewRef, { once: true, amount: 0.4 });

  useGSAP(
    () => {
      if (reduced) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=220%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Phrase 1: reveals → holds → exits
        tl.fromTo(
          phrase1Ref.current,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.15, ease: "power3.out" },
          0,
        );
        tl.to(
          phrase1Ref.current,
          { yPercent: -100, opacity: 0, duration: 0.15, ease: "power3.in" },
          0.4,
        );

        // Phrase 2: reveals into the vacated space, then holds to the end
        tl.fromTo(
          phrase2Ref.current,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.15, ease: "power3.out" },
          0.55,
        );
      });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-pimenton-dark md:h-screen"
    >
      {/* Desktop pinned scrub */}
      <div className="hidden md:block absolute inset-0">
        <div className="absolute inset-0 flex items-center justify-center px-8 sm:px-16 lg:px-24">
          <div className="relative w-full max-w-7xl">
            <div
              ref={phrase1Ref}
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 will-change-transform"
            >
              <p className="font-display text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text-on-dark sm:text-4xl lg:text-5xl">
                {phrase1.text.split(phrase1.highlight)[0]}
                <span className="text-pimenton-accent">
                  {phrase1.highlight}
                </span>
                {phrase1.text.split(phrase1.highlight)[1]}
              </p>
            </div>
            <div
              ref={phrase2Ref}
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 will-change-transform"
              style={{ opacity: 0 }}
            >
              <p className="ml-auto max-w-4xl font-display text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text-on-dark sm:text-4xl lg:text-5xl lg:text-right">
                {phrase2.text.split(phrase2.highlight)[0]}
                <span className="text-pimenton-accent">
                  {phrase2.highlight}
                </span>
                {phrase2.text.split(phrase2.highlight)[1]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile + reduced-motion fallback — both phrases revealed via
          intersection observer, stacked, no pin, no scrub */}
      <div
        ref={inViewRef}
        className="md:hidden px-8 py-24 sm:px-16 sm:py-32 flex flex-col gap-24"
      >
        <PhraseStatic phrase={phrase1} inView={inView} />
        <PhraseStatic phrase={phrase2} inView={inView} />
      </div>
    </section>
  );
}
