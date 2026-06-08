"use client";

import { motion, useReducedMotion } from "motion/react";
import { splitHighlight } from "@/components/ui-custom/Highlight";
import { Eyebrow, EASE } from "./Eyebrow";
import {
  AlertTile,
  BarsTile,
  MetricTile,
  PlatformsTile,
} from "./ControlRoomTiles";

const VANITY = ["Engagement", "Synergy", "ROI", "Branding"];

// Composición ilustrativa de "agencia tradicional": monocromática, sin
// color, lifeless — slides genéricos, líneas de texto fake, un gráfico
// vacío y palabras vacías. Contrasta con el dashboard vivo de la derecha.
function AgencyDeck() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-pimenton-border bg-pimenton-bg-soft p-6 sm:p-7">
      {/* título de slide */}
      <div className="h-2.5 w-1/2 rounded bg-pimenton-text/15" />
      {/* líneas de texto fake */}
      <div className="mt-5 space-y-2.5">
        <div className="h-2 w-full rounded bg-pimenton-text/10" />
        <div className="h-2 w-5/6 rounded bg-pimenton-text/10" />
        <div className="h-2 w-2/3 rounded bg-pimenton-text/10" />
      </div>
      {/* "gráfico" vacío (donut gris sin datos) + barras grises */}
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
      {/* palabras vacías */}
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

// Dashboard "Pimentón": panel oscuro real con tiles del Control Room a
// opacidad plena, acentos coral, vivo.
function PimentonDashboard() {
  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl border border-pimenton-dark-border bg-pimenton-dark p-5 sm:p-6">
      <div className="grid grid-cols-2 gap-3">
        <MetricTile
          label="Ventas hoy"
          value="+18%"
          delta="vs ayer"
          cycle={["+18%", "+19%", "+21%"]}
        />
        <MetricTile label="Pedidos" value="1.247" delta="+12%" />
      </div>
      <BarsTile label="Ventas · 7 días" />
      <PlatformsTile />
      <AlertTile text="Menú optimizado en 3 sucursales" />
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
  label: string;
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
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay: reduced ? 0 : delay, ease: EASE }}
      className="flex flex-col"
    >
      <motion.div
        whileHover={
          reduced ? undefined : { scale: 1.015, y: -3 }
        }
        transition={{ duration: 0.3, ease: EASE }}
        className="flex-1"
      >
        {visual}
      </motion.div>
      <p
        className={`mt-6 font-sans text-sm font-semibold uppercase tracking-[0.18em] ${labelClass}`}
      >
        {label}
      </p>
      <p className={`mt-2 text-base leading-relaxed ${textClass}`}>{text}</p>
    </motion.div>
  );
}

export function NoSomosAgencia() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="bg-pimenton-bg px-[5%] py-24 sm:px-16 sm:py-32 lg:px-24">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header centrado */}
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Qué nos diferencia</Eyebrow>
          <motion.h2
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-pimenton-text sm:text-5xl lg:text-6xl"
          >
            {splitHighlight(
              "No somos una agencia. Somos un equipo de operación delivery.",
              "operación",
              "coral",
            )}
          </motion.h2>
          <motion.p
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="mt-5 text-lg leading-relaxed text-pimenton-text-muted"
          >
            La diferencia se ve cuando abres nuestra pantalla.
          </motion.p>
        </div>

        {/* Split: agencia (problema) → Pimentón (solución) */}
        <div className="mt-14 grid grid-cols-1 items-stretch gap-8 sm:mt-20 md:grid-cols-2 lg:gap-12">
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
            visual={<PimentonDashboard />}
            label="Equipo Pimentón"
            labelClass="text-pimenton-accent"
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
