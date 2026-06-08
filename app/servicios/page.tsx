import type { Metadata } from "next";
import { Services } from "@/components/sections/Services";
import { ServiciosHero } from "@/components/sections/servicios/ServiciosHero";
import { PorQuePimenton } from "@/components/sections/servicios/PorQuePimenton";
import { ComoTrabajamos } from "@/components/sections/servicios/ComoTrabajamos";
import { CasosResultados } from "@/components/sections/servicios/CasosResultados";
import { FaqServicios } from "@/components/sections/servicios/FaqServicios";
import { CtaContactoFinal } from "@/components/sections/servicios/CtaContactoFinal";

export const metadata: Metadata = {
  title:
    "Servicios | Pimentón — Especialistas en delivery para restaurantes",
  description:
    "Cinco servicios para profesionalizar tu delivery: optimización de Foodapps, performance, contenido, tecnología y consultoría. +500 restaurantes confían en Pimentón.",
  alternates: { canonical: "/servicios" },
};

export default function ServiciosPage() {
  return (
    <main>
      {/* 1. Hero (oscuro) */}
      <ServiciosHero />

      {/* 2. Por qué Pimentón (crema) */}
      <PorQuePimenton />

      {/* 3. Lista de servicios — componente reutilizado del Home (oscuro).
             Trae su propio id="servicios" para el anchor del hero. Le pasamos
             el header de esta página y ocultamos su CTA interno. */}
      <Services
        eyebrow="Qué hacemos"
        heading="Cinco servicios. Un mismo objetivo: que vendas más sin sufrir más."
        showCta={false}
      />

      {/* 4. Cómo trabajamos (oscuro, con seam respecto a Servicios) */}
      <ComoTrabajamos />

      {/* 5. Casos / Resultados (crema) */}
      <CasosResultados />

      {/* 6. FAQ (oscuro) */}
      <FaqServicios />

      {/* 7. CTA final → /contacto (coral). Sin form embebido. */}
      <CtaContactoFinal />

      {/* 8. Footer: global desde app/layout.tsx */}
    </main>
  );
}
