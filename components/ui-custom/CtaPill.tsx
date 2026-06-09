"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

// Link de Next con capacidades motion — mismo hover (scale + spring) que el
// CTA primario del hero del Home / el CTA de Servicios.
const MotionLink = motion.create(Link);

// Styling canónico del CTA coral de la web (idéntico al CtaButton de
// Services.tsx, que a su vez replica el CTA primario del hero del Home):
// pill coral, full-width en mobile / auto en sm+, sin uppercase, Encode Sans.
const PILL =
  "inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-pimenton-accent px-7 py-3.5 text-base font-semibold text-pimenton-bg shadow-xl shadow-pimenton-accent/40 transition-[background-color,box-shadow] duration-300 hover:bg-pimenton-accent-hover hover:shadow-pimenton-accent/60 sm:w-auto sm:text-lg";

/**
 * CTA coral reutilizable. Por defecto navega client-side (next/link). Con
 * `external` se renderiza como <a target="_blank"> para enlaces salientes
 * (p. ej. WhatsApp). `icon` es opcional (se renderiza a la izquierda del
 * label con el gap del pill).
 */
export function CtaPill({
  href,
  label,
  external = false,
  icon,
  className = "",
}: {
  href: string;
  label: string;
  external?: boolean;
  icon?: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const motionProps = {
    whileHover: reduced ? undefined : { scale: 1.03 },
    whileTap: reduced ? undefined : { scale: 0.97 },
    transition: { type: "spring" as const, stiffness: 400, damping: 22 },
  };

  if (external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...motionProps}
        className={`${PILL} ${className}`}
      >
        {icon}
        {label}
      </motion.a>
    );
  }

  return (
    <MotionLink href={href} {...motionProps} className={`${PILL} ${className}`}>
      {icon}
      {label}
    </MotionLink>
  );
}
