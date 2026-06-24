"use client";

import { motion, useReducedMotion } from "motion/react";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Eyebrow estándar de la página de Servicios: Helvetica uppercase,
 * tracking amplio, coral, con hairline a la izquierda. Coherente con el
 * patrón del Home. Entra con fade + leve translateY al verse.
 */
export function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.p
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`flex items-center text-xs font-medium uppercase tracking-[0.22em] text-pimenton-accent sm:text-sm ${className}`}
    >
      <span
        aria-hidden
        className="mr-3 inline-block h-px w-8 bg-pimenton-accent"
      />
      {children}
    </motion.p>
  );
}
