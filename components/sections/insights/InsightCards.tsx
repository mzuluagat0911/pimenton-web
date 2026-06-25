"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
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
          alt={insight.titulo}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>

      {/* Categoría */}
      <span className="mt-5 self-start rounded-full bg-pimenton-accent/10 px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-pimenton-accent">
        {insight.categoria}
      </span>

      {/* Título — sentence case (normal-case anula el uppercase global). En
          desktop se reserva el alto de 3 líneas (min-h) para que las bajadas
          de las 3 cards queden alineadas. */}
      <h2 className="mt-4 text-xl font-bold normal-case leading-snug tracking-tight text-pimenton-text transition-colors duration-300 group-hover:text-pimenton-accent lg:line-clamp-3 lg:min-h-[5.25rem]">
        {insight.titulo}
      </h2>

      {/* Bajada breve */}
      <p className="mt-2.5 line-clamp-2 text-[15px] leading-relaxed text-pimenton-text-muted">
        {insight.resumen}
      </p>
    </MotionLink>
  );
}

/**
 * Card compacta (vertical) para "Más artículos" al final de cada artículo.
 */
export function InsightCardCompact({
  insight,
  readCta,
}: {
  insight: Insight;
  readCta: string;
}) {
  return (
    <Link
      href={`/insights/${insight.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-pimenton-border bg-pimenton-surface shadow-sm transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={insight.heroImage}
          alt={insight.titulo}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-pimenton-accent">
          {insight.categoria}
        </span>
        <h3 className="mt-2 text-lg font-bold normal-case leading-snug tracking-tight text-pimenton-text transition-colors duration-300 group-hover:text-pimenton-accent">
          {insight.titulo}
        </h3>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <time
            dateTime={insight.fecha}
            className="text-pimenton-text-subtle"
          >
            {insight.fechaDisplay}
          </time>
          <span className="inline-flex items-center gap-1.5 font-semibold text-pimenton-accent">
            {readCta}
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
