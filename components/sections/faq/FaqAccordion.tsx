"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@/components/sections/servicios/Eyebrow";
import type { Faq } from "@/data/faq";

// Ícono +/− construido con dos barras: la horizontal es fija y la
// "vertical" rota 90°→0° al abrir, quedando horizontal sobre la otra (−).
// Cerrado = + ; abierto = −.
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
        className="absolute h-0.5 w-3.5 rounded-full bg-current"
        animate={{ rotate: isOpen ? 0 : 90 }}
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
  return (
    <div className="border-b border-pimenton-border">
      {/* h3 (heading) envolviendo el button = patrón de acordeón WAI-ARIA.
          La pregunta va en sentence case: el span lleva normal-case para
          anular el uppercase global de los headings. */}
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="group flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left outline-none sm:py-7"
        >
          <span
            className={`text-lg font-semibold normal-case tracking-tight transition-colors duration-300 sm:text-xl ${
              isOpen
                ? "text-pimenton-accent"
                : "text-pimenton-text group-hover:text-pimenton-accent"
            }`}
          >
            {item.pregunta}
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
            <p className="max-w-2xl pb-6 pr-8 text-base leading-relaxed text-pimenton-text-muted sm:pb-7">
              {item.respuesta}
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
    <div className="border-t border-pimenton-border">
      {items.map((item, i) => (
        <FaqItem
          key={item.pregunta}
          item={item}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          reduced={reduced}
        />
      ))}
    </div>
  );
}
