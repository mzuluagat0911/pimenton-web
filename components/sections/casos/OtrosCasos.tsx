"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { getOtrosCasos } from "@/data/casos";
import { splitHighlight } from "@/components/ui-custom/Highlight";
import { useCopy, useLocalizedHref, useT } from "@/components/i18n/LanguageContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Navegación cruzada: hasta 3 otros casos + volver al hub. */
export function OtrosCasos({ slug }: { slug: string }) {
  const reduced = useReducedMotion() ?? false;
  const t = useT();
  const { otrosHeading, otrosAccent, backToHub } = useCopy().casos.caso;
  const localizedHref = useLocalizedHref();
  const otros = getOtrosCasos(slug, 3);

  if (otros.length === 0) return null;

  return (
    <section className="bg-pimenton-bg-soft px-[5%] py-20 sm:px-16 sm:py-24 lg:px-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-3xl">
            {splitHighlight(otrosHeading, otrosAccent, "coral")}
          </h2>
          <Link
            href={localizedHref("/casos")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-pimenton-accent"
          >
            {backToHub}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {otros.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: reduced ? 0 : i * 0.08,
                ease: EASE,
              }}
            >
              <Link
                href={localizedHref(`/casos/${c.slug}`)}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-pimenton-border bg-pimenton-surface shadow-sm transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={c.heroImage}
                    alt={c.marca}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold tracking-tight text-pimenton-text">
                    {c.marca}
                  </h3>
                  <p className="mt-1 text-xs text-pimenton-text-muted">
                    {t(c.pais)
                      ? `${t(c.categoria)} · ${c.bandera} ${t(c.pais)}`
                      : t(c.categoria)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
