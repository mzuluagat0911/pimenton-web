// Versión previa de /servicios, estructura conversion-driven de 8 secciones
// (hero + Por qué Pimentón + servicios + cómo trabajamos + casos + FAQ +
// CTA + footer). Reemplazada por la versión simple informativa en
// diciembre 2026. Mantener por referencia. NO es una ruta (vive fuera de
// app/) y no se importa en ningún lado.

import { Services } from "@/components/sections/Services";
import { ServiciosHero } from "./ServiciosHero.archived";
import { PorQuePimenton } from "./PorQuePimenton.archived";
import { ComoTrabajamos } from "./ComoTrabajamos.archived";
import { CasosResultados } from "./CasosResultados.archived";
import { FaqServicios } from "./FaqServicios.archived";
import { CtaContactoFinal } from "./CtaContactoFinal.archived";

export function PaginaServiciosV1() {
  return (
    <main>
      <ServiciosHero />
      <PorQuePimenton />
      <Services
        eyebrow="Qué hacemos"
        heading="Cinco servicios. Un mismo objetivo: que vendas más sin sufrir más."
        showCta={false}
      />
      <ComoTrabajamos />
      <CasosResultados />
      <FaqServicios />
      <CtaContactoFinal />
    </main>
  );
}
