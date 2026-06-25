import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { insights, getInsight } from "@/data/insights";
import { ArticleHeader } from "@/components/sections/insights/ArticleHeader";
import { ArticleBody } from "@/components/sections/insights/ArticleBody";
import { MasArticulos } from "@/components/sections/insights/MasArticulos";
import { InsightsCta } from "@/components/sections/insights/InsightsCta";

const SITE = "https://pimenton.io";

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

  const path = `/insights/${slug}`;
  return {
    title: a.metaTitle,
    description: a.metaDescription,
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
      publishedTime: a.fecha,
      authors: ["Pimentón"],
      siteName: "Pimentón",
      locale: "es_AR",
      url: path,
      title: a.metaTitle,
      description: a.metaDescription,
      images: [
        { url: a.heroImage, width: 1680, height: 1120, alt: a.titulo.es },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: a.metaTitle,
      description: a.metaDescription,
      images: [a.heroImage],
    },
  };
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getInsight(slug);
  if (!a) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.titulo.es,
    description: a.metaDescription,
    datePublished: a.fecha,
    dateModified: a.fecha,
    image: `${SITE}${a.heroImage}`,
    articleSection: a.categoria.es,
    inLanguage: "es",
    author: { "@type": "Organization", name: "Pimentón", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "Pimentón",
      url: SITE,
      logo: `${SITE}/assets/logos/principal/logo-coral.webp`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE}/insights/${a.slug}`,
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ArticleHeader insight={a} />
      <ArticleBody insight={a} />
      <MasArticulos slug={a.slug} />
      <InsightsCta />
    </main>
  );
}
