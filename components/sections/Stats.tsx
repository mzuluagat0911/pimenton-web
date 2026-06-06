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

// Ritmos distintos por columna (determinísticos → sin hydration mismatch).
// Períodos no múltiplos + repeatDelay variados = se desincronizan solos, sin
// un orden definido. Direcciones alternadas para más variedad.
const PULSE_TIMING = [
  { duration: 3.1, delay: 0.0, repeatDelay: 1.4, down: true },
  { duration: 3.9, delay: 1.2, repeatDelay: 2.3, down: false },
  { duration: 2.7, delay: 0.5, repeatDelay: 1.9, down: true },
  { duration: 4.3, delay: 1.9, repeatDelay: 1.2, down: false },
];

type StatItem = (typeof copy.stats.items)[number];

// Borde con "actividad eléctrica": línea base gris muy suave + un pulso de
// corriente coral que la recorre a intervalos.
function ElectricBorder({
  index,
  inView,
  reduced,
}: {
  index: number;
  inView: boolean;
  reduced: boolean;
}) {
  const t = PULSE_TIMING[index % PULSE_TIMING.length];
  const from = t.down ? "-45%" : "145%";
  const to = t.down ? "145%" : "-45%";

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-px overflow-hidden bg-pimenton-text/10"
    >
      {!reduced && (
        <motion.span
          className="absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-pimenton-accent to-transparent"
          initial={{ top: from, opacity: 0.85 }}
          animate={
            inView
              ? { top: [from, to], opacity: [0.85, 1, 0.9, 1, 0.85] }
              : { top: from }
          }
          transition={{
            duration: t.duration,
            delay: t.delay,
            repeat: Infinity,
            repeatDelay: t.repeatDelay,
            ease: "easeInOut",
          }}
        />
      )}
    </span>
  );
}

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
      className="relative flex min-h-[200px] flex-col justify-between pl-5 sm:min-h-[260px] sm:pl-7 lg:min-h-[300px]"
    >
      <ElectricBorder index={index} inView={inView} reduced={reduced} />

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
      className="bg-pimenton-bg px-[5%] sm:px-16 lg:px-24 py-20 sm:py-28"
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
