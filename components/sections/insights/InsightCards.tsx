"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useT } from "@/components/i18n/LanguageContext";
import type { Insight } from "@/data/insights";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const MotionLink = motion.create(Link);

/**
 * Card vertical del hub (grid de 3 en desktop, 1 columna en mobile).
 * Imagen → tag de categoría (coral) → título → bajada breve (máx 2 líneas).
 * Estilo editorial: sin borde ni sombra; toda la card es un link.
 */
export function InsightCard({
  insight,
  index,
}: {
  insight: Insight;
  index: number;
}) {
  const reduced = useReducedMotion() ?? false;
  const t = useT();

  return (
    <MotionLink
      href={`/insights/${insight.slug}`}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: reduced ? 0 : index * 0.1,
        ease: EASE,
      }}
      className="group flex flex-col"
    >
      {/* Imagen */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-pimenton-bg-soft">
        <Image
          src={insight.heroImage}
          alt={t(insight.titulo)}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>

      {/* Categoría */}
      <span className="mt-5 self-start rounded-full bg-pimenton-accent/10 px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-pimenton-accent">
        {t(insight.categoria)}
      </span>

      {/* Título — sentence case (normal-case anula el uppercase global).
          Alto natural: la bajada queda pegada al título (mismo espaciado en
          desktop y mobile). */}
      <h2 className="mt-4 text-xl font-bold normal-case leading-snug tracking-tight text-pimenton-text transition-colors duration-300 group-hover:text-pimenton-accent">
        {t(insight.titulo)}
      </h2>

      {/* Bajada breve */}
      <p className="mt-2.5 line-clamp-2 text-[15px] leading-relaxed text-pimenton-text-muted">
        {t(insight.resumen)}
      </p>
    </MotionLink>
  );
}
