import type { Metadata } from "next";
import { HeroComoLoHacemos } from "@/components/sections/como-lo-hacemos/HeroComoLoHacemos";
import { CuatroPasos } from "@/components/sections/como-lo-hacemos/CuatroPasos";
import { DetrasDeCadaPedido } from "@/components/sections/como-lo-hacemos/DetrasDeCadaPedido";
import { pasos } from "@/data/comoLoHacemos";

const SITE = "https://pimenton.io";
const PATH = "/como-lo-hacemos";

const TITLE = "Cómo lo hacemos | Pimentón — Operación de delivery profesional";
const DESCRIPTION =
  "Un proceso claro, con foco en rentabilidad: analizamos, diagnosticamos, operamos y optimizamos cada delivery con datos reales y un Growth Manager dedicado.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "cómo trabaja Pimentón",
    "operación de delivery",
    "proceso de delivery profesional",
    "Growth Manager delivery",
    "gestión de Foodapps",
    "optimización de delivery",
    "análisis de delivery para restaurantes",
    "Rappi",
    "PedidosYa",
    "Uber Eats",
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
  // openGraph/twitter completos: el merge de metadata es shallow, así que el
  // OG del layout se reemplaza (no se hereda).
  openGraph: {
    type: "website",
    siteName: "Pimentón",
    locale: "es_AR",
    url: PATH,
    title: TITLE,
    description:
      "Operamos tu delivery como si fuera nuestro: analizamos, diagnosticamos, operamos y optimizamos con datos reales y un Growth Manager dedicado.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Pimentón — Cómo lo hacemos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "Operamos tu delivery como si fuera nuestro. Un proceso claro, con foco en rentabilidad.",
    images: ["/og-default.png"],
  },
};

// Structured data (JSON-LD): breadcrumb + el proceso de 4 pasos descrito como
// HowTo. Ayuda a Google/AI a entender la página como un proceso operativo
// concreto (analizar → diagnosticar → operar → optimizar).
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
          name: "Cómo lo hacemos",
          item: `${SITE}${PATH}`,
        },
      ],
    },
    {
      "@type": "HowTo",
      name: "Cómo operamos tu delivery en Pimentón",
      description: DESCRIPTION,
      step: pasos.map((p, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: p.title.es,
        text: `${p.description.es} ${p.highlight.es}`,
      })),
    },
  ],
};

export default function ComoLoHacemosPage() {
  return (
    <main>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* 1. Hero (oscuro) — video de fondo + overlay */}
      <HeroComoLoHacemos />

      {/* 2. Cuatro pasos (crema) — el proceso, 2 columnas */}
      <CuatroPasos />

      {/* 3. Detrás de cada pedido (oscuro) — diferenciales operativos + CTA */}
      <DetrasDeCadaPedido />

      {/* 4. Footer: global desde app/layout.tsx */}
    </main>
  );
}
