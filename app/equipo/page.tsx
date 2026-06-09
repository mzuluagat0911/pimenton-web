import type { Metadata } from "next";
import { EquipoHero } from "@/components/sections/equipo/EquipoHero";

const PATH = "/equipo";
const TITLE = "Equipo | Pimentón — Cultura Pimentón";
const DESCRIPTION =
  "La cultura y el equipo detrás de Pimentón: especialistas en delivery obsesionados con la rentabilidad de cada restaurante.";

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
    </main>
  );
}
