"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

// Link de Next con capacidades motion — mismo hover (scale + spring) que el
// CTA primario del hero del Home / el CTA de Servicios.
const MotionLink = motion.create(Link);

// Styling canónico del CTA de la web (replica el CTA primario del hero del
// Home): pill full-width en mobile / auto en sm+, sin uppercase, Encode Sans.
// `coral` es el default; `dark` (pill oscuro, texto crema) se usa sobre
// fondos coral donde el coral no contrastaría.
const PILL_BASE =
  "inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-base font-semibold transition-[background-color,box-shadow] duration-300 sm:w-auto sm:text-lg";

const PILL_VARIANT = {
  coral:
    "bg-pimenton-accent text-pimenton-bg shadow-xl shadow-pimenton-accent/40 hover:bg-pimenton-accent-hover hover:shadow-pimenton-accent/60",
  dark: "bg-pimenton-dark text-pimenton-bg shadow-xl shadow-pimenton-dark/40 hover:bg-pimenton-dark-soft hover:shadow-pimenton-dark/60",
} as const;

/**
 * CTA reutilizable. Por defecto navega client-side (next/link). Con
 * `external` se renderiza como <a target="_blank"> para enlaces salientes
 * (p. ej. WhatsApp / Google Form). `icon` es opcional (a la izquierda del
 * label). `variant` cambia el color del pill (coral por defecto, dark para
 * fondos coral).
 */
export function CtaPill({
  href,
  label,
  external = false,
  icon,
  iconPosition = "left",
  className = "",
  variant = "coral",
}: {
  href: string;
  label: string;
  external?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  variant?: "coral" | "dark";
}) {
  const PILL = `${PILL_BASE} ${PILL_VARIANT[variant]}`;
  const reduced = useReducedMotion() ?? false;
  const motionProps = {
    whileHover: reduced ? undefined : { scale: 1.03 },
    whileTap: reduced ? undefined : { scale: 0.97 },
    transition: { type: "spring" as const, stiffness: 400, damping: 22 },
  };

  const content =
    iconPosition === "right" ? (
      <>
        {label}
        {icon}
      </>
    ) : (
      <>
        {icon}
        {label}
      </>
    );

  if (external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...motionProps}
        className={`${PILL} ${className}`}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <MotionLink href={href} {...motionProps} className={`${PILL} ${className}`}>
      {content}
    </MotionLink>
  );
}
