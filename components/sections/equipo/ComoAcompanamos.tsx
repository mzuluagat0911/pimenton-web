"use client";

import { motion, useReducedMotion } from "motion/react";
import { Award, Calendar, Laptop, TrendingUp, type LucideIcon } from "lucide-react";
import { splitHighlight } from "@/components/ui-custom/Highlight";
import { Eyebrow, EASE } from "@/components/sections/servicios/Eyebrow";
import { useCopy } from "@/components/i18n/LanguageContext";

const ICONS: Record<string, LucideIcon> = {
  laptop: Laptop,
  "trending-up": TrendingUp,
  award: Award,
  calendar: Calendar,
};

export function ComoAcompanamos() {
  const reduced = useReducedMotion() ?? false;
  const { eyebrow, heading, headingAccent, cards } = useCopy().equipo.modelo;

  return (
    <section className="bg-pimenton-dark px-[5%] py-24 sm:px-16 sm:py-32 lg:px-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <motion.h2
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mt-6 text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text-on-dark sm:text-4xl lg:text-5xl"
          >
            {splitHighlight(heading, headingAccent, "coral")}
          </motion.h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => {
            const Icon = ICONS[card.icon] ?? Laptop;
            return (
              <motion.article
                key={i}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: reduced ? 0 : i * 0.1,
                  ease: EASE,
                }}
                whileHover={reduced ? undefined : { scale: 1.02 }}
                className="flex h-full flex-col rounded-2xl border border-pimenton-dark-border bg-pimenton-dark-soft p-7 transition-colors duration-300 hover:border-pimenton-accent/40 sm:p-8"
              >
                <Icon
                  aria-hidden
                  className="size-9 text-pimenton-accent"
                  strokeWidth={1.5}
                />
                {/* Frases (no palabras sueltas) → sentence case (normal-case
                    anula el uppercase global de los h3). */}
                <h3 className="mt-6 text-lg font-semibold normal-case leading-snug tracking-tight text-pimenton-text-on-dark sm:text-xl">
                  {card.title}
                </h3>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
