"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Eyebrow, EASE } from "@/components/sections/servicios/Eyebrow";
import type { Caso } from "@/data/casos";

/**
 * Hero del caso individual. Oscuro (navbar normal transparente→sólido).
 * Eyebrow = categoría · país; H1 = marca; tagline debajo; y una banda de
 * imagen del local/producto, full-width con esquinas superiores redondeadas.
 */
export function CasoHero({ caso }: { caso: Caso }) {
  const reduced = useReducedMotion() ?? false;
  const eyebrow = caso.pais
    ? `${caso.categoria} · ${caso.bandera} ${caso.pais}`
    : caso.categoria;

  const fadeUp = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section className="relative isolate overflow-hidden bg-pimenton-dark px-[5%] pt-28 sm:px-16 sm:pt-32 lg:px-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="pb-12 sm:pb-16">
          <Eyebrow>{eyebrow}</Eyebrow>

          <motion.h1
            {...fadeUp(0.08)}
            className="mt-6 max-w-4xl text-5xl font-bold leading-[1.0] tracking-tight text-pimenton-bg sm:text-6xl lg:text-7xl"
          >
            {caso.marca}
          </motion.h1>

          <motion.p
            {...fadeUp(0.16)}
            className="mt-6 max-w-2xl font-display text-xl font-medium leading-snug tracking-tight text-pimenton-text-on-dark sm:text-2xl"
          >
            {caso.tagline}
          </motion.p>
        </div>

        {/* Banda de imagen del caso */}
        <motion.div
          {...fadeUp(0.24)}
          className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl"
        >
          <Image
            src={caso.heroImage}
            alt={caso.marca}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
