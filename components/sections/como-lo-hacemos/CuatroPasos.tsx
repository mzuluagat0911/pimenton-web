"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { splitHighlight } from "@/components/ui-custom/Highlight";
import { Eyebrow, EASE } from "@/components/sections/servicios/Eyebrow";
import { pasos, type Paso } from "@/data/comoLoHacemos";

// Corner bracket SVG (ángulo en L) tipo panel/dashboard. position="tr"
// abraza la esquina superior derecha; "tl" la superior izquierda.
function CornerBracket({
  position = "tr",
  className = "",
}: {
  position?: "tr" | "tl";
  className?: string;
}) {
  const d = position === "tr" ? "M6 1 H17 V12" : "M12 1 H1 V12";
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Step({
  paso,
  index,
  reduced,
}: {
  paso: Paso;
  index: number;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: 0.6,
        delay: reduced ? 0 : index * 0.1,
        ease: EASE,
      }}
      className="relative border-t border-pimenton-border py-8 sm:py-10"
    >
      <CornerBracket
        position="tr"
        className="absolute right-1 top-6 text-pimenton-accent"
      />
      <div className="flex items-start gap-5 sm:gap-7">
        <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-pimenton-text sm:size-14">
          <span className="font-display text-sm font-bold text-pimenton-text">
            {paso.num}
          </span>
        </div>
        <div className="pt-1">
          <h3 className="text-3xl font-bold normal-case tracking-tight text-pimenton-text sm:text-4xl">
            {paso.title}
          </h3>
          <p className="mt-3 max-w-prose text-base leading-relaxed text-pimenton-text-muted">
            {paso.description}
          </p>
          <p className="mt-2 max-w-prose text-base font-medium leading-relaxed text-pimenton-accent">
            {paso.highlight}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function CuatroPasos() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="bg-pimenton-bg px-[5%] py-24 sm:px-16 sm:py-32 lg:px-24">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
        {/* Columna izquierda — heading */}
        <div className="lg:pt-8">
          <Eyebrow>Nuestro proceso</Eyebrow>
          <motion.h2
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mt-6 text-5xl font-semibold leading-[1.02] tracking-tight text-pimenton-text sm:text-6xl lg:text-7xl"
          >
            {splitHighlight("¿Cómo lo hacemos?", "hacemos?", "coral")}
          </motion.h2>
          <motion.p
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mt-6 max-w-[400px] text-base leading-relaxed text-pimenton-text-muted sm:text-lg"
          >
            Un proceso claro. Con foco en rentabilidad.
          </motion.p>
        </div>

        {/* Columna derecha — pasos + CTA */}
        <div>
          {pasos.map((paso, i) => (
            <Step key={paso.num} paso={paso} index={i} reduced={reduced} />
          ))}

          {/* CTA */}
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.6,
              delay: reduced ? 0 : pasos.length * 0.1,
              ease: EASE,
            }}
            className="relative border-t border-pimenton-border pt-8 sm:pt-10"
          >
            <CornerBracket
              position="tl"
              className="absolute left-1 top-6 text-pimenton-accent"
            />
            <Link
              href="/contacto"
              className="group inline-flex items-center gap-3 text-2xl font-bold tracking-tight text-pimenton-text transition-colors duration-300 hover:text-pimenton-accent sm:text-3xl"
            >
              Quiero analizar mi delivery
              <ArrowRight
                aria-hidden
                className="size-6 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
