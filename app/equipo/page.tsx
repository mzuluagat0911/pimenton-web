import type { Metadata } from "next";
import { EquipoHero } from "@/components/sections/equipo/EquipoHero";
import { FraseManifiesto } from "@/components/sections/equipo/FraseManifiesto";
import { ValoresRows } from "@/components/sections/equipo/ValoresRows";
import { ComoAcompanamos } from "@/components/sections/equipo/ComoAcompanamos";
import { CtaSumarte } from "@/components/sections/equipo/CtaSumarte";

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

export default function EquipoPage() {
  return (
    <main>
      <EquipoHero />
      <FraseManifiesto />
      <ValoresRows />
      <ComoAcompanamos />
      <CtaSumarte />
    </main>
  );
}
