import type { Metadata } from "next";
import { ServiciosHero } from "@/components/sections/servicios/ServiciosHero";
import { NoSomosAgencia } from "@/components/sections/servicios/NoSomosAgencia";
import { ServiciosSoluciones } from "@/components/sections/servicios/ServiciosSoluciones";
import { copy } from "@/data/copy";

const SITE = "https://pimenton.io";
const PATH = "/servicios";

export const metadata: Metadata = {
  title: "Servicios de delivery para restaurantes | Pimentón",
  description:
    "Cinco soluciones para profesionalizar tu delivery: gestión integral, consultoría, performance, estrategia y tecnología. +500 restaurantes en +20 países confían en Pimentón.",
  keywords: [
    "servicios delivery",
    "gestión de delivery para restaurantes",
    "optimización de Foodapps",
    "agencia de delivery",
    "Rappi",
    "PedidosYa",
    "Uber Eats",
    "consultoría de delivery",
    "performance delivery",
    "Control Room Pimentón",
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
  // openGraph/twitter se declaran completos: el merge de metadata es
  // shallow, así que el OG del layout se reemplaza, no se hereda.
  openGraph: {
    type: "website",
    siteName: "Pimentón",
    locale: "es_AR",
    url: PATH,
    title: "Servicios de delivery para restaurantes | Pimentón",
    description:
      "Cinco soluciones para profesionalizar tu delivery. Gestionamos tus Foodapps de punta a punta. +500 restaurantes en +20 países.",
    images: [
      { url: "/og-default.png", width: 1200, height: 630, alt: "Pimentón — Servicios" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Servicios de delivery para restaurantes | Pimentón",
    description:
      "Cinco soluciones para profesionalizar tu delivery. +500 restaurantes en +20 países.",
    images: ["/og-default.png"],
  },
};

// Structured data (JSON-LD): breadcrumb + el servicio principal con su
// catálogo de 5 soluciones. Ayuda a Google/AI a entender la página como
// una oferta de servicios de Pimentón.
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
          name: "Servicios",
          item: `${SITE}${PATH}`,
        },
      ],
    },
    {
      "@type": "Service",
      name: "Servicios de delivery para restaurantes",
      serviceType: "Gestión y optimización de delivery",
      description:
        "Gestionamos el delivery de restaurantes de punta a punta: Foodapps, performance, estrategia, consultoría y tecnología.",
      provider: {
        "@type": "Organization",
        name: "Pimentón",
        url: SITE,
        logo: `${SITE}/assets/logos/principal/logo-coral.webp`,
      },
      areaServed: [
        "Argentina", "Chile", "Colombia", "México",
        "Perú", "Uruguay", "España", "Estados Unidos",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Soluciones de delivery",
        itemListElement: copy.services.items.map((s) => ({
          // JSON-LD server-side en español (la metadata del sitio queda en es).
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: s.name.es,
            description: s.description.es,
          },
        })),
      },
    },
  ],
};

export default function ServiciosPage() {
  return (
    <main>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* 1. Hero (oscuro) — mosaico Control Room de fondo */}
      <ServiciosHero />

      {/* 2. No somos una agencia (crema) — split agencia vs Pimentón */}
      <NoSomosAgencia />

      {/* 3. Cinco servicios (oscuro) — componente del Home reutilizado, con
             header propio de esta página, palabra resaltada, nombres en
             uppercase y sin CTA interno. */}
      <ServiciosSoluciones />

      {/* 4. Footer: global desde app/layout.tsx */}
    </main>
  );
}
