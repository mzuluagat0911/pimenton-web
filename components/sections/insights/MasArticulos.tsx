"use client";

import { motion, useReducedMotion } from "motion/react";
import { getOtrosInsights } from "@/data/insights";
import { splitHighlight } from "@/components/ui-custom/Highlight";
import { useCopy } from "@/components/i18n/LanguageContext";
import { InsightCardCompact } from "./InsightCards";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** "Más artículos" — los otros 2 artículos como cards compactas. */
export function MasArticulos({ slug }: { slug: string }) {
  const reduced = useReducedMotion() ?? false;
  const { masArticulos, masArticulosAccent, readCta } = useCopy().insights;
  const otros = getOtrosInsights(slug, 2);

  if (otros.length === 0) return null;

  return (
    <section className="bg-pimenton-bg-soft px-[5%] py-16 sm:px-16 sm:py-20 lg:px-24">
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight text-pimenton-text sm:text-3xl">
          {splitHighlight(masArticulos, masArticulosAccent, "coral")}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {otros.map((a, i) => (
            <motion.div
              key={a.slug}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: reduced ? 0 : i * 0.08,
                ease: EASE,
              }}
            >
              <InsightCardCompact insight={a} readCta={readCta} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
