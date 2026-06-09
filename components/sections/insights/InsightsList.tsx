"use client";

import { insights } from "@/data/insights";
import { useCopy } from "@/components/i18n/LanguageContext";
import { InsightRow } from "./InsightCards";

/** Lista editorial del hub: filas horizontales con foto de lado alternado. */
export function InsightsList() {
  const readCta = useCopy().insights.readCta;

  return (
    <section className="bg-pimenton-bg px-[5%] py-16 sm:px-16 sm:py-20 lg:px-24">
      <div className="mx-auto w-full max-w-6xl">
        {insights.map((insight, i) => (
          <InsightRow
            key={insight.slug}
            insight={insight}
            index={i}
            readCta={readCta}
          />
        ))}
      </div>
    </section>
  );
}
