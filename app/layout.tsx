import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
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
  title: "Pimentón — Escalamos tu Delivery",
  description: "Convertimos tu Restaurante en una unidad de negocio rentable. Operamos delivery y canales digitales en LATAM y Europa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${outfit.variable} ${jetbrains.variable} font-sans antialiased bg-pimenton-bg text-pimenton-text`}>
        {children}
      </body>
    </html>
  );
}