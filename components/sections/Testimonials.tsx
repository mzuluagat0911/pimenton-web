"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Star } from "lucide-react";
import { copy } from "@/data/copy";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type TestimonialItem = (typeof copy.testimonials.items)[number];

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function AvatarPlaceholder({ name }: { name: string }) {
  return (
    <div
      aria-hidden
      className="flex size-10 flex-shrink-0 items-center justify-center rounded-full border border-pimenton-accent/30 bg-pimenton-accent/15 font-mono text-xs font-semibold tracking-wide text-pimenton-accent sm:size-11 sm:text-sm"
    >
      {getInitials(name)}
    </div>
  );
}

function StarRow() {
  return (
    <div aria-label="5 estrellas" className="flex gap-1 text-pimenton-accent">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-4 fill-current" strokeWidth={0} />
      ))}
    </div>
  );
}

function IntroCard({
  brand,
  heading,
  subheading,
  inView,
  reduced,
}: {
  brand: string;
  heading: string;
  subheading: string;
  inView: boolean;
  reduced: boolean;
}) {
  return (
    <motion.article
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={
        inView
          ? { opacity: 1, y: 0 }
          : reduced
            ? { opacity: 0 }
            : { opacity: 0, y: 24 }
      }
      transition={{ duration: 0.6, ease: EASE }}
      className="relative flex h-full flex-col justify-between rounded-2xl border border-pimenton-border bg-pimenton-surface p-7 sm:p-8"
    >
      {/* Coral corner accent, subtle nod to the Framer original */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-7 top-7 block size-3 border-r border-t border-pimenton-accent sm:right-8 sm:top-8"
      />

      <div>
        <p className="font-semibold text-pimenton-accent tracking-tight text-lg">
          {brand}
        </p>
        <h2 className="mt-10 text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-4xl">
          {heading}
        </h2>
      </div>

      <p className="mt-12 text-sm leading-relaxed text-pimenton-text-muted sm:text-base">
        {subheading}
      </p>
    </motion.article>
  );
}

function TestimonialCard({
  item,
  index,
  inView,
  reduced,
}: {
  item: TestimonialItem;
  index: number;
  inView: boolean;
  reduced: boolean;
}) {
  return (
    <motion.article
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={
        inView
          ? { opacity: 1, y: 0 }
          : reduced
            ? { opacity: 0 }
            : { opacity: 0, y: 24 }
      }
      transition={{
        duration: 0.6,
        delay: reduced ? 0 : (index + 1) * 0.1,
        ease: EASE,
      }}
      whileHover={
        reduced
          ? undefined
          : { y: -4, transition: { duration: 0.25, ease: EASE } }
      }
      className="relative flex h-full flex-col rounded-2xl border border-pimenton-border bg-pimenton-surface p-7 transition-shadow duration-300 hover:shadow-[0_18px_40px_-22px_rgba(15,15,14,0.18)] sm:p-8"
    >
      <StarRow />

      <p className="mt-6 text-base leading-relaxed text-pimenton-text-soft">
        {item.quote}
      </p>

      <div className="mt-auto pt-10">
        <div className="space-y-5">
          {item.metrics.map((m) => (
            <div key={m.label}>
              <p className="text-3xl font-semibold tracking-tight text-pimenton-accent sm:text-4xl">
                {m.value}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-pimenton-text-muted sm:text-sm">
                {m.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-pimenton-border pt-5">
          <AvatarPlaceholder name={item.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-pimenton-text">
              {item.name}
            </p>
            <p className="truncate text-xs text-pimenton-text-muted sm:text-sm">
              {item.role}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function Testimonials() {
  const { intro, items } = copy.testimonials;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      ref={ref}
      className="bg-pimenton-bg px-8 sm:px-16 lg:px-24 py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <IntroCard
            brand={intro.brand}
            heading={intro.heading}
            subheading={intro.subheading}
            inView={inView}
            reduced={reduced}
          />
          {items.map((item, i) => (
            <TestimonialCard
              key={item.name}
              item={item}
              index={i}
              inView={inView}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
