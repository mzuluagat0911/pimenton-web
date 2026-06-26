"use client";

import { motion, useReducedMotion } from "motion/react";
import { splitHighlight } from "@/components/ui-custom/Highlight";
import { EASE } from "@/components/sections/servicios/Eyebrow";
import { useCopy } from "@/components/i18n/LanguageContext";

/**
 * Hero del hub /casos — oscuro, tipográfico, ~70vh, con textura linear sutil
 * y una banda de stats (número grande + label) debajo del heading.
 */
export function CasosHero() {
  const reduced = useReducedMotion() ?? false;
  const { heading, headingAccent, subtitle, proof } = useCopy().casos.hub;

  const fadeUp = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section className="relative isolate flex min-h-[70vh] flex-col justify-center overflow-hidden bg-pimenton-dark px-[5%] py-28 sm:px-16 sm:py-32 lg:px-24">
      {/* Textura linear — sutil sobre el fondo oscuro (igual que el hub de
          insights). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url(/assets/texturas/linear-mobile.webp)] bg-cover bg-center opacity-[0.14] mix-blend-screen sm:bg-[url(/assets/texturas/linear.webp)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.h1
          {...fadeUp(0)}
          className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-tight text-pimenton-bg sm:text-6xl lg:text-7xl"
        >
          {splitHighlight(heading, headingAccent, "coral")}
        </motion.h1>

        <motion.p
          {...fadeUp(0.12)}
          className="mt-7 max-w-[600px] text-lg leading-relaxed text-pimenton-text-on-dark-muted sm:text-xl"
        >
          {subtitle}
        </motion.p>

        {/* Stats — fila de 3: número grande arriba, label debajo, alineados a
            la izquierda y separados por divisores. */}
        <motion.div
          {...fadeUp(0.22)}
          className="mt-12 grid max-w-2xl grid-cols-3 border-t border-pimenton-dark-border pt-8 sm:pt-10"
        >
          {proof.map((p, i) => (
            <div
              key={i}
              className={`px-3 first:pl-0 sm:px-6 ${
                i > 0 ? "border-l border-pimenton-dark-border" : ""
              }`}
            >
              <div className="font-display text-3xl font-bold leading-none tracking-tight text-pimenton-accent sm:text-5xl lg:text-6xl">
                {p.value}
              </div>
              <div className="mt-2.5 text-xs leading-snug text-pimenton-text-on-dark-muted sm:mt-3 sm:text-sm">
                {p.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
