"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Parsea un valor de métrica "limpio": un único número con prefijo/sufijo
 * (p. ej. "+30%", "+8 pts", "70+", "3 meses", "9"). Devuelve null si NO es
 * animable — valores con flecha ("6.000 → 11.000", "0 → full") se muestran
 * estáticos.
 */
function parseMetric(value: string) {
  if (value.includes("→")) return null;
  const m = value.match(/^(\D*)(\d[\d.]*)(.*)$/);
  if (!m) return null;
  const target = parseInt(m[2].replace(/\./g, ""), 10);
  if (!Number.isFinite(target)) return null;
  return { prefix: m[1], target, suffix: m[3] };
}

/**
 * Número con count-up al entrar en viewport (una vez). Si el valor no es un
 * número limpio, lo muestra estático. prefers-reduced-motion → estático.
 */
export function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const parsed = parseMetric(value);
  const animatable = !!parsed && !reduced;
  const [display, setDisplay] = useState(
    animatable ? `${parsed!.prefix}0${parsed!.suffix}` : value,
  );

  useEffect(() => {
    if (!animatable || !inView || !parsed) return;
    const controls = animate(0, parsed.target, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) =>
        setDisplay(`${parsed.prefix}${Math.round(v)}${parsed.suffix}`),
    });
    return () => controls.stop();
  }, [animatable, inView, parsed]);

  return (
    <span ref={ref} className={className}>
      {animatable ? display : value}
    </span>
  );
}
