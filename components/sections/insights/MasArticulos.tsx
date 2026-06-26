"use client";

import { getOtrosInsights } from "@/data/insights";
import { splitHighlight } from "@/components/ui-custom/Highlight";
import { useCopy } from "@/components/i18n/LanguageContext";
import { InsightCard } from "./InsightCards";

/** "Más artículos" — los otros 2 artículos, con el mismo card del hub. */
export function MasArticulos({ slug }: { slug: string }) {
  const { masArticulos, masArticulosAccent } = useCopy().insights;
  const otros = getOtrosInsights(slug, 2);

  if (otros.length === 0) return null;

  return (
    <section className="bg-pimenton-bg-soft px-[5%] py-16 sm:px-16 sm:py-24 lg:px-24">
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight text-pimenton-text sm:text-3xl">
          {splitHighlight(masArticulos, masArticulosAccent, "coral")}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
          {otros.map((a, i) => (
            <InsightCard key={a.slug} insight={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
