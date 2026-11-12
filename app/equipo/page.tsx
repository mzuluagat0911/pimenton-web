import { EquipoHero } from "@/components/sections/equipo/EquipoHero";
import { FraseManifiesto } from "@/components/sections/equipo/FraseManifiesto";
import { ValoresRows } from "@/components/sections/equipo/ValoresRows";
import { ComoAcompanamos } from "@/components/sections/equipo/ComoAcompanamos";
import { PartnersCarousel } from "@/components/sections/equipo/PartnersCarousel";
import { CtaSumarte } from "@/components/sections/equipo/CtaSumarte";
import {
  breadcrumbList,
  getRequestLocale,
  jsonLdHtml,
  pageMetadata,
} from "@/lib/seo";

const PATH = "/equipo";
const TITLE = {
  es: "Equipo | Pimentón — Nuestra cultura",
  en: "Team | Pimentón — Our culture",
  it: "Team | Pimentón — La nostra cultura",
};
const DESCRIPTION = {
  es: "Cultura Pimentón: cómo trabajamos, en qué creemos y qué buscamos en las personas que se suman al equipo. Adaptabilidad, protagonismo y respeto.",
  en: "Pimentón culture: how we work, what we believe, and what we look for in people who join the team. Adaptability, ownership, and respect.",
  it: "La cultura Pimentón: come lavoriamo, in cosa crediamo e cosa cerchiamo nelle persone che entrano nel team. Adattabilità, responsabilità e rispetto.",
};
const H1 = {
  es: "Equipo y cultura de Pimentón",
  en: "Pimentón team and culture",
  it: "Il team e la cultura di Pimentón",
};

export async function generateMetadata() {
  return pageMetadata({
    path: PATH,
    title: TITLE,
    description: DESCRIPTION,
    ogAlt: { es: "Pimentón — Equipo", en: "Pimentón — Team", it: "Pimentón — Team" },
  });
}

export default async function EquipoPage() {
  const lang = await getRequestLocale();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbList(lang, [
        { name: { es: "Inicio", en: "Home", it: "Home" }, path: "/" },
        { name: { es: "Equipo", en: "Team", it: "Team" }, path: PATH },
      ]),
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
      />
      {/* H1 de la página (el hero es visual: logo + eyebrow, sin heading).
          Visualmente oculto — no toca el diseño, pero da un único H1 con la
          keyword principal para SEO y accesibilidad. */}
      <h1 className="sr-only">{H1[lang]}</h1>
      <EquipoHero />
      <FraseManifiesto />
      <ValoresRows />
      <ComoAcompanamos />
      <PartnersCarousel />
      <CtaSumarte />
    </main>
  );
}
