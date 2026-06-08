"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Tiles ILUSTRATIVOS del Control Room (no funcionales, sin data real).
 * Pensados para fondo oscuro: card dark-soft + borde sutil + texto crema
 * con acentos coral. Los uso scattered y a baja opacidad en el hero, y
 * apilados a opacidad plena en el split "No somos una agencia".
 *
 * El indicador "OK" usa pimenton-mint (no el verde de WhatsApp): respeta
 * la paleta y la regla del proyecto, y lee igual como "estado sano".
 */

const tileBase =
  "rounded-xl border border-pimenton-dark-border bg-pimenton-dark-soft p-4";

export function MetricTile({
  label,
  value,
  delta,
  cycle,
  className = "",
}: {
  label: string;
  value: string;
  delta?: string;
  /** Valores por los que cicla el número (micro-animación, opcional). */
  cycle?: readonly string[];
  className?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const [display, setDisplay] = useState(value);
  const idxRef = useRef(0);

  useEffect(() => {
    if (reduced || !cycle || cycle.length === 0) return;
    // arranca tras un delay para no competir con la entrada del hero
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        idxRef.current = (idxRef.current + 1) % cycle.length;
        setDisplay(cycle[idxRef.current]!);
      }, 2600);
    }, 1800);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [reduced, cycle]);

  return (
    <div className={`${tileBase} ${className}`}>
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-pimenton-text-on-dark-muted">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-bold leading-none tracking-tight tabular-nums text-pimenton-text-on-dark">
        {display}
      </p>
      {delta && (
        <p className="mt-1.5 font-sans text-xs font-medium text-pimenton-accent">
          {delta}
        </p>
      )}
    </div>
  );
}

export function BarsTile({
  label,
  heights = [40, 65, 50, 80, 60, 95, 72],
  className = "",
}: {
  label: string;
  heights?: number[];
  className?: string;
}) {
  return (
    <div className={`${tileBase} ${className}`}>
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-pimenton-text-on-dark-muted">
        {label}
      </p>
      <div className="mt-3 flex h-12 items-end gap-1.5">
        {heights.map((h, i) => (
          <span
            key={i}
            className={`flex-1 rounded-sm ${
              i === heights.length - 2
                ? "bg-pimenton-accent"
                : "bg-pimenton-text-on-dark-muted/30"
            }`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function PlatformsTile({ className = "" }: { className?: string }) {
  const platforms = ["Rappi", "PedidosYa", "Uber Eats", "Glovo"];
  return (
    <div className={`${tileBase} ${className}`}>
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-pimenton-text-on-dark-muted">
        Plataformas
      </p>
      <ul className="mt-3 space-y-2">
        {platforms.map((p) => (
          <li
            key={p}
            className="flex items-center justify-between gap-3 font-sans text-xs text-pimenton-text-on-dark"
          >
            <span>{p}</span>
            <span className="flex items-center gap-1.5 text-pimenton-text-on-dark-muted">
              <span
                aria-hidden
                className="inline-block size-1.5 rounded-full bg-pimenton-mint"
              />
              OK
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AlertTile({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-pimenton-accent/30 bg-pimenton-accent/10 p-4 ${className}`}
    >
      <span
        aria-hidden
        className="mt-0.5 inline-block size-2 flex-shrink-0 rounded-full bg-pimenton-accent"
      />
      <p className="font-sans text-xs leading-relaxed text-pimenton-text-on-dark">
        {text}
      </p>
    </div>
  );
}

export function OrderRowsTile({ className = "" }: { className?: string }) {
  const rows = [
    { id: "#1247", state: "Entregado" },
    { id: "#1246", state: "En camino" },
    { id: "#1245", state: "Entregado" },
    { id: "#1244", state: "Preparando" },
  ];
  return (
    <div className={`${tileBase} ${className}`}>
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-pimenton-text-on-dark-muted">
        Pedidos en curso
      </p>
      <ul className="mt-3 space-y-2">
        {rows.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between gap-3 border-b border-pimenton-dark-border pb-2 font-sans text-xs text-pimenton-text-on-dark last:border-0 last:pb-0"
          >
            <span className="tabular-nums">{r.id}</span>
            <span className="text-pimenton-text-on-dark-muted">{r.state}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
