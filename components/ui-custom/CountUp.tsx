"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
 *
 * Robustez: si el IntersectionObserver no dispara (algunos entornos), un
 * fallback muestra el valor final directo a los 2.5s → el número nunca queda
 * "tildado" en 0.
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
  const inView = useInView(ref, { once: true, amount: 0.4 });
  // useMemo estabiliza la identidad de `parsed`: sin esto parseMetric
  // devolvía un objeto nuevo en cada render → el effect (que depende de
  // `parsed`) se reiniciaba en cada onUpdate y el número quedaba en 0.
  const parsed = useMemo(() => parseMetric(value), [value]);
  const animatable = !!parsed && !reduced;
  const [display, setDisplay] = useState(
    animatable ? `${parsed!.prefix}0${parsed!.suffix}` : value,
  );
  const doneRef = useRef(false);

  // Count-up cuando entra en viewport.
  useEffect(() => {
    if (!animatable || !inView || !parsed || doneRef.current) return;
    doneRef.current = true;
    const controls = animate(0, parsed.target, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) =>
        setDisplay(`${parsed.prefix}${Math.round(v)}${parsed.suffix}`),
    });
    return () => controls.stop();
  }, [animatable, inView, parsed]);

  // Fallback de seguridad: si el observer nunca dispara, mostramos el valor
  // final directo (sin depender de la animación).
  useEffect(() => {
    if (!animatable) return;
    const t = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        setDisplay(value);
      }
    }, 2500);
    return () => clearTimeout(t);
  }, [animatable, value]);

  return (
    <span ref={ref} className={className}>
      {animatable ? display : value}
    </span>
  );
}
