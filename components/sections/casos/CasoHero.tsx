"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { EASE } from "@/components/sections/servicios/Eyebrow";
import { useCopy, useLocalizedHref, useT } from "@/components/i18n/LanguageContext";
import { MetaPills } from "./MetaPills";
import type { Caso } from "@/data/casos";

/**
 * Hero del caso individual. Oscuro. Volver al hub + eyebrow (categoría ·
 * país) + H1 (marca) + tagline, y una imagen del local contenida (3/2,
 * redondeada) — coherente con los artículos de insights.
 */
export function CasoHero({ caso }: { caso: Caso }) {
  const reduced = useReducedMotion() ?? false;
  const t = useT();
  const backToHub = useCopy().casos.caso.backToHub;
  const localizedHref = useLocalizedHref();

  const fadeUp = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section className="relative isolate bg-pimenton-dark px-[5%] pb-16 pt-28 sm:px-16 sm:pb-20 sm:pt-32 lg:px-24 lg:pb-24">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div {...fadeUp(0)}>
          <Link
            href={localizedHref("/casos")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-pimenton-text-on-dark-muted transition-colors duration-300 hover:text-pimenton-accent"
          >
            <ArrowLeft aria-hidden className="size-4" />
            {backToHub}
          </Link>
        </motion.div>

        <div className="mb-12 mt-8 sm:mb-16">
          <motion.div {...fadeUp(0.04)}>
            <MetaPills
              categoria={t(caso.categoria)}
              pais={t(caso.pais)}
              bandera={caso.bandera}
              onDark
            />
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="mt-6 max-w-4xl text-5xl font-bold leading-[1.0] tracking-tight text-pimenton-bg sm:text-6xl lg:text-7xl"
          >
            {caso.marca}
          </motion.h1>

          <motion.p
            {...fadeUp(0.16)}
            className="mt-6 max-w-2xl font-display text-xl font-medium leading-snug tracking-tight text-pimenton-text-on-dark sm:text-2xl"
          >
            {t(caso.tagline)}
          </motion.p>
        </div>

        {/* Imagen del caso — 3/2 = ratio nativo de las fotos (1280×854),
            contenida y redondeada (sin recorte). */}
        <motion.div
          {...fadeUp(0.24)}
          className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl"
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
