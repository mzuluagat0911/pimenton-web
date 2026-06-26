"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@/components/sections/servicios/Eyebrow";
import { useT } from "@/components/i18n/LanguageContext";
import type { Faq } from "@/data/faq";

// Ícono +/− con dos barras: la horizontal es fija; la vertical colapsa
// (scaleY 1→0) al abrir, quedando solo la horizontal (−). Cerrado = + ;
// abierto = −. El scaleY es robusto: incluso a mitad de animación se lee
// como un "+" más corto (nunca como una diagonal).
function PlusMinus({ isOpen, reduced }: { isOpen: boolean; reduced: boolean }) {
  return (
    <span
      aria-hidden
      className={`relative flex size-9 flex-shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
        isOpen
          ? "border-pimenton-accent text-pimenton-accent"
          : "border-pimenton-border text-pimenton-text-muted group-hover:border-pimenton-accent group-hover:text-pimenton-accent"
      }`}
    >
      <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
      <motion.span
        className="absolute h-3.5 w-0.5 rounded-full bg-current"
        initial={false}
        animate={{ scaleY: isOpen ? 0 : 1 }}
        transition={{ duration: reduced ? 0.15 : 0.3, ease: EASE }}
      />
    </span>
  );
}

function FaqItem({
  item,
  isOpen,
  onToggle,
  reduced,
}: {
  item: Faq;
  isOpen: boolean;
  onToggle: () => void;
  reduced: boolean;
}) {
  const t = useT();
  return (
    // Card blanca (mismo lenguaje que las cards de "Lo que dicen de nosotros").
    <div className="overflow-hidden rounded-2xl border border-pimenton-border bg-pimenton-surface transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(15,15,14,0.25)]">
      {/* h3 (heading) envolviendo el button = patrón de acordeón WAI-ARIA.
          La pregunta va en sentence case: el span lleva normal-case para
          anular el uppercase global de los headings. */}
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="group flex w-full cursor-pointer items-center justify-between gap-5 px-6 py-5 text-left outline-none sm:px-7 sm:py-6"
        >
          <span
            className={`text-lg font-semibold normal-case tracking-tight transition-colors duration-300 sm:text-xl ${
              isOpen
                ? "text-pimenton-accent"
                : "text-pimenton-text group-hover:text-pimenton-accent"
            }`}
          >
            {t(item.pregunta)}
          </span>
          <PlusMinus isOpen={isOpen} reduced={reduced} />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.2 : 0.35, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <p className="px-6 pb-6 text-base leading-relaxed text-pimenton-text-muted sm:px-7 sm:pb-7">
              {t(item.respuesta)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqAccordion({ items }: { items: Faq[] }) {
  const reduced = useReducedMotion() ?? false;
  // Single-expand: una sola abierta a la vez. Arranca con la primera
  // abierta (toggle a null si se vuelve a clickear).
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3 sm:space-y-4">
      {items.map((item, i) => (
        <FaqItem
          key={i}
          item={item}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          reduced={reduced}
        />
      ))}
    </div>
  );
}
