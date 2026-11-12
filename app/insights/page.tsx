import { InsightsHero } from "@/components/sections/insights/InsightsHero";
import { InsightsList } from "@/components/sections/insights/InsightsList";
import { InsightsCta } from "@/components/sections/insights/InsightsCta";
import { insights } from "@/data/insights";

import { SITE_URL as SITE } from "@/lib/site";
import {
  breadcrumbList,
  getRequestLocale,
  jsonLdHtml,
  localeUrl,
  pageMetadata,
} from "@/lib/seo";

const PATH = "/insights";
const TITLE = {
  es: "Insights | Pimentón — Estrategia y rentabilidad en delivery",
  en: "Insights | Pimentón — Delivery strategy and profitability",
  it: "Insights | Pimentón — Strategia e redditività del delivery",
};
const DESCRIPTION = {
  es: "Estrategia, datos y operación real de delivery para restaurantes. Insights de Pimentón sobre rentabilidad, ticket promedio, pricing y cómo profesionalizar tu canal digital.",
  en: "Strategy, data, and real delivery operations for restaurants. Pimentón insights on profitability, average ticket, pricing, and how to professionalize your digital channel.",
  it: "Strategia, dati e gestione reale del delivery per ristoranti. Gli insights di Pimentón su redditività, ticket medio, pricing e come rendere professionale il tuo canale digitale.",
};

export async function generateMetadata() {
  return pageMetadata({
    path: PATH,
    title: TITLE,
    description: DESCRIPTION,
    keywords: {
      es: [
        "insights delivery",
        "blog delivery restaurantes",
        "rentabilidad delivery",
        "ticket promedio delivery",
        "estrategia Foodapps",
        "profesionalizar delivery",
        "pricing delivery",
      ],
      en: [
        "delivery insights",
        "restaurant delivery strategy",
        "delivery profitability",
        "average delivery ticket",
        "delivery app strategy",
        "professionalize delivery",
        "delivery pricing",
      ],
      it: [
        "insights delivery",
        "strategia delivery ristoranti",
        "redditività delivery",
        "ticket medio delivery",
        "strategia app delivery",
        "delivery professionale",
        "pricing delivery",
      ],
    },
    ogAlt: { es: "Pimentón — Insights", en: "Pimentón — Insights", it: "Pimentón — Insights" },
  });
}

export default async function InsightsPage() {
  const lang = await getRequestLocale();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbList(lang, [
        { name: { es: "Inicio", en: "Home", it: "Home" }, path: "/" },
        { name: { es: "Insights", en: "Insights", it: "Insights" }, path: PATH },
      ]),
      {
        "@type": "Blog",
        name: "Insights — Pimentón",
        description: DESCRIPTION[lang],
        url: localeUrl(PATH, lang),
        inLanguage: lang,
        publisher: { "@type": "Organization", name: "Pimentón", url: SITE },
        blogPost: insights.map((a) => ({
          "@type": "BlogPosting",
          headline: a.titulo[lang],
          datePublished: a.fecha,
          url: localeUrl(`${PATH}/${a.slug}`, lang),
          image: `${SITE}${a.heroImage}`,
        })),
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
      />
      <InsightsHero />
      <InsightsList />
      <InsightsCta />
    </main>
  );
}
