"use client";

import { motion, useReducedMotion } from "motion/react";
import { Highlight } from "@/components/ui-custom/Highlight";
import { EASE } from "./Eyebrow";
import {
  AlertTile,
  BarsTile,
  MetricTile,
  OrderRowsTile,
  PlatformsTile,
} from "./ControlRoomTiles";

// Mosaico de tiles ilustrativos, distribuidos de forma asimétrica. Cada
// entrada define posición/ancho/rotación. Los `mobileHide` se ocultan en
// mobile para que no sature. Opacidad global baja en el contenedor.
type Placed = {
  node: React.ReactNode;
  style: React.CSSProperties;
  mobileHide?: boolean;
};

const MOSAIC: Placed[] = [
  {
    node: (
      <MetricTile
        label="Pedidos hoy"
        value="1.247"
        delta="+12% vs ayer"
        cycle={["1.247", "1.251", "1.258", "1.263"]}
      />
    ),
    style: { top: "10%", left: "3%", width: 210, rotate: "-3deg" },
  },
  {
    node: <BarsTile label="Ventas · 7 días" />,
    style: { top: "6%", left: "68%", width: 230, rotate: "2.5deg" },
  },
  {
    node: <PlatformsTile />,
    style: { top: "52%", left: "5%", width: 200, rotate: "1.5deg" },
    mobileHide: true,
  },
  {
    node: (
      <MetricTile
        label="Ticket promedio"
        value="$24,50"
        delta="+8% mensual"
        cycle={["$24,50", "$24,80", "$25,10"]}
      />
    ),
    style: { top: "66%", left: "60%", width: 205, rotate: "-2deg" },
  },
  {
    node: <AlertTile text="Menú optimizado en 3 plataformas" />,
    style: { top: "38%", left: "74%", width: 240, rotate: "3deg" },
    mobileHide: true,
  },
  {
    node: <OrderRowsTile />,
    style: { top: "70%", left: "26%", width: 215, rotate: "-1deg" },
    mobileHide: true,
  },
  {
    node: (
      <MetricTile label="Rentabilidad" value="+18%" delta="trimestral" />
    ),
    style: { top: "30%", left: "40%", width: 190, rotate: "2deg" },
    mobileHide: true,
  },
];

export function ServiciosHero() {
  const reduced = useReducedMotion() ?? false;

  const fadeUp = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden bg-pimenton-dark px-[5%] py-24 sm:px-16 sm:py-28 lg:px-24">
      {/* Mosaico de fondo — atmósfera "tecnología operando", baja opacidad. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.22 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {MOSAIC.map((tile, i) => (
          <div
            key={i}
            className={`absolute ${tile.mobileHide ? "hidden md:block" : ""}`}
            style={tile.style}
          >
            {tile.node}
          </div>
        ))}
      </motion.div>

      {/* Texto del hero */}
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.h1
          {...fadeUp(0)}
          className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-tight text-pimenton-bg sm:text-6xl lg:text-7xl"
        >
          Soluciones de <Highlight color="coral">delivery</Highlight>
        </motion.h1>

        <motion.p
          {...fadeUp(0.14)}
          className="mt-7 max-w-[640px] text-lg leading-relaxed text-pimenton-text-on-dark-muted sm:text-xl"
        >
          Gestionamos tu delivery de punta a punta para que vendas más, con
          menos fricción y mayor rentabilidad.
        </motion.p>
      </div>
    </section>
  );
}
