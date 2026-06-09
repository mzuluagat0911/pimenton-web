"use client";

import { CtaPotenciar } from "@/components/sections/casos/CtaPotenciar";
import { useCopy } from "@/components/i18n/LanguageContext";

/**
 * CTA de cierre de /insights — reutiliza CtaPotenciar (de /casos) con el copy
 * propio de insights. Resuelve la copy client-side (i18n) y la pasa por props.
 */
export function InsightsCta() {
  const { heading, headingAccent, description, button } =
    useCopy().insights.cta;

  return (
    <CtaPotenciar
      heading={heading}
      headingAccent={headingAccent}
      description={description}
      button={button}
      href="/contacto"
    />
  );
}
