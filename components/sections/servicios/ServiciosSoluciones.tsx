"use client";

import { Services } from "@/components/sections/Services";
import { useT } from "@/components/i18n/LanguageContext";

/**
 * Wrapper bilingüe del bloque "Cinco soluciones" de /servicios. La página es
 * un server component, así que el override del header (eyebrow/heading/CTA)
 * que distingue esta página del Home se resuelve acá, en cliente, con useT().
 * El resto de los servicios sigue saliendo de copy.services dentro de Services.
 */
export function ServiciosSoluciones() {
  const t = useT();
  return (
    <Services
      eyebrow={t({ es: "Qué hacemos", en: "What we do", it: "Cosa facciamo" })}
      heading={t({
        es: "Cinco soluciones, un mismo objetivo: que vendas más sin mayor esfuerzo.",
        en: "Five solutions, one goal: sell more without extra effort.",
        it: "Cinque soluzioni, un unico obiettivo: vendere di più senza sforzi extra.",
      })}
      headingHighlight={t({ es: "vendas más", en: "sell more", it: "vendere di più" })}
      showCta
      ctaHref="/contacto"
      ctaLabel={t({ es: "Consultoría gratuita", en: "Free Consultancy", it: "Consulenza gratuita" })}
      uppercaseNames
      showPlatforms
    />
  );
}
