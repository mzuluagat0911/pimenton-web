import type { Metadata } from "next";
import { Services } from "@/components/sections/Services";
import { ServiciosHero } from "@/components/sections/servicios/ServiciosHero";
import { NoSomosAgencia } from "@/components/sections/servicios/NoSomosAgencia";

export const metadata: Metadata = {
  title:
    "Servicios | Pimentón — Especialistas en delivery para restaurantes",
  description:
    "Cinco servicios para profesionalizar tu delivery. +500 restaurantes en +20 países confían en Pimentón.",
  alternates: { canonical: "/servicios" },
};

export default function ServiciosPage() {
  return (
    <main>
      {/* 1. Hero (oscuro) — mosaico Control Room de fondo */}
      <ServiciosHero />

      {/* 2. No somos una agencia (crema) — split agencia vs Pimentón */}
      <NoSomosAgencia />

      {/* 3. Cinco servicios (oscuro) — componente del Home reutilizado, con
             header propio de esta página, palabra resaltada, nombres en
             uppercase y sin CTA interno. */}
      <Services
        eyebrow="Qué hacemos"
        heading="Cinco servicios. Un mismo objetivo: que vendas más sin sufrir más."
        headingHighlight="vendas más"
        showCta={false}
        uppercaseNames
      />

      {/* 4. Footer: global desde app/layout.tsx */}
    </main>
  );
}
