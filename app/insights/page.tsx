import type { Metadata } from "next";
import { InsightsHero } from "@/components/sections/insights/InsightsHero";
import { InsightsList } from "@/components/sections/insights/InsightsList";
import { InsightsCta } from "@/components/sections/insights/InsightsCta";
import { insights } from "@/data/insights";

const SITE = "https://pimenton.io";
const PATH = "/insights";
const TITLE = "Insights | Pimentón — Estrategia y rentabilidad en delivery";
const DESCRIPTION =
  "Estrategia, datos y operación real de delivery para restaurantes. Insights de Pimentón sobre rentabilidad, ticket promedio, pricing y cómo profesionalizar tu canal digital.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "insights delivery",
    "blog delivery restaurantes",
    "rentabilidad delivery",
    "ticket promedio delivery",
    "estrategia Foodapps",
    "profesionalizar delivery",
    "pricing delivery",
  ],
  alternates: { canonical: PATH },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Pimentón",
    locale: "es_AR",
    url: PATH,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      { url: "/og-default.png", width: 1200, height: 630, alt: "Pimentón — Insights" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-default.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Insights",
          item: `${SITE}${PATH}`,
        },
      ],
    },
    {
      "@type": "Blog",
      name: "Insights — Pimentón",
      description: DESCRIPTION,
      url: `${SITE}${PATH}`,
      publisher: { "@type": "Organization", name: "Pimentón", url: SITE },
      blogPost: insights.map((a) => ({
        "@type": "BlogPosting",
        headline: a.titulo.es,
        datePublished: a.fecha,
        url: `${SITE}${PATH}/${a.slug}`,
        image: `${SITE}${a.heroImage}`,
      })),
    },
  ],
};

export default function InsightsPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <InsightsHero />
      <InsightsList />
      <InsightsCta />
    </main>
  );
}
