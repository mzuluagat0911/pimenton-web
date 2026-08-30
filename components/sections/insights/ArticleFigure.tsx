"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useT } from "@/components/i18n/LanguageContext";
import type { InsightFigure } from "@/data/insights";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Foto editorial dentro del cuerpo. Usa fotografía real del sitio (cocina,
 * platos, tablero, ops) — no stock genérico.
 */
export function ArticleFigure({ figure }: { figure: InsightFigure }) {
  const reduced = useReducedMotion() ?? false;
  const t = useT();

  return (
    <motion.figure
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="my-10 sm:my-12"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-pimenton-bg-soft">
        <Image
          src={figure.src}
          alt={t(figure.alt)}
          fill
          sizes="(max-width: 720px) 100vw, 720px"
          className="object-cover"
        />
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-pimenton-text-muted sm:text-sm">
        {t(figure.caption)}
      </figcaption>
    </motion.figure>
  );
}
