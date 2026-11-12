import { FaqIntroText, FaqCta } from "@/components/sections/faq/FaqIntro";
import { Highlight } from "@/components/ui-custom/Highlight";
import { FaqAccordion } from "@/components/sections/faq/FaqAccordion";
import { faqs } from "@/data/faq";
import {
  breadcrumbList,
  getRequestLocale,
  jsonLdHtml,
  pageMetadata,
} from "@/lib/seo";

const PATH = "/faq";

const TITLE = {
  es: "FAQ | Pimentón — Preguntas frecuentes sobre nuestro servicio",
  en: "FAQ | Pimentón — Frequently asked questions about our service",
  it: "FAQ | Pimentón — Domande frequenti sul nostro servizio",
};
const DESCRIPTION = {
  es: "Resolvemos las dudas más comunes sobre cómo trabajamos: diferencias con una agencia, tiempos de resultados, apps de delivery, modalidades de trabajo y más.",
  en: "Answers to the most common questions about how we work: how we're different from an agency, time to results, delivery apps, engagement models, and more.",
  it: "Rispondiamo ai dubbi più comuni su come lavoriamo: differenze rispetto a un'agenzia, tempi per vedere risultati, app di delivery, modalità di collaborazione e altro.",
};

export async function generateMetadata() {
  return pageMetadata({
    path: PATH,
    title: TITLE,
    description: DESCRIPTION,
    keywords: {
      es: [
        "preguntas frecuentes Pimentón",
        "FAQ delivery restaurantes",
        "cómo trabaja Pimentón",
        "agencia vs gestión de delivery",
        "apps de delivery marketplaces",
        "consultoría de delivery",
        "1st party 3rd party delivery",
      ],
      en: [
        "Pimentón FAQ",
        "restaurant delivery FAQ",
        "how Pimentón works",
        "agency vs delivery management",
        "delivery app marketplaces",
        "delivery consultancy",
        "first party third party delivery",
      ],
      it: [
        "domande frequenti Pimentón",
        "FAQ delivery ristoranti",
        "come lavora Pimentón",
        "agenzia vs gestione delivery",
        "app di delivery marketplace",
        "consulenza delivery",
        "delivery first party third party",
      ],
    },
    ogAlt: { es: "Pimentón — FAQ", en: "Pimentón — FAQ", it: "Pimentón — FAQ" },
  });
}

export default async function FaqPage() {
  const lang = await getRequestLocale();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbList(lang, [
        { name: { es: "Inicio", en: "Home", it: "Home" }, path: "/" },
        { name: { es: "FAQ", en: "FAQ", it: "FAQ" }, path: PATH },
      ]),
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.pregunta[lang] ?? f.pregunta.es,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.respuesta[lang] ?? f.respuesta.es,
          },
        })),
      },
    ],
  };

  return (
    // El pt vive en la sección (no en <main>) para que el fondo menta llegue
    // hasta el header sólido fijo, sin una franja del color del body.
    <main>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
      />

      {/* Fondo menta sólido (sin texturas). Sin overflow-hidden: un ancestro
          con overflow recortado rompe el position:sticky de la columna izq. */}
      <section className="bg-pimenton-mint px-[5%] pb-20 pt-28 sm:px-16 sm:pb-28 sm:pt-32 lg:px-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
            {/* ── Columna izquierda: heading + descripción + CTA. Alineada
                 arriba a la izquierda (self-start) y sticky en desktop, así
                 acompaña el scroll del acordeón. ── */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h1 className="text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-4xl lg:text-5xl">
                <Highlight color="yellow">FAQ</Highlight>
              </h1>
              <FaqIntroText />
              {/* CTA — en desktop va en la columna izquierda */}
              <div className="mt-8 hidden lg:block">
                <FaqCta />
              </div>
            </div>

            {/* ── Columna derecha: acordeón (cards blancas) ── */}
            <FaqAccordion items={faqs} />

            {/* CTA — en mobile va al FINAL de las preguntas (mejor UX) */}
            <div className="lg:hidden">
              <FaqCta />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
