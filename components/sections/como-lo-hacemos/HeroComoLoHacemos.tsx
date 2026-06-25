"use client";

import { motion, useReducedMotion } from "motion/react";
import { Highlight } from "@/components/ui-custom/Highlight";
import { EASE } from "@/components/sections/servicios/Eyebrow";
import { useT } from "@/components/i18n/LanguageContext";

export function HeroComoLoHacemos() {
  const reduced = useReducedMotion() ?? false;
  const t = useT();

  // fade + translateY con stagger por línea al cargar.
  const fadeUp = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden bg-pimenton-dark px-[5%] py-24 sm:px-16 sm:py-28 lg:px-24">
      {/* Video de fondo. PLACEHOLDER: el archivo
          /assets/video/como-lo-hacemos-hero.mp4 todavía no existe — hasta
          que Pimentón lo suba, el poster (imagen de operación) + el overlay
          oscuro sostienen el hero. Al dropear el .mp4 en ese path, reproduce
          solo, sin tocar código. */}
      <video
        aria-hidden
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/assets/gallery/dashboard-analisis.webp"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      >
        <source src="/assets/video/como-lo-hacemos-hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay oscuro — gradiente para profundidad + legibilidad. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-pimenton-dark/55 via-pimenton-dark/65 to-pimenton-dark/90"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-tight text-pimenton-bg sm:text-6xl lg:text-7xl">
          <motion.span className="block" {...fadeUp(0)}>
            <Highlight color="coral">
              {t({ es: "Operamos", en: "We operate" })}
            </Highlight>
          </motion.span>
          <motion.span className="block" {...fadeUp(0.08)}>
            {t({ es: "tu delivery como", en: "your delivery" })}
          </motion.span>
          <motion.span className="block" {...fadeUp(0.16)}>
            {t({ es: "si fuera nuestro", en: "as if it were ours" })}
          </motion.span>
        </h1>

        <motion.p
          {...fadeUp(0.24)}
          className="mt-7 max-w-[640px] text-lg leading-relaxed text-pimenton-text-on-dark-muted sm:text-xl"
        >
          {t({
            es: "Datos reales, decisiones diarias y un Growth Manager dedicado a tu negocio.",
            en: "Real data, daily decisions, and a Growth Manager dedicated to your business.",
          })}
        </motion.p>
      </div>
    </section>
  );
}
