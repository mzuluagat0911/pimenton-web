import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { casos, getCaso } from "@/data/casos";
import { CasoHero } from "@/components/sections/casos/CasoHero";
import { CasoMetricas } from "@/components/sections/casos/CasoMetricas";
import {
  CasoApproach,
  CasoConclusion,
  CasoDesafio,
  CasoResultados,
} from "@/components/sections/casos/CasoBody";
import { OtrosCasos } from "@/components/sections/casos/OtrosCasos";
import { CtaPotenciar } from "@/components/sections/casos/CtaPotenciar";

import { SITE_URL as SITE } from "@/lib/site";
import { getRequestLocale, jsonLdHtml, localeUrl, pageMetadata } from "@/lib/seo";

// SSG: prerenderiza las 6 (o N) landings desde el data layer al build.
export function generateStaticParams() {
  return casos.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caso = getCaso(slug);
  if (!caso) return {};

  return pageMetadata({
    path: `/casos/${slug}`,
    title: {
      es: `${caso.marca} | Casos de Éxito · Pimentón`,
      en: `${caso.marca} | Success Stories · Pimentón`,
      it: `${caso.marca} | Casi di Successo · Pimentón`,
    },
    description: caso.tagline,
    ogType: "article",
    image: {
      url: caso.heroImage,
      width: 1280,
      height: 854,
      alt: { es: caso.marca, en: caso.marca, it: caso.marca },
    },
  });
}

export default async function CasoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caso = getCaso(slug);
  if (!caso) notFound();

  const lang = await getRequestLocale();
  const section = {
    es: "Casos de éxito",
    en: "Success stories",
    it: "Casi di successo",
  }[lang];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: lang === "es" ? "Inicio" : "Home",
            item: localeUrl("/", lang),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: section,
            item: localeUrl("/casos", lang),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: caso.marca,
            item: localeUrl(`/casos/${caso.slug}`, lang),
          },
        ],
      },
      {
        "@type": "Article",
        headline: `${caso.marca} — ${caso.tagline[lang]}`,
        description: caso.contexto[lang],
        inLanguage: lang,
        articleSection: section,
        image: `${SITE}${caso.heroImage}`,
        mainEntityOfPage: localeUrl(`/casos/${caso.slug}`, lang),
        author: { "@type": "Organization", name: "Pimentón", url: SITE },
        publisher: {
          "@type": "Organization",
          name: "Pimentón",
          url: SITE,
          logo: `${SITE}/assets/logos/principal/logo-coral.webp`,
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
      <CasoHero caso={caso} />
      <CasoMetricas metricas={caso.metricas} />
      <CasoDesafio contexto={caso.contexto} />
      <CasoApproach approach={caso.approach} />
      {caso.resultadosDetalle && (
        <CasoResultados items={caso.resultadosDetalle} />
      )}
      <CasoConclusion text={caso.conclusion} />
      <OtrosCasos slug={caso.slug} />
      <CtaPotenciar />
    </main>
  );
}
