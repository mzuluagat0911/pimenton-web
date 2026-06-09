import type { Metadata } from "next";
import { CornerDownRight } from "lucide-react";
import { CtaPill } from "@/components/ui-custom/CtaPill";
import { FaqAccordion } from "@/components/sections/faq/FaqAccordion";
import { faqs } from "@/data/faq";

const SITE = "https://pimenton.io";
const PATH = "/faq";

const TITLE = "FAQ | Pimentón — Preguntas frecuentes sobre nuestro servicio";
const DESCRIPTION =
  "Resolvemos las dudas más comunes sobre cómo trabajamos: diferencias con una agencia, tiempos de resultados, apps de delivery, modalidades de trabajo y más.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "preguntas frecuentes Pimentón",
    "FAQ delivery restaurantes",
    "cómo trabaja Pimentón",
    "agencia vs gestión de delivery",
    "apps de delivery marketplaces",
    "consultoría de delivery",
    "1st party 3rd party delivery",
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
      { url: "/og-default.png", width: 1200, height: 630, alt: "Pimentón — FAQ" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-default.png"],
  },
};

// Structured data: breadcrumb + FAQPage (apto para rich results de FAQ).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "FAQ", item: `${SITE}${PATH}` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.pregunta,
        acceptedAnswer: { "@type": "Answer", text: f.respuesta },
      })),
    },
  ],
};

const INTRO =
  "Las preguntas que más nos hacen sobre cómo trabajamos tu delivery.";

const CTA = (
  <CtaPill
    href="/contacto"
    label="¿Tienes otra duda? Hablemos."
    icon={<CornerDownRight aria-hidden className="size-5" />}
  />
);

export default function FaqPage() {
  return (
    // El pt vive en la sección (no en <main>) para que el fondo menta llegue
    // hasta el header sólido fijo, sin una franja del color del body.
    <main>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative isolate overflow-hidden bg-pimenton-mint px-[5%] pb-20 pt-28 sm:px-16 sm:pb-28 sm:pt-32 lg:px-24">
        {/* Fondo menta + texturas amarillas — mismo asset que la sección
            "Lo que dicen de nosotros" del Home. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage: "url('/assets/reseñas/background-resenas.webp')",
          }}
        />

        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
            {/* ── Columna izquierda: heading + descripción + CTA (sticky desktop) ── */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h1 className="text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-4xl lg:text-5xl">
                FAQ
              </h1>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-pimenton-text-soft sm:text-lg">
                {INTRO}
              </p>
              {/* CTA — en desktop va en la columna izquierda */}
              <div className="mt-8 hidden lg:block">{CTA}</div>
            </div>

            {/* ── Columna derecha: acordeón (cards blancas) ── */}
            <FaqAccordion items={faqs} />

            {/* CTA — en mobile va al FINAL de las preguntas (mejor UX) */}
            <div className="lg:hidden">{CTA}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
