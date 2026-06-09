"use client";

import { motion, useReducedMotion } from "motion/react";
import { CountUp } from "@/components/ui-custom/CountUp";
import { useCopy } from "@/components/i18n/LanguageContext";
import type { Metrica } from "@/data/casos";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Las 3 métricas destacadas, con count-up al entrar en viewport. */
export function CasoMetricas({ metricas }: { metricas: Metrica[] }) {
  const reduced = useReducedMotion() ?? false;
  const eyebrow = useCopy().casos.caso.metricasEyebrow;

  return (
    <section className="bg-pimenton-bg px-[5%] py-20 sm:px-16 sm:py-24 lg:px-24">
      <div className="mx-auto w-full max-w-6xl">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-pimenton-accent sm:text-sm">
          {eyebrow}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {metricas.map((m, i) => (
            <motion.div
              key={i}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.6,
                delay: reduced ? 0 : i * 0.12,
                ease: EASE,
              }}
            >
              <CountUp
                value={m.valor}
                className="block font-display text-5xl font-bold leading-none tracking-tight text-pimenton-accent sm:text-6xl"
              />
              <p className="mt-3 text-base leading-snug text-pimenton-text-muted sm:text-lg">
                {m.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
