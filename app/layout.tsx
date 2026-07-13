import type { Metadata } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { LanguageProvider } from "@/components/i18n/LanguageContext";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { SITE_URL } from "@/lib/site";
import { copy } from "@/data/copy";
import "./globals.css";

// Principal — Helvetica self-hosted (next/font/local). Solo 4 masters:
// regular/bold × normal/italic. Los weights intermedios (500/600) y light
// (300) resuelven al más cercano por el algoritmo de matching de CSS.
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

export const metadata: Metadata = {
  // metadataBase resuelve las URLs relativas de OG/canonical a absolutas.
  // Viene de NEXT_PUBLIC_SITE_URL (fallback pimenton.io) — ver lib/site.ts.
  metadataBase: new URL(SITE_URL),
  title: "Pimentón — Escalamos tu Delivery y Canales Digitales",
  description:
    "Growth Partner especializado en delivery para restaurantes. Operamos tus canales digitales en LATAM y Europa. +500 restaurantes confían en nosotros.",
  // Canonical de la home. Las subpáginas (/servicios, /como-lo-hacemos)
  // declaran el suyo y reemplazan este por el merge shallow de metadata.
  alternates: { canonical: "/es" },
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
    title: "Pimentón — Growth Partner para tu Delivery",
    description: "Potenciamos tu delivery y canales digitales.",
    url: SITE_URL,
    siteName: "Pimentón",
    locale: "es_AR",
    type: "website",
    images: [
      {
        // ?v=2 forcea a WhatsApp/FB a refrescar el cache del preview.
        url: "/og-default.png?v=2",
        width: 1200,
        height: 630,
        alt: "Pimentón — Growth Partner",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pimentón — Growth Partner para tu Delivery",
    description: "Potenciamos tu delivery y canales digitales.",
    images: ["/og-default.png?v=2"],
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

// ── Structured data GLOBAL (presente en TODAS las páginas vía el layout) ──
// Organization + WebSite con @id estables, para que el resto de los schemas
// (BreadcrumbList, ContactPage, etc.) puedan referenciarlos por @id. Los datos
// (logo, redes, email, teléfonos) salen del data layer (copy.footer), una sola
// fuente de verdad. Todas las URLs son absolutas vía SITE_URL.
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Pimentón",
      url: SITE_URL,
      logo: `${SITE_URL}/assets/logos/principal/logo-coral.webp`,
      image: `${SITE_URL}/og-default.png`,
      description:
        "Growth Partner especializado en delivery para restaurantes. Operamos los canales digitales de restaurantes en LATAM y Europa para convertir el delivery en un canal rentable, predecible y profesional.",
      email: copy.footer.email,
      // Perfiles sociales (sin WhatsApp, que es un canal de contacto, no perfil).
      sameAs: copy.footer.social
        .filter((s) => s.name !== "WhatsApp")
        .map((s) => s.href),
      // Teléfonos regionales como puntos de contacto.
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
      inLanguage: "es",
      publisher: { "@id": ORG_ID },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={helvetica.variable}>
      <body className="font-sans antialiased bg-pimenton-bg text-pimenton-text">
        {/* JSON-LD global: Organization + WebSite (en todas las páginas). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <LanguageProvider>
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