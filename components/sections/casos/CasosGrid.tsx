"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { casos, type Caso } from "@/data/casos";
import { useCopy } from "@/components/i18n/LanguageContext";
import { MetaPills } from "./MetaPills";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const MotionLink = motion.create(Link);

function CasoCard({
  caso,
  index,
  cardCta,
  reduced,
}: {
  caso: Caso;
  index: number;
  cardCta: string;
  reduced: boolean;
}) {
  return (
    <MotionLink
      href={`/casos/${caso.slug}`}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: reduced ? 0 : (index % 2) * 0.08,
        ease: EASE,
      }}
      whileHover={reduced ? undefined : { y: -6 }}
      className="group flex flex-col overflow-hidden rounded-xl border border-pimenton-border bg-pimenton-surface shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      {/* Imagen — zoom sutil en hover */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={caso.heroImage}
          alt={caso.marca}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-7 sm:p-8">
        {/* Marca — sin logo, tamaño consistente en todas las cards. */}
        <h3 className="text-2xl font-bold leading-none tracking-tight text-pimenton-text">
          {caso.marca}
        </h3>

        {/* Categoría (coral) + país (menta) */}
        <MetaPills
          categoria={caso.categoria}
          pais={caso.pais}
          bandera={caso.bandera}
          className="mt-4"
        />

        {/* Tagline — Helvetica medium, normal case (no es heading) */}
        <p className="mt-4 font-display text-lg font-medium leading-snug text-pimenton-text-soft sm:text-xl">
          {caso.tagline}
        </p>

        {/* Métrica destacada (la primera del array), gigante coral */}
        <div className="mt-6 flex items-baseline gap-2.5">
          <span className="font-display text-4xl font-bold leading-none text-pimenton-accent">
            {caso.metricas[0]?.valor}
          </span>
          <span className="text-sm text-pimenton-text-muted">
            {caso.metricas[0]?.label}
          </span>
        </div>

        {/* Ver caso → */}
        <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-pimenton-accent">
          {cardCta}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>
    </MotionLink>
  );
}

export function CasosGrid() {
  const reduced = useReducedMotion() ?? false;
  const cardCta = useCopy().casos.hub.cardCta;

  return (
    <section className="bg-pimenton-bg px-[5%] py-20 sm:px-16 sm:py-28 lg:px-24">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-7 md:grid-cols-2 lg:gap-8">
        {casos.map((caso, i) => (
          <CasoCard
            key={caso.slug}
            caso={caso}
            index={i}
            cardCta={cardCta}
            reduced={reduced}
          />
        ))}
      </div>
    </section>
  );
}
