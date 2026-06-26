import { insights } from "@/data/insights";
import { InsightCard } from "./InsightCards";

/**
 * Hub de insights: grid editorial de cards — 3 columnas en desktop, una
 * sola columna en mobile.
 */
export function InsightsList() {
  return (
    <section className="bg-pimenton-bg px-[5%] py-16 sm:px-16 sm:py-24 lg:px-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-3">
          {insights.map((insight, i) => (
            <InsightCard key={insight.slug} insight={insight} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
