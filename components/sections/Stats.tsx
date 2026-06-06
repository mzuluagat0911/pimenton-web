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
const STAGGER = 0.1;

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
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={
        inView
          ? { opacity: 1, y: 0 }
          : reduced
            ? { opacity: 0 }
            : { opacity: 0, y: 20 }
      }
      transition={{ duration: 0.7, delay: stagger, ease: EASE }}
    >
      <motion.div
        animate={inView && !reduced ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{
          duration: 0.4,
          delay: stagger + COUNT_DURATION,
          ease: "easeOut",
        }}
        className="flex items-baseline font-display text-5xl sm:text-6xl font-semibold leading-none tracking-tight text-pimenton-accent tabular-nums"
      >
        <span className="text-[0.7em]">{item.prefix}</span>
        <motion.span>{rounded}</motion.span>
        {item.suffix && <span className="text-[0.7em]">{item.suffix}</span>}
      </motion.div>
      <p className="mt-4 text-sm sm:text-base leading-relaxed text-pimenton-text-muted max-w-[22ch]">
        {item.label}
      </p>
    </motion.div>
  );
}

export function Stats() {
  const { heading, items } = copy.stats;
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="bg-pimenton-bg px-8 sm:px-16 lg:px-24 pt-24 pb-12 sm:pt-32 sm:pb-16"
    >
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={
            inView
              ? { opacity: 1, y: 0 }
              : reduced
                ? { opacity: 0 }
                : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-3xl text-3xl sm:text-4xl font-semibold leading-[1.05] tracking-tight text-pimenton-text"
        >
          {heading}
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 gap-y-12 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
          {items.map((item, i) => {
            const borderClass =
              i === 0
                ? ""
                : i === 2
                  ? "lg:border-l lg:border-pimenton-border"
                  : "sm:border-l sm:border-pimenton-border";
            return (
              <div
                key={item.label}
                className={`px-0 sm:px-6 lg:px-8 ${borderClass}`}
              >
                <StatCard
                  item={item}
                  index={i}
                  inView={inView}
                  reduced={reduced}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
