import { CasosHero } from "@/components/sections/casos/CasosHero";
import { CasosGrid } from "@/components/sections/casos/CasosGrid";
import { CtaPotenciar } from "@/components/sections/casos/CtaPotenciar";
import { casos } from "@/data/casos";

import {
  breadcrumbList,
  getRequestLocale,
  jsonLdHtml,
  localeUrl,
  pageMetadata,
} from "@/lib/seo";

const PATH = "/casos";
const TITLE = {
  es: "Casos de éxito | Pimentón",
  en: "Success stories | Pimentón",
  it: "Casi di successo | Pimentón",
};
const DESCRIPTION = {
  es: "Restaurantes que profesionalizaron su delivery con Pimentón y lo convirtieron en un canal rentable. Resultados reales: de +30% a +200% en ventas, más rentabilidad y escala.",
  en: "Restaurants that professionalized delivery with Pimentón and turned it into a profitable channel. Real results: from +30% to +200% in sales, plus margin and scale.",
  it: "Ristoranti che hanno reso professionale il proprio delivery con Pimentón trasformandolo in un canale redditizio. Risultati reali: da +30% a +200% di vendite, più margine e scala.",
};

export async function generateMetadata() {
  return pageMetadata({
    path: PATH,
    title: TITLE,
    description: DESCRIPTION,
    keywords: {
      es: [
        "casos de éxito delivery",
        "resultados delivery restaurantes",
        "Pimentón casos",
        "crecimiento en Foodapps",
        "rentabilidad delivery",
        "Uber Eats",
        "Rappi",
        "PedidosYa",
      ],
      en: [
        "delivery success stories",
        "restaurant delivery results",
        "Pimentón case studies",
        "delivery app growth",
        "delivery profitability",
        "Uber Eats",
        "Rappi",
        "PedidosYa",
      ],
      it: [
        "casi di successo delivery",
        "risultati delivery ristoranti",
        "Pimentón casi studio",
        "crescita app delivery",
        "redditività delivery",
        "Uber Eats",
        "Glovo",
        "Deliveroo",
      ],
    },
    ogAlt: {
      es: "Pimentón — Casos de éxito",
      en: "Pimentón — Success stories",
      it: "Pimentón — Casi di successo",
    },
  });
}

export default async function CasosPage() {
  const lang = await getRequestLocale();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbList(lang, [
        { name: { es: "Inicio", en: "Home", it: "Home" }, path: "/" },
        {
          name: { es: "Casos de éxito", en: "Success stories", it: "Casi di successo" },
          path: PATH,
        },
      ]),
      {
        "@type": "ItemList",
        name: TITLE[lang],
        itemListElement: casos.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${c.marca} — ${c.tagline[lang] ?? c.tagline.es}`,
          url: localeUrl(`${PATH}/${c.slug}`, lang),
        })),
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
      />
      <CasosHero />
      <CasosGrid />
      <CtaPotenciar />
    </main>
  );
}
