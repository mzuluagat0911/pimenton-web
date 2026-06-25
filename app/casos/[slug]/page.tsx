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

const SITE = "https://pimenton.io";

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

  const title = `${caso.marca} | Casos de Éxito · Pimentón`;
  const description = caso.tagline.es;
  const path = `/casos/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
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
    openGraph: {
      type: "article",
      siteName: "Pimentón",
      locale: "es_AR",
      url: path,
      title,
      description,
      images: [
        { url: caso.heroImage, width: 1280, height: 720, alt: caso.marca },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [caso.heroImage],
    },
  };
}

export default async function CasoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caso = getCaso(slug);
  if (!caso) notFound();

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
            name: "Casos de éxito",
            item: `${SITE}/casos`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: caso.marca,
            item: `${SITE}/casos/${caso.slug}`,
          },
        ],
      },
      {
        "@type": "Article",
        headline: `${caso.marca} — ${caso.tagline.es}`,
        description: caso.contexto.es,
        articleSection: "Casos de éxito",
        image: `${SITE}${caso.heroImage}`,
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
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
