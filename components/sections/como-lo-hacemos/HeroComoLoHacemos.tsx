"use client";

import { motion, useReducedMotion } from "motion/react";
import { Highlight } from "@/components/ui-custom/Highlight";
import { Eyebrow, EASE } from "@/components/sections/servicios/Eyebrow";

export function HeroComoLoHacemos() {
  const reduced = useReducedMotion() ?? false;

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

      <div className="relative z-10 mx-auto w-full max-w-7xl text-center md:text-left">
        <motion.div {...fadeUp(0)}>
          <Eyebrow className="justify-center md:justify-start">
            Cómo lo hacemos
          </Eyebrow>
        </motion.div>

        <h1 className="mt-7 text-4xl font-semibold leading-[1.02] tracking-tight text-pimenton-bg sm:text-6xl lg:text-7xl">
          <motion.span className="block max-w-4xl md:mx-0" {...fadeUp(0.12)}>
            <Highlight color="coral">Operamos</Highlight> tu delivery como si
            fuera nuestro.
          </motion.span>
        </h1>

        <motion.p
          {...fadeUp(0.26)}
          className="mx-auto mt-7 max-w-[600px] text-lg leading-relaxed text-pimenton-text-on-dark-muted sm:text-xl md:mx-0"
        >
          Un proceso claro, con foco en rentabilidad. Analizamos,
          diagnosticamos, operamos y optimizamos cada canal con un Growth
          Manager dedicado.
        </motion.p>
      </div>
    </section>
  );
}
