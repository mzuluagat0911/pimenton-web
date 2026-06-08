// Versión previa de /servicios, estructura conversion-driven de 8 secciones.
// Reemplazada por la versión simple informativa en diciembre 2026.
// Mantener por referencia. No se importa en la /servicios actual.

"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Eyebrow, EASE } from "./Eyebrow";

const NOISE_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export function ServiciosHero() {
  const reduced = useReducedMotion() ?? false;

  // fade + translateY con stagger por línea, al cargar la página.
  const fadeUp = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  const scrollToServices = (e: React.MouseEvent) => {
    e.preventDefault();
    const lenis =
      typeof window !== "undefined" ? window.__lenis : undefined;
    const target = document.querySelector("#servicios");
    if (lenis && target) {
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
    } else {
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden bg-pimenton-dark px-[5%] py-24 sm:px-16 sm:py-28 lg:px-24">
      {/* Grano sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{ backgroundImage: NOISE_SVG }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.div {...fadeUp(0)}>
          <Eyebrow>Nuestros servicios</Eyebrow>
        </motion.div>

        <h1 className="mt-7 max-w-5xl text-5xl font-bold leading-[1.02] tracking-tight text-pimenton-bg sm:text-6xl lg:text-7xl">
          <motion.span className="block" {...fadeUp(0.1)}>
            Cinco maneras de hacer que tu delivery
          </motion.span>
          <motion.span className="block" {...fadeUp(0.22)}>
            deje de <span className="text-pimenton-accent">sangrar</span>{" "}
            plata.
          </motion.span>
        </h1>

        <motion.p
          {...fadeUp(0.36)}
          className="mt-7 max-w-2xl text-lg leading-relaxed text-pimenton-text-on-dark-muted sm:text-xl"
        >
          No vendemos paquetes genéricos. Diagnosticamos tu operación,
          identificamos las fugas y trabajamos en lo que mueve la aguja.
        </motion.p>

        <motion.div
          {...fadeUp(0.5)}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <Link
            href="/contacto"
            className="group inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-pimenton-accent px-8 py-3.5 text-base font-semibold text-pimenton-bg shadow-xl shadow-pimenton-accent/40 transition-[background-color,box-shadow] duration-300 hover:bg-pimenton-accent-hover hover:shadow-pimenton-accent/60 sm:w-auto sm:text-lg"
          >
            Empezar consultoría gratuita
            <ArrowRight
              aria-hidden
              className="size-5 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <a
            href="#servicios"
            onClick={scrollToServices}
            className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-pimenton-text-on-dark/40 bg-pimenton-text-on-dark/5 px-8 py-3.5 text-base font-semibold text-pimenton-text-on-dark backdrop-blur-sm transition-colors duration-300 hover:border-pimenton-text-on-dark/80 hover:bg-pimenton-text-on-dark/10 sm:w-auto sm:text-lg"
          >
            Ver servicios
          </a>
        </motion.div>
      </div>
    </section>
  );
}