"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { EASE } from "@/components/sections/servicios/Eyebrow";
import { useCopy } from "@/components/i18n/LanguageContext";
import type { Insight } from "@/data/insights";

/**
 * Header del artículo — oscuro (navbar normal transparente→sólido). Volver +
 * eyebrow (categoría · fecha) + H1 sentence case + bajada + banda de imagen.
 */
export function ArticleHeader({ insight }: { insight: Insight }) {
  const reduced = useReducedMotion() ?? false;
  const backToHub = useCopy().insights.backToHub;

  const fadeUp = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <section className="relative isolate bg-pimenton-dark px-[5%] pb-16 pt-28 sm:px-16 sm:pb-20 sm:pt-32 lg:px-24 lg:pb-24">
      <div className="mx-auto w-full max-w-4xl">
        <motion.div {...fadeUp(0)}>
          <Link
            href="/insights"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-pimenton-text-on-dark-muted transition-colors duration-300 hover:text-pimenton-accent"
          >
            <ArrowLeft aria-hidden className="size-4" />
            {backToHub}
          </Link>
        </motion.div>

        {/* Categoría como pill coral (mismo styling que las cards del hub) +
            fecha al lado. */}
        <motion.div
          {...fadeUp(0.06)}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <span className="rounded-full bg-pimenton-accent/15 px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-pimenton-accent">
            {insight.categoria}
          </span>
          <time
            dateTime={insight.fecha}
            className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-pimenton-text-on-dark-muted"
          >
            {insight.fechaDisplay}
          </time>
        </motion.div>

        {/* Título largo → sentence case (normal-case anula el uppercase) */}
        <motion.h1
          {...fadeUp(0.12)}
          className="mt-5 text-3xl font-bold normal-case leading-[1.12] tracking-tight text-pimenton-bg sm:text-4xl lg:text-5xl"
        >
          {insight.titulo}
        </motion.h1>

        <motion.p
          {...fadeUp(0.18)}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-pimenton-text-on-dark-muted sm:text-xl"
        >
          {insight.excerpt}
        </motion.p>

        {/* Imagen del artículo — 3/2 = ratio nativo de las fotos
            (1680×1120), así no se recorta el sujeto. Card redondeada
            contenida (coherente con el hub), con aire abajo. */}
        <motion.div
          {...fadeUp(0.24)}
          className="relative mt-12 aspect-[3/2] w-full overflow-hidden rounded-2xl"
        >
          <Image
            src={insight.heroImage}
            alt={insight.titulo}
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
