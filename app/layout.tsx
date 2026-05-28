import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pimenton.io"),
  title: "Pimentón — Escalamos tu Delivery y Canales Digitales",
  description:
    "Growth Partner especializado en delivery para restaurantes. Operamos tus canales digitales en LATAM y Europa. +500 restaurantes confían en nosotros.",
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
    <html lang="es" className={`${outfit.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased bg-pimenton-bg text-pimenton-text">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}