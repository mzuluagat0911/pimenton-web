"use client";

import { CtaPill } from "@/components/ui-custom/CtaPill";
import { useT } from "@/components/i18n/LanguageContext";

/**
 * Intro + CTA de la columna izquierda de /faq. La página es server component,
 * así que estos dos textos (los únicos con copy) se resuelven acá en cliente
 * con useT(). El CTA se usa dos veces (desktop sticky + mobile al final).
 */
export function FaqIntroText() {
  const t = useT();
  return (
    <p className="mt-5 max-w-sm text-base leading-relaxed text-pimenton-text-soft sm:text-lg">
      {t({
        es: "Las preguntas que más nos hacen.",
        en: "The questions we get asked most.",
      })}
    </p>
  );
}

export function FaqCta() {
  const t = useT();
  return (
    <CtaPill
      href="/contacto"
      label={t({
        es: "¿Tienes otra duda? Hablemos.",
        en: "Still have a question? Let's talk.",
      })}
    />
  );
}
