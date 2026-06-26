import type { Metadata } from "next";
import { EquipoHero } from "@/components/sections/equipo/EquipoHero";
import { FraseManifiesto } from "@/components/sections/equipo/FraseManifiesto";
import { ValoresRows } from "@/components/sections/equipo/ValoresRows";
import { ComoAcompanamos } from "@/components/sections/equipo/ComoAcompanamos";
import { PartnersCarousel } from "@/components/sections/equipo/PartnersCarousel";
import { CtaSumarte } from "@/components/sections/equipo/CtaSumarte";
import { SITE_URL as SITE } from "@/lib/site";

const PATH = "/equipo";
const TITLE = "Equipo | Pimentón — Nuestra cultura";
const DESCRIPTION =
  "Cultura Pimentón: cómo trabajamos, en qué creemos y qué buscamos en las personas que se suman al equipo. Adaptabilidad, protagonismo y respeto.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
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
      { url: "/og-default.png", width: 1200, height: 630, alt: "Pimentón — Equipo" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-default.png"],
  },
};

// JSON-LD: breadcrumb (página interna). Organization + WebSite vienen del layout.
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
          name: "Equipo",
          item: `${SITE}${PATH}`,
        },
      ],
    },
  ],
};

export default function EquipoPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {/* H1 de la página (el hero es visual: logo + eyebrow, sin heading).
          Visualmente oculto — no toca el diseño, pero da un único H1 con la
          keyword principal para SEO y accesibilidad. */}
      <h1 className="sr-only">Equipo y cultura de Pimentón</h1>
      <EquipoHero />
      <FraseManifiesto />
      <ValoresRows />
      <ComoAcompanamos />
      <PartnersCarousel />
      <CtaSumarte />
    </main>
  );
}
