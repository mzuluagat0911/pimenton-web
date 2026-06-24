import type { Metadata } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { LanguageProvider } from "@/components/i18n/LanguageContext";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
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
  metadataBase: new URL("https://pimenton.io"),
  title: "Pimentón — Escalamos tu Delivery y Canales Digitales",
  description:
    "Growth Partner especializado en delivery para restaurantes. Operamos tus canales digitales en LATAM y Europa. +500 restaurantes confían en nosotros.",
  // Canonical de la home. Las subpáginas (/servicios, /como-lo-hacemos)
  // declaran el suyo y reemplazan este por el merge shallow de metadata.
  alternates: { canonical: "/" },
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
    description: "Convertimos tu Restaurante en una unidad de negocio rentable.",
    url: "https://pimenton.io",
    siteName: "Pimentón",
    locale: "es_AR",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Pimentón" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pimentón — Growth Partner para tu Delivery",
    description: "Convertimos tu Restaurante en una unidad de negocio rentable.",
    images: ["/og-default.png"],
  },
  icons: {
    icon: [{ url: "/assets/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={helvetica.variable}>
      <body className="font-sans antialiased bg-pimenton-bg text-pimenton-text">
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