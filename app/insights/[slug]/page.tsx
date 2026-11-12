import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { insights, getInsight } from "@/data/insights";
import { ArticleHeader } from "@/components/sections/insights/ArticleHeader";
import { ArticleBody } from "@/components/sections/insights/ArticleBody";
import { MasArticulos } from "@/components/sections/insights/MasArticulos";
import { InsightsCta } from "@/components/sections/insights/InsightsCta";

import { SITE_URL as SITE } from "@/lib/site";
import { getRequestLocale, jsonLdHtml, localeUrl, pageMetadata } from "@/lib/seo";

// SSG: prerenderiza los 3 (o N) artículos desde el data layer al build.
export function generateStaticParams() {
  return insights.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getInsight(slug);
  if (!a) return {};

  return pageMetadata({
    path: `/insights/${slug}`,
    title: a.metaTitle,
    description: a.metaDescription,
    ogType: "article",
    publishedTime: a.fecha,
    authors: ["Pimentón"],
    image: {
      url: a.heroImage,
      width: 1680,
      height: 1120,
      alt: a.titulo,
    },
  });
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getInsight(slug);
  if (!a) notFound();

  const lang = await getRequestLocale();
  const pageUrl = localeUrl(`/insights/${a.slug}`, lang);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.titulo[lang],
    description: a.metaDescription[lang],
    datePublished: a.fecha,
    dateModified: a.fecha,
    image: `${SITE}${a.heroImage}`,
    articleSection: a.categoria[lang],
    inLanguage: lang,
    author: { "@type": "Organization", name: "Pimentón", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "Pimentón",
      url: SITE,
      logo: `${SITE}/assets/logos/principal/logo-coral.webp`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
      />
      <ArticleHeader insight={a} />
      <ArticleBody insight={a} />
      <MasArticulos slug={a.slug} />
      <InsightsCta />
    </main>
  );
}
