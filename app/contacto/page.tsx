import { Consultancy } from "@/components/sections/Consultancy";
import { SITE_URL as SITE } from "@/lib/site";
import {
  breadcrumbList,
  getRequestLocale,
  jsonLdHtml,
  localeUrl,
  pageMetadata,
} from "@/lib/seo";

const PATH = "/contacto";

const TITLE = {
  es: "Contacto | Pimentón — Agenda tu consultoría gratuita",
  en: "Contact | Pimentón — Book your free consultancy",
  it: "Contatti | Pimentón — Prenota la tua consulenza gratuita",
};
const DESCRIPTION = {
  es: "Cuéntanos sobre tu restaurante y un especialista de tu región te escribe por WhatsApp. Consultoría gratuita, sin compromiso. +500 restaurantes en +20 países confían en Pimentón.",
  en: "Tell us about your restaurant and a specialist in your region will message you on WhatsApp. Free consultancy, no commitment. 500+ restaurants in 20+ countries trust Pimentón.",
  it: "Raccontaci del tuo ristorante e uno specialista della tua area ti scriverà su WhatsApp. Consulenza gratuita, senza impegno. Oltre 500 ristoranti in più di 20 paesi si fidano di Pimentón.",
};
const H1 = {
  es: "Contacto — Agenda tu consultoría de delivery gratuita",
  en: "Contact — Book your free delivery consultancy",
  it: "Contatti — Prenota la tua consulenza delivery gratuita",
};

export async function generateMetadata() {
  return pageMetadata({
    path: PATH,
    title: TITLE,
    description: DESCRIPTION,
    keywords: {
      es: [
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
      en: [
        "contact Pimentón",
        "free delivery consultancy",
        "book a delivery consultancy",
        "talk to a delivery specialist",
        "restaurant delivery advisory",
        "Pimentón WhatsApp",
        "Rappi",
        "PedidosYa",
        "Uber Eats",
      ],
      it: [
        "contatti Pimentón",
        "consulenza delivery gratuita",
        "prenotare consulenza delivery",
        "parlare con uno specialista delivery",
        "consulenza delivery per ristoranti",
        "WhatsApp Pimentón",
        "Glovo",
        "Deliveroo",
        "Uber Eats",
      ],
    },
    ogAlt: { es: "Pimentón — Contacto", en: "Pimentón — Contact", it: "Pimentón — Contatti" },
  });
}

export default async function ContactoPage() {
  const lang = await getRequestLocale();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbList(lang, [
        { name: { es: "Inicio", en: "Home", it: "Home" }, path: "/" },
        { name: { es: "Contacto", en: "Contact", it: "Contatti" }, path: PATH },
      ]),
      {
        "@type": "ContactPage",
        name: TITLE[lang],
        description: DESCRIPTION[lang],
        url: localeUrl(PATH, lang),
        isPartOf: { "@id": `${SITE}/#website` },
      },
    ],
  };
  return (
    // pt para que la sección (fondo crema) arranque por DEBAJO del header
    // sólido fijo — esta página no tiene hero que lo compense.
    <main className="pt-16 sm:pt-20">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
      />

      {/* H1 de la página. La sección Consultancy (compartida con el Home) usa
          un H2, así que acá agregamos un único H1 con la keyword principal.
          Visualmente oculto — no toca el diseño. */}
      <h1 className="sr-only">{H1[lang]}</h1>

      {/* Misma sección del Home (intro + wizard de 4 pasos). Importa el
          componente existente — una sola fuente de verdad. */}
      <Consultancy />
    </main>
  );
}
