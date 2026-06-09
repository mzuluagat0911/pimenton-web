import type { Metadata } from "next";
import { CasosHero } from "@/components/sections/casos/CasosHero";
import { CasosGrid } from "@/components/sections/casos/CasosGrid";
import { CtaPotenciar } from "@/components/sections/casos/CtaPotenciar";
import { casos } from "@/data/casos";

const SITE = "https://pimenton.io";
const PATH = "/casos";
const TITLE = "Casos de éxito | Pimentón";
const DESCRIPTION =
  "Restaurantes que profesionalizaron su delivery con Pimentón y lo convirtieron en un canal rentable. Resultados reales: de +30% a +200% en ventas, más rentabilidad y escala.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "casos de éxito delivery",
    "resultados delivery restaurantes",
    "Pimentón casos",
    "crecimiento en Foodapps",
    "rentabilidad delivery",
    "Uber Eats",
    "Rappi",
    "PedidosYa",
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
      { url: "/og-default.png", width: 1200, height: 630, alt: "Pimentón — Casos de éxito" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-default.png"],
  },
};

// JSON-LD: breadcrumb + colección de casos (ItemList) para que Google/AI
// entiendan la página como un listado de casos de éxito.
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
          name: "Casos de éxito",
          item: `${SITE}${PATH}`,
        },
      ],
    },
    {
      "@type": "ItemList",
      name: "Casos de éxito de Pimentón",
      itemListElement: casos.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${c.marca} — ${c.tagline}`,
        url: `${SITE}${PATH}/${c.slug}`,
      })),
    },
  ],
};

export default function CasosPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <CasosHero />
      <CasosGrid />
      <CtaPotenciar />
    </main>
  );
}
