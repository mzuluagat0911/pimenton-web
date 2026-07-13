import type { Metadata } from "next";
import { headers } from "next/headers";
import localFont from "next/font/local";
import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { LanguageProvider } from "@/components/i18n/LanguageContext";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { SITE_URL } from "@/lib/site";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_HEADER,
  siteMeta,
  type Locale,
} from "@/lib/i18n";
import { copy } from "@/data/copy";
import "./globals.css";

const helvetica = localFont({
  src: [
    {
      path: "../public/fonts/helvetica/helvetica-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/helvetica/helvetica-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/helvetica/helvetica-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/helvetica/helvetica-bolditalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-helvetica",
  display: "swap",
});

async function getRequestLocale(): Promise<Locale> {
  const h = await headers();
  const raw = h.get(LOCALE_HEADER);
  if (isLocale(raw ?? "")) return raw as Locale;
  return DEFAULT_LOCALE;
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLocale();
  const meta = siteMeta[lang];

  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        es: "/es",
        en: "/en",
        "x-default": "/es",
      },
    },
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
    keywords: [
      "delivery restaurantes",
      "growth partner gastronomía",
      "gestión apps delivery",
      "Pedidos Ya",
      "Rappi",
      "Uber Eats",
      "consultoría delivery",
      "LATAM",
    ],
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: `${SITE_URL}/${lang}`,
      siteName: "Pimentón",
      locale: meta.ogLocale,
      alternateLocale: lang === "es" ? ["en_US"] : ["es_AR"],
      type: "website",
      images: [
        {
          url: meta.ogImage,
          width: 1200,
          height: 630,
          alt: "Pimentón — Growth Partner",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.ogTitle,
      description: meta.ogDescription,
      images: [meta.ogImage],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/assets/favicon.svg", type: "image/svg+xml" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
  };
}

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

function buildSiteJsonLd(lang: Locale) {
  const meta = siteMeta[lang];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "Pimentón",
        url: SITE_URL,
        logo: `${SITE_URL}/assets/logos/principal/logo-coral.webp`,
        image: `${SITE_URL}/og-default.png`,
        description: meta.description,
        email: copy.footer.email,
        sameAs: copy.footer.social
          .filter((s) => s.name !== "WhatsApp")
          .map((s) => s.href),
        contactPoint: copy.footer.phones.map((p) => ({
          "@type": "ContactPoint",
          telephone: `+${p.phoneRaw}`,
          contactType: "customer service",
          areaServed: p.region.es,
          availableLanguage: ["es", "en"],
        })),
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: "Pimentón",
        url: SITE_URL,
        inLanguage: lang,
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await getRequestLocale();
  const siteJsonLd = buildSiteJsonLd(lang);

  return (
    <html lang={lang} className={helvetica.variable}>
      <body className="font-sans antialiased bg-pimenton-bg text-pimenton-text">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <LanguageProvider initialLang={lang}>
          <SmoothScroll />
          <SiteHeader />
          {children}
          <Footer />
          <WhatsAppFab />
        </LanguageProvider>
      </body>
    </html>
  );
}
