"use client";

import { motion, useReducedMotion } from "motion/react";
import { splitHighlight } from "@/components/ui-custom/Highlight";
import { EASE } from "@/components/sections/servicios/Eyebrow";
import { useCopy } from "@/components/i18n/LanguageContext";

/**
 * Hero del hub /insights — oscuro, tipográfico, ~60vh, con voz de marca
 * (no un "bienvenido al blog" genérico). Textura linear sutil sobre el
 * fondo oscuro (misma textura del home, en mix-blend para que respire).
 */
export function InsightsHero() {
  const reduced = useReducedMotion() ?? false;
  const { heading, headingAccent, subtitle } = useCopy().insights.hub;

  const fadeUp = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section className="relative isolate flex min-h-[60vh] flex-col justify-center overflow-hidden bg-pimenton-dark px-[5%] py-28 sm:px-16 sm:py-32 lg:px-24">
      {/* Textura linear — sutil sobre el fondo oscuro (screen revela el grano
          sobre el negro). En mobile usa la variante mobile. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url(/assets/texturas/linear-mobile.webp)] bg-cover bg-center opacity-[0.14] mix-blend-screen sm:bg-[url(/assets/texturas/linear.webp)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.h1
          {...fadeUp(0.08)}
          className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-tight text-pimenton-bg sm:text-6xl lg:text-7xl"
        >
          {splitHighlight(heading, headingAccent, "coral")}
        </motion.h1>

        <motion.p
          {...fadeUp(0.18)}
          className="mt-7 max-w-[640px] text-lg leading-relaxed text-pimenton-text-on-dark-muted sm:text-xl"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
}
