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

function StatCard({
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
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
      animate={
        inView
          ? { opacity: 1, y: 0, scale: 1 }
          : reduced
            ? { opacity: 0 }
            : { opacity: 0, y: 24, scale: 0.96 }
      }
      transition={{ duration: 0.7, delay: stagger, ease: EASE }}
      className="flex flex-col items-center text-center"
    >
      {/* Número — héroe del bloque. Pop sutil al terminar el count-up. */}
      <motion.div
        animate={inView && !reduced ? { scale: [1, 1.07, 1] } : { scale: 1 }}
        transition={{
          duration: 0.5,
          delay: stagger + COUNT_DURATION,
          ease: "easeOut",
        }}
        className="flex items-baseline justify-center font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-none tracking-tight text-pimenton-accent tabular-nums"
      >
        <span className="text-[0.6em]">{item.prefix}</span>
        <motion.span>{rounded}</motion.span>
        {item.suffix && <span className="text-[0.6em]">{item.suffix}</span>}
      </motion.div>

      {/* Línea de acento que crece al entrar — detalle de movimiento sobrio */}
      <motion.span
        aria-hidden
        initial={reduced ? { opacity: 1 } : { scaleX: 0 }}
        animate={
          inView
            ? { scaleX: 1, opacity: 1 }
            : reduced
              ? { opacity: 1 }
              : { scaleX: 0 }
        }
        transition={{ duration: 0.6, delay: stagger + 0.3, ease: EASE }}
        className="mt-5 h-0.5 w-10 origin-center rounded-full bg-pimenton-accent/50"
      />

      {/* Label secundario, centrado */}
      <p className="mt-4 max-w-[20ch] text-sm sm:text-base leading-relaxed text-pimenton-text-soft">
        {item.label}
      </p>
    </motion.div>
  );
}

export function Stats() {
  const { items } = copy.stats;
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="bg-pimenton-mint px-8 sm:px-16 lg:px-24 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4 lg:gap-x-8">
          {items.map((item, i) => (
            <StatCard
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
