// Versión previa de /servicios, estructura conversion-driven de 8 secciones.
// Reemplazada por la versión simple informativa en diciembre 2026.
// Mantener por referencia. No se importa en la /servicios actual.

"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Eyebrow, EASE } from "./Eyebrow";
import { casos } from "@/data/casos";

export function CasosResultados() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="bg-pimenton-bg px-[5%] py-24 sm:px-16 sm:py-32 lg:px-24">
      <div className="mx-auto w-full max-w-7xl">
        <Eyebrow>Resultados reales</Eyebrow>
        <motion.h2
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mt-6 max-w-3xl text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-4xl lg:text-5xl"
        >
          Lo que pasa cuando un restaurante trabaja con nosotros.
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {casos.map((caso, i) => (
            <motion.article
              key={caso.name}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: reduced ? 0 : i * 0.1,
                ease: EASE,
              }}
              whileHover={
                reduced
                  ? undefined
                  : { y: -5, transition: { duration: 0.3, ease: EASE } }
              }
              className="flex flex-col rounded-2xl border border-pimenton-border bg-pimenton-surface p-6 shadow-[0_8px_24px_-16px_rgba(15,15,14,0.2)] transition-shadow duration-300 hover:shadow-[0_18px_44px_-20px_rgba(15,15,14,0.3)] sm:p-7"
            >
              {/* Logo (chip oscuro — los logos de cliente son claros) + país */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex size-14 items-center justify-center overflow-hidden rounded-xl bg-pimenton-dark p-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={caso.logo}
                    alt={caso.name}
                    className="h-full w-full object-contain"
                    draggable={false}
                    loading="lazy"
                  />
                </div>
                <span className="flex items-center gap-1.5 text-sm text-pimenton-text-muted">
                  <span aria-hidden className="text-base">
                    {caso.flag}
                  </span>
                  {caso.country}
                </span>
              </div>

              {/* Métrica gigante */}
              <div className="mt-7">
                <div className="font-display text-5xl font-bold leading-none tracking-tight text-pimenton-accent">
                  {caso.metric}
                </div>
                <p className="mt-2 text-sm text-pimenton-text-muted">
                  {caso.metricLabel}
                </p>
              </div>

              {/* Contexto */}
              <p className="mt-5 flex-1 text-base leading-relaxed text-pimenton-text-soft">
                {caso.context}
              </p>

              {/* Link futuro a /casos (404 hasta que exista — placeholder). */}
              <Link
                href="/casos"
                className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-pimenton-accent transition-colors hover:text-pimenton-accent-hover"
              >
                Leer caso completo
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}