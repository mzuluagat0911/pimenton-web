import { HeroComoLoHacemos } from "@/components/sections/como-lo-hacemos/HeroComoLoHacemos";
import { CuatroPasos } from "@/components/sections/como-lo-hacemos/CuatroPasos";
import { DetrasDeCadaPedido } from "@/components/sections/como-lo-hacemos/DetrasDeCadaPedido";
import { pasos } from "@/data/comoLoHacemos";

import {
  breadcrumbList,
  getRequestLocale,
  jsonLdHtml,
  pageMetadata,
} from "@/lib/seo";

const PATH = "/como-lo-hacemos";

const TITLE = {
  es: "Cómo lo hacemos | Pimentón — Operación de delivery profesional",
  en: "How we do it | Pimentón — Professional delivery operations",
  it: "Come lavoriamo | Pimentón — Gestione professionale del delivery",
};
const DESCRIPTION = {
  es: "Un proceso claro, con foco en rentabilidad: analizamos, diagnosticamos, operamos y optimizamos cada delivery con datos reales y un Growth Manager dedicado.",
  en: "A clear process focused on profitability: we analyze, diagnose, operate, and optimize every delivery with real data and a dedicated Growth Manager.",
  it: "Un processo chiaro, focalizzato sulla redditività: analizziamo, diagnostichiamo, gestiamo e ottimizziamo ogni delivery con dati reali e un Growth Manager dedicato.",
};

export async function generateMetadata() {
  return pageMetadata({
    path: PATH,
    title: TITLE,
    description: DESCRIPTION,
    ogDescription: {
      es: "Operamos tu delivery como si fuera nuestro: analizamos, diagnosticamos, operamos y optimizamos con datos reales y un Growth Manager dedicado.",
      en: "We run your delivery as if it were ours: we analyze, diagnose, operate, and optimize with real data and a dedicated Growth Manager.",
      it: "Gestiamo il tuo delivery come se fosse nostro: analizziamo, diagnostichiamo, gestiamo e ottimizziamo con dati reali e un Growth Manager dedicato.",
    },
    twitterDescription: {
      es: "Operamos tu delivery como si fuera nuestro. Un proceso claro, con foco en rentabilidad.",
      en: "We run your delivery as if it were ours. A clear process, focused on profitability.",
      it: "Gestiamo il tuo delivery come se fosse nostro. Un processo chiaro, focalizzato sulla redditività.",
    },
    keywords: {
      es: [
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
      en: [
        "how Pimentón works",
        "delivery operations",
        "professional delivery process",
        "delivery Growth Manager",
        "delivery app management",
        "delivery optimization",
        "restaurant delivery analysis",
        "Rappi",
        "PedidosYa",
        "Uber Eats",
      ],
      it: [
        "come lavora Pimentón",
        "gestione operativa delivery",
        "processo delivery professionale",
        "Growth Manager delivery",
        "gestione app delivery",
        "ottimizzazione delivery",
        "analisi delivery ristoranti",
        "Glovo",
        "Deliveroo",
        "Uber Eats",
      ],
    },
    ogAlt: {
      es: "Pimentón — Cómo lo hacemos",
      en: "Pimentón — How we do it",
      it: "Pimentón — Come lavoriamo",
    },
  });
}

export default async function ComoLoHacemosPage() {
  const lang = await getRequestLocale();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbList(lang, [
        { name: { es: "Inicio", en: "Home", it: "Home" }, path: "/" },
        {
          name: { es: "Cómo lo hacemos", en: "How we do it", it: "Come lavoriamo" },
          path: PATH,
        },
      ]),
      {
        "@type": "HowTo",
        name: {
          es: "Cómo operamos tu delivery en Pimentón",
          en: "How we operate your delivery at Pimentón",
          it: "Come gestiamo il tuo delivery in Pimentón",
        }[lang],
        description: DESCRIPTION[lang],
        step: pasos.map((p, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: p.title[lang] ?? p.title.es,
          text: `${p.description[lang] ?? p.description.es} ${p.highlight[lang] ?? p.highlight.es}`,
        })),
      },
    ],
  };

  return (
    <main>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
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
