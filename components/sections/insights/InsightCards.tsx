"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { Insight } from "@/data/insights";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const MotionLink = motion.create(Link);

/**
 * Fila editorial horizontal (lista del hub). Foto a un lado (~40%) y texto
 * al otro (~60%), con el lado de la foto alternado por índice. En mobile se
 * apila (foto arriba / texto abajo). Toda la fila es un link.
 */
export function InsightRow({
  insight,
  index,
  readCta,
}: {
  insight: Insight;
  index: number;
  readCta: string;
}) {
  const reduced = useReducedMotion() ?? false;
  // art. 1 (idx 0) foto izq · art. 2 (idx 1) foto der · art. 3 (idx 2) foto izq
  const imageRight = index % 2 === 1;

  return (
    <MotionLink
      href={`/insights/${insight.slug}`}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="group grid grid-cols-1 items-center gap-7 border-b border-pimenton-border py-10 first:pt-0 sm:py-12 lg:grid-cols-5 lg:gap-12"
    >
      {/* Foto — 2/5 (~40%) en desktop */}
      <div
        className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl lg:col-span-2 ${
          imageRight ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <Image
          src={insight.heroImage}
          alt={insight.titulo}
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {/* Texto — 3/5 (~60%) en desktop */}
      <div
        className={`lg:col-span-3 ${imageRight ? "lg:order-1" : "lg:order-2"}`}
      >
        <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-pimenton-accent sm:text-sm">
          {insight.categoria}
        </span>
        {/* Títulos largos → sentence case (normal-case anula el uppercase) */}
        <h2 className="mt-3 text-2xl font-bold normal-case leading-tight tracking-tight text-pimenton-text transition-colors duration-300 group-hover:text-pimenton-accent sm:text-3xl">
          {insight.titulo}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-pimenton-text-muted sm:text-lg">
          {insight.excerpt}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <time
            dateTime={insight.fecha}
            className="text-sm text-pimenton-text-subtle"
          >
            {insight.fechaDisplay}
          </time>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-pimenton-accent">
            {readCta}
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
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
