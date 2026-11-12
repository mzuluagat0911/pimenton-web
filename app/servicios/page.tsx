import { ServiciosHero } from "@/components/sections/servicios/ServiciosHero";
import { NoSomosAgencia } from "@/components/sections/servicios/NoSomosAgencia";
import { ServiciosSoluciones } from "@/components/sections/servicios/ServiciosSoluciones";
import { copy } from "@/data/copy";
import { SITE_URL as SITE } from "@/lib/site";
import {
  breadcrumbList,
  getRequestLocale,
  jsonLdHtml,
  localeUrl,
  pageMetadata,
} from "@/lib/seo";

const PATH = "/servicios";

const TITLE = {
  es: "Servicios de delivery para restaurantes | Pimentón",
  en: "Delivery services for restaurants | Pimentón",
  it: "Servizi di delivery per ristoranti | Pimentón",
};
const DESCRIPTION = {
  es: "Cinco soluciones para profesionalizar tu delivery: gestión integral, consultoría, performance, estrategia y tecnología. +500 restaurantes en +20 países confían en Pimentón.",
  en: "Five ways to professionalize your delivery: full management, consultancy, performance, strategy, and technology. 500+ restaurants in 20+ countries trust Pimentón.",
  it: "Cinque soluzioni per rendere professionale il tuo delivery: gestione completa, consulenza, performance, strategia e tecnologia. Oltre 500 ristoranti in più di 20 paesi si fidano di Pimentón.",
};

export async function generateMetadata() {
  return pageMetadata({
    path: PATH,
    title: TITLE,
    description: DESCRIPTION,
    ogDescription: {
      es: "Cinco soluciones para profesionalizar tu delivery. Gestionamos tus Foodapps de punta a punta. +500 restaurantes en +20 países.",
      en: "Five ways to professionalize your delivery. We run your delivery apps end to end. 500+ restaurants in 20+ countries.",
      it: "Cinque soluzioni per rendere professionale il tuo delivery. Gestiamo le tue app di delivery dall'inizio alla fine. Oltre 500 ristoranti in più di 20 paesi.",
    },
    twitterDescription: {
      es: "Cinco soluciones para profesionalizar tu delivery. +500 restaurantes en +20 países.",
      en: "Five ways to professionalize your delivery. 500+ restaurants in 20+ countries.",
      it: "Cinque soluzioni per rendere professionale il tuo delivery. Oltre 500 ristoranti in più di 20 paesi.",
    },
    keywords: {
      es: [
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
      en: [
        "restaurant delivery services",
        "delivery management for restaurants",
        "delivery app optimization",
        "delivery consultancy",
        "Rappi",
        "PedidosYa",
        "Uber Eats",
        "delivery performance",
        "Pimentón Control Room",
      ],
      it: [
        "servizi delivery ristoranti",
        "gestione delivery per ristoranti",
        "ottimizzazione app delivery",
        "agenzia delivery",
        "consulenza delivery",
        "Glovo",
        "Deliveroo",
        "Just Eat",
        "Uber Eats",
        "Pimentón Control Room",
      ],
    },
    ogAlt: { es: "Pimentón — Servicios", en: "Pimentón — Services", it: "Pimentón — Servizi" },
  });
}

export default async function ServiciosPage() {
  const lang = await getRequestLocale();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbList(lang, [
        { name: { es: "Inicio", en: "Home", it: "Home" }, path: "/" },
        { name: { es: "Servicios", en: "Services", it: "Servizi" }, path: PATH },
      ]),
      {
        "@type": "Service",
        name: TITLE[lang],
        serviceType: {
          es: "Gestión y optimización de delivery",
          en: "Delivery management and optimization",
          it: "Gestione e ottimizzazione del delivery",
        }[lang],
        description: DESCRIPTION[lang],
        url: localeUrl(PATH, lang),
        provider: {
          "@type": "Organization",
          name: "Pimentón",
          url: SITE,
          logo: `${SITE}/assets/logos/principal/logo-coral.webp`,
        },
        areaServed: [
          "Argentina",
          "Chile",
          "Colombia",
          "México",
          "Perú",
          "Uruguay",
          "España",
          "Estados Unidos",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: {
            es: "Soluciones de delivery",
            en: "Delivery solutions",
            it: "Soluzioni di delivery",
          }[lang],
          itemListElement: copy.services.items.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.name[lang] ?? s.name.es,
              description: s.description[lang] ?? s.description.es,
            },
          })),
        },
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
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
