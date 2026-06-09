"use client";

import type { MouseEvent } from "react";
import Image from "next/image";
import { motion, useSpring, useReducedMotion } from "motion/react";

const SPRING = { stiffness: 220, damping: 18, mass: 0.4 } as const;

/**
 * Imagen con tilt 3D que sigue al cursor (rotateX/rotateY suavizados por
 * spring) + leve scale en hover. next/image con `fill` dentro de un
 * contenedor `relative` redondeado. El `className` define el tamaño/ratio
 * (p. ej. "aspect-[4/3] w-full"). prefers-reduced-motion desactiva el tilt.
 */
export function TiltImage({
  src,
  alt,
  sizes,
  className = "",
  max = 8,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  max?: number;
  priority?: boolean;
}) {
  const reduced = useReducedMotion() ?? false;
  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rotateY.set(px * max * 2);
    rotateX.set(-py * max * 2);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={
        reduced
          ? undefined
          : { rotateX, rotateY, transformPerspective: 1000 }
      }
      whileHover={reduced ? undefined : { scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`relative overflow-hidden rounded-xl will-change-transform ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </motion.div>
  );
}
