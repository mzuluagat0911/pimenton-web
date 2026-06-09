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

export default function FaqPage() {
  return (
    // pt para que el contenido arranque por DEBAJO del header sólido fijo —
    // esta página no tiene hero que lo compense.
    <main className="pt-16 sm:pt-20">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="bg-pimenton-bg px-[5%] py-16 sm:px-16 sm:py-24 lg:px-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
            {/* ── Columna izquierda: título gigante + CTA (sticky en desktop) ── */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h1 className="text-7xl font-bold leading-none tracking-tight text-pimenton-text sm:text-8xl lg:text-9xl">
                FAQ
              </h1>
              <div className="mt-10 sm:mt-12">
                <CtaPill
                  href="/contacto"
                  label="¿Tienes otra duda? Hablemos."
                  icon={<CornerDownRight aria-hidden className="size-5" />}
                />
              </div>
            </div>

            {/* ── Columna derecha: acordeón ── */}
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>
    </main>
  );
}
