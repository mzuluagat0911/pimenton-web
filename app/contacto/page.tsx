import type { Metadata } from "next";
import { Consultancy } from "@/components/sections/Consultancy";

const SITE = "https://pimenton.io";
const PATH = "/contacto";

const TITLE = "Contacto | Pimentón — Agenda tu consultoría gratuita";
const DESCRIPTION =
  "Cuéntanos sobre tu restaurante y un especialista de tu región te escribe por WhatsApp. Consultoría gratuita, sin compromiso. +500 restaurantes en +20 países confían en Pimentón.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "contacto Pimentón",
    "consultoría de delivery gratuita",
    "agendar consultoría delivery",
    "hablar con un especialista de delivery",
    "asesoría delivery para restaurantes",
    "WhatsApp Pimentón",
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
    description: DESCRIPTION,
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Pimentón — Contacto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-default.png"],
  },
};

// Structured data (JSON-LD): breadcrumb + ContactPage.
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
          name: "Contacto",
          item: `${SITE}${PATH}`,
        },
      ],
    },
    {
      "@type": "ContactPage",
      name: TITLE,
      description: DESCRIPTION,
      url: `${SITE}${PATH}`,
      isPartOf: { "@id": `${SITE}/#website` },
    },
  ],
};

export default function ContactoPage() {
  return (
    // pt para que la sección (fondo crema) arranque por DEBAJO del header
    // sólido fijo — esta página no tiene hero que lo compense.
    <main className="pt-16 sm:pt-20">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Misma sección del Home (intro + wizard de 4 pasos). Importa el
          componente existente — una sola fuente de verdad. */}
      <Consultancy />
    </main>
  );
}
