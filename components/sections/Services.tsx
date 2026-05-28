"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { copy } from "@/data/copy";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Item = (typeof copy.services.items)[number];

function DesktopList({
  items,
  activeIndex,
  onHover,
  reduced,
}: {
  items: readonly Item[];
  activeIndex: number;
  onHover: (i: number) => void;
  reduced: boolean;
}) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map((item, i) => {
        const active = activeIndex === i;
        return (
          <li key={item.num} className="relative">
            <button
              type="button"
              onMouseEnter={() => onHover(i)}
              onFocus={() => onHover(i)}
              className="group relative flex w-full items-baseline gap-5 py-4 text-left outline-none cursor-pointer"
            >
              {active && (
                <motion.span
                  layoutId="service-indicator"
                  aria-hidden
                  className="absolute -left-6 top-1/2 h-10 w-0.5 -translate-y-1/2 bg-pimenton-accent"
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { duration: 0.35, ease: EASE }
                  }
                />
              )}
              <span className="font-mono text-xs text-pimenton-accent sm:text-sm">
                {item.num}
              </span>
              <span
                className={`text-3xl font-semibold tracking-tight transition-colors duration-300 sm:text-4xl lg:text-5xl ${
                  active
                    ? "text-pimenton-text-on-dark"
                    : "text-pimenton-text-on-dark-muted/45 group-hover:text-pimenton-text-on-dark-muted/80"
                }`}
              >
                {item.name}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function DesktopMedia({
  items,
  activeIndex,
  reduced,
}: {
  items: readonly Item[];
  activeIndex: number;
  reduced: boolean;
}) {
  return (
    <div>
      {/* All 5 images stacked — only active is visible, others preload silently */}
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-pimenton-dark-surface">
        {items.map((item, i) => (
          <motion.div
            key={item.num}
            aria-hidden={activeIndex !== i}
            animate={{
              opacity: activeIndex === i ? 1 : 0,
              scale:
                reduced
                  ? 1
                  : activeIndex === i
                    ? 1
                    : 1.04,
            }}
            transition={{
              duration: reduced ? 0.2 : 0.55,
              ease: EASE,
            }}
            className="absolute inset-0"
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(min-width: 1024px) 45vw, (min-width: 768px) 50vw, 100vw"
              priority={i === 0}
              quality={90}
              unoptimized
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* Stacked label + description */}
      <div className="mt-8 grid">
        {items.map((item, i) => (
          <motion.div
            key={item.num}
            aria-hidden={activeIndex !== i}
            animate={{ opacity: activeIndex === i ? 1 : 0 }}
            transition={{ duration: reduced ? 0.15 : 0.35, ease: EASE }}
            className="col-start-1 row-start-1"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-pimenton-accent">
                {item.num}
              </span>
              <span className="text-xl font-semibold tracking-tight text-pimenton-text-on-dark sm:text-2xl">
                {item.name}
              </span>
            </div>
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-pimenton-text-on-dark-muted sm:text-base">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MobileAccordion({
  items,
  openIndex,
  onOpen,
  reduced,
}: {
  items: readonly Item[];
  openIndex: number;
  onOpen: (i: number) => void;
  reduced: boolean;
}) {
  return (
    <ul className="flex flex-col border-t border-pimenton-dark-border">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <li
            key={item.num}
            className="border-b border-pimenton-dark-border"
          >
            <button
              type="button"
              onClick={() => onOpen(i)}
              aria-expanded={isOpen}
              className="flex w-full items-baseline gap-4 py-5 text-left outline-none"
            >
              <span className="font-mono text-xs text-pimenton-accent">
                {item.num}
              </span>
              <span
                className={`text-2xl font-semibold tracking-tight transition-colors duration-300 ${
                  isOpen
                    ? "text-pimenton-accent"
                    : "text-pimenton-text-on-dark-muted/70"
                }`}
              >
                {item.name}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: reduced ? 0.2 : 0.35, ease: EASE }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="pb-6">
                    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-pimenton-dark-surface">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="100vw"
                        priority={i === 0}
                        quality={90}
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-pimenton-text-on-dark-muted">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

export function Services() {
  const { eyebrow, heading, cta, items } = copy.services;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduced = useReducedMotion() ?? false;

  const [activeIndex, setActiveIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      ref={ref}
      id="servicios"
      className="relative scroll-mt-24 bg-pimenton-dark px-8 sm:px-16 lg:px-24 py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-7xl">
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
          className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-pimenton-text-on-dark sm:text-5xl"
        >
          {heading}
        </motion.h2>

        {/* Mobile accordion */}
        <div className="mt-12 md:hidden">
          <MobileAccordion
            items={items}
            openIndex={openIndex}
            onOpen={setOpenIndex}
            reduced={reduced}
          />
        </div>

        {/* Desktop two-zone layout */}
        <div className="mt-16 hidden grid-cols-1 gap-10 md:grid md:grid-cols-[1fr_1fr] lg:mt-20 lg:gap-16">
          <DesktopMedia
            items={items}
            activeIndex={activeIndex}
            reduced={reduced}
          />
          <DesktopList
            items={items}
            activeIndex={activeIndex}
            onHover={setActiveIndex}
            reduced={reduced}
          />
        </div>

        {/* CTA */}
        <div className="mt-16 flex justify-start sm:mt-20 md:justify-end">
          <a
            href={cta.href}
            className="group inline-flex items-center gap-2 text-base font-medium text-pimenton-accent transition-colors duration-300 hover:text-pimenton-accent-hover sm:text-lg"
          >
            {cta.label}
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-300 group-hover:translate-x-1 sm:size-5"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
