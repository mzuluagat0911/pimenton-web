"use client";

import { motion, useReducedMotion } from "motion/react";
import { splitHighlight } from "@/components/ui-custom/Highlight";
import { EASE } from "./Eyebrow";

const VANITY = ["Engagement", "Synergy", "ROI", "Branding"];

// Altura fija de los visuales en desktop para que ambas columnas y sus
// labels alineen. En mobile, alto natural.
const VISUAL_H = "h-auto md:h-[460px]";

// Composición ilustrativa de "agencia tradicional": monocromática, sin
// color, lifeless — slides genéricos, líneas de texto fake, un gráfico
// vacío y palabras vacías. Contrasta con el video real de la derecha.
function AgencyDeck() {
  return (
    <div
      className={`flex flex-col rounded-2xl border border-pimenton-border bg-pimenton-bg-soft p-6 sm:p-7 ${VISUAL_H}`}
    >
      <div className="h-2.5 w-1/2 rounded bg-pimenton-text/15" />
      <div className="mt-5 space-y-2.5">
        <div className="h-2 w-full rounded bg-pimenton-text/10" />
        <div className="h-2 w-5/6 rounded bg-pimenton-text/10" />
        <div className="h-2 w-2/3 rounded bg-pimenton-text/10" />
      </div>
      <div className="mt-7 flex items-center gap-5">
        <div
          aria-hidden
          className="size-20 flex-shrink-0 rounded-full border-[10px] border-pimenton-text/12"
        />
        <div className="flex-1 space-y-2.5">
          <div className="h-2 w-full rounded bg-pimenton-text/10" />
          <div className="h-2 w-4/5 rounded bg-pimenton-text/10" />
          <div className="h-2 w-3/5 rounded bg-pimenton-text/10" />
        </div>
      </div>
      <div className="mt-auto flex flex-wrap gap-2 pt-7">
        {VANITY.map((w) => (
          <span
            key={w}
            className="rounded-full border border-pimenton-border px-3 py-1 font-sans text-[11px] uppercase tracking-[0.16em] text-pimenton-text-muted"
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

// Lado Pimentón: video vertical real de órdenes operando (reemplaza al
// dashboard ilustrativo). El video define el ancho por su ratio portrait;
// lo centramos y lo capamos en alto para alinear con el deck de la
// izquierda.
function PimentonVideo() {
  return (
    <div className={`flex items-center justify-center ${VISUAL_H}`}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src="/assets/video/ordenes_2025.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
        className="block max-h-[440px] w-auto rounded-2xl border border-pimenton-border shadow-[0_24px_60px_-24px_rgba(15,15,14,0.32)]"
      />
    </div>
  );
}

function Column({
  visual,
  label,
  labelClass,
  text,
  textClass,
  delay,
  reduced,
}: {
  visual: React.ReactNode;
  label: React.ReactNode;
  labelClass: string;
  text: string;
  textClass: string;
  delay: number;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: reduced ? 0 : delay, ease: EASE }}
      className="flex flex-col"
    >
      <motion.div
        whileHover={reduced ? undefined : { scale: 1.015, y: -3 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        {visual}
      </motion.div>
      <h3
        className={`mt-6 flex items-center gap-2.5 text-xl font-semibold tracking-tight sm:text-2xl ${labelClass}`}
      >
        {label}
      </h3>
      <p className={`mt-2 text-base leading-relaxed ${textClass}`}>{text}</p>
    </motion.div>
  );
}

export function NoSomosAgencia() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="bg-pimenton-bg px-[5%] py-24 sm:px-16 sm:py-32 lg:px-24">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header centrado (sin eyebrow) */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-4xl"
          >
            {splitHighlight(
              "No somos una agencia. Somos un equipo de operación de delivery.",
              "operación",
              "coral",
            )}
          </motion.h2>
          <motion.p
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mt-5 text-lg leading-relaxed text-pimenton-text-muted"
          >
            La diferencia se ve cuando abres nuestra pantalla.
          </motion.p>
        </div>

        {/* Split: agencia (problema) → Pimentón (solución) */}
        <div className="mt-14 grid grid-cols-1 items-start gap-8 sm:mt-20 md:grid-cols-2 lg:gap-12">
          <Column
            visual={<AgencyDeck />}
            label="Agencias tradicionales"
            labelClass="text-pimenton-text-muted"
            text="Te entregan slides, métricas vanity y reportes de actividad. La operación sigue siendo tu problema."
            textClass="text-pimenton-text-muted"
            delay={0}
            reduced={reduced}
          />
          <Column
            visual={<PimentonVideo />}
            label={
              <>
                Equipo
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/logos/principal/logo-coral.webp"
                  alt="Pimentón"
                  className="inline-block h-5 w-auto sm:h-6"
                  draggable={false}
                />
              </>
            }
            labelClass="text-pimenton-text"
            text="Operamos tu delivery todos los días. Tomamos decisiones, ajustamos campañas, optimizamos menús. Los resultados se ven en tu P&L."
            textClass="text-pimenton-text"
            delay={0.2}
            reduced={reduced}
          />
        </div>
      </div>
    </section>
  );
}
