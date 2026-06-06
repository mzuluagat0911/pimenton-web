"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { copy } from "@/data/copy";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const COUNT_DURATION = 1.8;
const STAGGER = 0.12;

type StatItem = (typeof copy.stats.items)[number];

function StatColumn({
  item,
  index,
  inView,
  reduced,
}: {
  item: StatItem;
  index: number;
  inView: boolean;
  reduced: boolean;
}) {
  const stagger = index * STAGGER;
  const count = useMotionValue(reduced ? item.value : 0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (reduced) {
      count.set(item.value);
      return;
    }
    if (!inView) return;
    const controls = animate(count, item.value, {
      duration: COUNT_DURATION,
      delay: stagger,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [inView, reduced, item.value, count, stagger]);

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={
        inView
          ? { opacity: 1, y: 0 }
          : reduced
            ? { opacity: 0 }
            : { opacity: 0, y: 24 }
      }
      transition={{ duration: 0.7, delay: stagger, ease: EASE }}
      className="group flex min-h-[200px] flex-col justify-between border-l border-pimenton-border pl-5 transition-colors duration-300 hover:border-pimenton-accent/60 sm:min-h-[260px] sm:pl-7 lg:min-h-[300px]"
    >
      {/* Descriptor arriba */}
      <p className="max-w-[20ch] text-sm leading-snug text-pimenton-text-soft sm:text-base">
        {item.label}
      </p>

      {/* Número abajo — héroe: accent + bold, afijos finos */}
      <div className="flex items-baseline font-display text-5xl font-semibold leading-none tracking-tight text-pimenton-accent tabular-nums sm:text-6xl lg:text-7xl">
        {item.prefix && (
          <span className="text-[0.55em] font-normal">{item.prefix}</span>
        )}
        <motion.span>{rounded}</motion.span>
        {item.suffix && (
          <span className="text-[0.55em] font-normal">{item.suffix}</span>
        )}
      </div>
    </motion.div>
  );
}

export function Stats() {
  const { eyebrow, items } = copy.stats;
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="bg-pimenton-bg px-8 sm:px-16 lg:px-24 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* Eyebrow estilo highlight (amarillo Pimentón) */}
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={
            inView
              ? { opacity: 1, y: 0 }
              : reduced
                ? { opacity: 0 }
                : { opacity: 0, y: 12 }
          }
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12 inline-block rounded-full bg-pimenton-yellow px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-pimenton-text sm:mb-16"
        >
          {eyebrow}
        </motion.div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-8 lg:grid-cols-4">
          {items.map((item, i) => (
            <StatColumn
              key={item.label}
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
