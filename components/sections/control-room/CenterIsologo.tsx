"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

type Props = {
  className?: string;
  glowInset?: string;
};

export function CenterIsologo({ className = "", glowInset = "-60%" }: Props) {
  const reduced = useReducedMotion() ?? false;
  const [dischargeKey, setDischargeKey] = useState(0);

  // Periodic discharges, random-ish cadence so the system feels alive.
  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      setDischargeKey((k) => k + 1);
      const delay = 1800 + Math.random() * 2400;
      setTimeout(tick, delay);
    };
    const first = setTimeout(tick, 1500);
    return () => {
      cancelled = true;
      clearTimeout(first);
    };
  }, [reduced]);

  return (
    <motion.div
      className={`relative ${className}`}
      animate={reduced ? undefined : { scale: [1, 1.04, 1] }}
      transition={
        reduced
          ? undefined
          : { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <motion.div
        aria-hidden
        className="absolute rounded-full bg-pimenton-accent/40 blur-3xl"
        style={{ inset: glowInset }}
        animate={
          reduced
            ? undefined
            : { opacity: [0.42, 0.6, 0.42], scale: [1, 1.05, 1] }
        }
        transition={
          reduced
            ? undefined
            : { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {!reduced && (
        <motion.div
          key={`flash-${dischargeKey}`}
          aria-hidden
          className="absolute rounded-full bg-pimenton-accent/70 blur-2xl"
          style={{ inset: "-50%" }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.95, 1.25, 1] }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      )}

      <motion.div
        key={`punch-${dischargeKey}`}
        className="relative w-full"
        initial={{ scale: 1 }}
        animate={reduced ? undefined : { scale: [1, 1.06, 1] }}
        transition={reduced ? undefined : { duration: 0.5, ease: "easeOut" }}
      >
        {/* La imagen (webp cuadrada) define la altura del isologo vía su
            aspecto natural (w-full + h-auto). Evita el combo frágil
            aspect-square + h-full, que en WebKit/producción puede colapsar
            o desalinear el isologo. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/logos/isologo/isologo-crema.webp"
          alt="Pimentón"
          className="relative block h-auto w-full object-contain"
        />
      </motion.div>
    </motion.div>
  );
}
