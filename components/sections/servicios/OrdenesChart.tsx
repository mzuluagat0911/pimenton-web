"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const MONTHS = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
  "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
];
// Serie que suma 12.850 y cierra en 1.750 (DIC) — réplica del video.
const VALUES = [200, 450, 500, 1050, 950, 900, 1150, 1350, 1500, 1600, 1450, 1750];

// Geometría del SVG (viewBox). Aspect cercano al panel para minimizar
// distorsión al estirar con preserveAspectRatio="none".
const VB_W = 600;
const VB_H = 340;
const PAD = { left: 6, right: 6, top: 40, bottom: 28 };
const Y_MAX = 2000;

const x = (i: number) =>
  PAD.left + (i * (VB_W - PAD.left - PAD.right)) / (VALUES.length - 1);
const y = (v: number) =>
  VB_H - PAD.bottom - (v / Y_MAX) * (VB_H - PAD.top - PAD.bottom);

const linePath = VALUES.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
const areaPath =
  `${linePath} L ${x(VALUES.length - 1)} ${VB_H - PAD.bottom} L ${x(0)} ${VB_H - PAD.bottom} Z`;

/**
 * Réplica horizontal y full-width del video "ÓRDENES 2025": panel oscuro
 * con un gráfico de área coral que se dibuja al entrar en viewport.
 * Reemplaza al video vertical (1080×2400) que no entraba a tope de ancho.
 */
export function OrdenesChart() {
  const reduced = useReducedMotion() ?? false;
  const gradId = useId();

  return (
    <div className="flex h-auto flex-col overflow-hidden rounded-2xl border border-pimenton-dark-border bg-pimenton-dark p-6 sm:p-7 md:h-[460px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-pimenton-text-on-dark-muted">
            Evolución mensual
          </p>
          <h4 className="mt-1.5 font-display text-2xl font-bold leading-none tracking-tight text-pimenton-text-on-dark sm:text-3xl">
            Órdenes <span className="text-pimenton-accent">2025</span>
          </h4>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-pimenton-text-on-dark-muted">
              Acumuladas
            </p>
            <p className="mt-1 font-display text-xl font-bold tabular-nums text-pimenton-accent sm:text-2xl">
              12.850
            </p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-pimenton-text-on-dark-muted">
              Diciembre
            </p>
            <p className="mt-1 font-display text-xl font-bold tabular-nums text-pimenton-text-on-dark sm:text-2xl">
              1.750
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-4 min-h-[180px] flex-1">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          className="h-full w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-pimenton-accent)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--color-pimenton-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* gridlines suaves */}
          {[500, 1000, 1500, 2000].map((g) => (
            <line
              key={g}
              x1={PAD.left}
              x2={VB_W - PAD.right}
              y1={y(g)}
              y2={y(g)}
              stroke="var(--color-pimenton-dark-border)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* área */}
          <motion.path
            d={areaPath}
            fill={`url(#${gradId})`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduced ? 0.2 : 0.8, delay: reduced ? 0 : 0.5, ease: EASE }}
          />

          {/* línea (se dibuja) */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="var(--color-pimenton-accent)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduced ? 0 : 1.3, ease: EASE }}
          />

          {/* puntos + valores */}
          {VALUES.map((v, i) => (
            <motion.g
              key={i}
              initial={reduced ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.3,
                delay: reduced ? 0 : 0.6 + i * 0.07,
                ease: EASE,
              }}
            >
              <circle
                cx={x(i)}
                cy={y(v)}
                r={3}
                fill="var(--color-pimenton-dark)"
                stroke="var(--color-pimenton-accent)"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={x(i)}
                y={y(v) - 10}
                textAnchor="middle"
                className="fill-pimenton-text-on-dark-muted"
                style={{ fontSize: 11, fontVariantNumeric: "tabular-nums" }}
              >
                {v.toLocaleString("es-ES")}
              </text>
            </motion.g>
          ))}

          {/* labels de meses */}
          {MONTHS.map((m, i) => (
            <text
              key={m}
              x={x(i)}
              y={VB_H - 8}
              textAnchor="middle"
              className="fill-pimenton-text-on-dark-muted"
              style={{ fontSize: 10, letterSpacing: "0.05em" }}
            >
              {m}
            </text>
          ))}
        </svg>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-pimenton-dark-border pt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-pimenton-text-on-dark-muted">
        <span>Órdenes mensuales · 2025</span>
        <span>Enero → Diciembre</span>
      </div>
    </div>
  );
}
