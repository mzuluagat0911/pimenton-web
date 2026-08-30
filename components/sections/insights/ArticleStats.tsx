"use client";

import { motion, useReducedMotion } from "motion/react";
import { CountUp } from "@/components/ui-custom/CountUp";
import { useT } from "@/components/i18n/LanguageContext";
import type { InsightStat } from "@/data/insights";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Franja de cifras al inicio del artículo. Misma lógica de count-up que las
 * métricas de casos, compactada al ancho de lectura.
 */
export function ArticleStats({ stats }: { stats: InsightStat[] }) {
  const reduced = useReducedMotion() ?? false;
  const t = useT();

  if (!stats.length) return null;

  return (
    <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.55,
            delay: reduced ? 0 : i * 0.08,
            ease: EASE,
          }}
          className="rounded-2xl border border-pimenton-border bg-pimenton-surface px-5 py-5"
        >
          <CountUp
            value={t(stat.value)}
            className="block font-display text-3xl font-bold leading-none tracking-tight text-pimenton-accent sm:text-4xl"
          />
          <p className="mt-2.5 text-sm leading-snug text-pimenton-text-muted">
            {t(stat.label)}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
