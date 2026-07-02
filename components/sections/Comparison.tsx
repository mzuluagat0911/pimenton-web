"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { Check, X } from "lucide-react";
import { splitHighlight } from "@/components/ui-custom/Highlight";
import { useCopy } from "@/components/i18n/LanguageContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Variant = "off" | "on";
type ComparisonCopy = ReturnType<typeof useCopy>["comparison"];

/**
 * Apila los textos OFF y ON en la misma celda de grid, mostrando solo el
 * del variant y dejando el otro `invisible` (ocupa espacio, no se ve).
 * CLAVE del wipe: ambas caras de la card renderizan AMBOS textos, así las
 * dos caras miden EXACTAMENTE lo mismo y la revelación calza fila por fila.
 */
function Stacked({
  variant,
  off,
  on,
  className = "",
  offClassName = "",
  onClassName = "",
}: {
  variant: Variant;
  off: React.ReactNode;
  on: React.ReactNode;
  className?: string;
  offClassName?: string;
  onClassName?: string;
}) {
  return (
    <span className={`grid ${className}`}>
      <span
        className={`col-start-1 row-start-1 ${offClassName} ${
          variant === "off" ? "" : "invisible"
        }`}
      >
        {off}
      </span>
      <span
        className={`col-start-1 row-start-1 ${onClassName} ${
          variant === "on" ? "" : "invisible"
        }`}
      >
        {on}
      </span>
    </span>
  );
}

/**
 * Una cara completa de la card ("Sin Pimentón" / "Con Pimentón"), estática:
 * la animación ya no vive acá — la hace el scroll, que revela la cara ON
 * por encima de la OFF con un clip-path. Misma estructura y padding en
 * ambas caras (ver Stacked) para que el wipe alinee perfecto.
 */
function CardFace({
  variant,
  copy,
}: {
  variant: Variant;
  copy: ComparisonCopy;
}) {
  const isOn = variant === "on";
  const { off, on, footerLabel, items } = copy;

  return (
    <div
      className={`rounded-2xl border-2 ${
        isOn
          ? "border-pimenton-accent bg-pimenton-dark-soft"
          : "border-pimenton-dark-border bg-pimenton-dark-surface shadow-[0_8px_24px_-16px_rgba(0,0,0,0.5)]"
      }`}
    >
      {/* Card header */}
      <div className="px-6 pt-6 sm:px-10 sm:pt-8">
        <Stacked
          variant={variant}
          off={off.title}
          on={
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src="/assets/logos/principal/logo-coral.webp"
              alt={on.title}
              className="h-7 w-auto sm:h-9"
              draggable={false}
            />
          }
          className="items-center justify-items-start"
          offClassName="font-display text-xl font-semibold tracking-tight text-pimenton-text-on-dark-muted sm:text-2xl"
        />
      </div>

      {/* Items list */}
      <ul className="mt-6 divide-y divide-pimenton-dark-border/60 px-6 sm:mt-8 sm:px-10">
        {items.map((item, i) => (
          <li
            key={i}
            className="grid grid-cols-[auto_1fr] items-start gap-3 py-3.5 sm:gap-4 sm:py-4"
          >
            {/* Icon — ✕ (off) / ✓ coral (on) */}
            <span className="relative mt-0.5 block size-6 sm:size-7">
              {isOn ? (
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-pimenton-accent text-pimenton-bg">
                  <Check className="size-3.5 sm:size-4" strokeWidth={3} />
                </span>
              ) : (
                <span className="absolute inset-0 flex items-center justify-center rounded-full border border-pimenton-dark-border bg-pimenton-dark text-pimenton-text-on-dark-muted">
                  <X className="size-3.5 sm:size-4" strokeWidth={2.5} />
                </span>
              )}
            </span>

            <Stacked
              variant={variant}
              off={item.off}
              on={item.on}
              className="text-sm leading-snug sm:text-base"
              offClassName="text-pimenton-text-on-dark-muted"
              onClassName="text-pimenton-text-on-dark"
            />
          </li>
        ))}
      </ul>

      {/* Card footer */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-pimenton-dark-border/60 px-6 py-4 sm:px-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-pimenton-text-on-dark-muted sm:text-xs">
          {footerLabel}
        </span>
        <Stacked
          variant={variant}
          off={off.footer}
          on={on.footer}
          className="text-sm sm:text-base"
          offClassName="text-pimenton-text-on-dark-muted"
          onClassName="font-medium text-pimenton-accent"
        />
      </div>
    </div>
  );
}

/**
 * ANTES / DESPUÉS con revelación manejada por el scroll (pin + scrub).
 *
 * Llegás scrolleando y la card se ve "Sin Pimentón". Cuando queda centrada
 * en el viewport, el scroll se fija (sticky) y el progreso del scroll va
 * revelando la cara "Con Pimentón" de arriba hacia abajo — una línea de
 * escaneo coral marca el borde de la revelación (la versión scrubbed del
 * efecto "escáner" que antes corría solo con un timer). Al completarse,
 * el scroll se suelta y seguís de largo. Reversible: scrollear hacia
 * arriba des-revela. Sin botón ON/OFF.
 *
 * Mismo patrón que el Control Room (sticky + spacer + useScroll/useSpring
 * de motion, sin GSAP): spacer de 220vh → 100vh de child sticky + ~120vh
 * de recorrido de scroll para el wipe.
 *
 * Reduced motion: sin pin ni wipe — cross-fade simple a "Con Pimentón"
 * cuando la sección entra en viewport.
 */
export function Comparison() {
  const comparison = useCopy().comparison;
  const { heading, headingAccent } = comparison;
  const reduced = useReducedMotion() ?? false;

  const headingRef = useRef<HTMLHeadingElement>(null);
  const inView = useInView(headingRef, { once: true, amount: 0.5 });

  const spacerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ["start start", "end end"],
  });
  // Spring = feel de scrub suave (mismos valores que el Control Room).
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.5,
  });
  // Respiro al inicio y al final del pin: la revelación arranca apenas
  // después de fijarse y se completa apenas antes de soltarse, así el
  // estado final se lee un instante antes de seguir scrolleando.
  const progress = useTransform(smoothed, [0.08, 0.92], [0, 1]);

  // Wipe de arriba hacia abajo: la cara ON muestra su fracción superior.
  const clipBottom = useTransform(progress, (v) => (1 - v) * 100);
  const clipPath = useMotionTemplate`inset(0 0 ${clipBottom}% 0)`;

  // Línea de escaneo en el borde de la revelación (se desvanece en 0 y 1).
  const linePct = useTransform(progress, (v) => v * 100);
  const lineTop = useMotionTemplate`${linePct}%`;
  const lineOpacity = useTransform(progress, [0, 0.02, 0.97, 1], [0, 1, 1, 0]);

  return (
    <section className="relative bg-pimenton-dark px-[5%] sm:px-16 lg:px-24 py-14 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          ref={headingRef}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={
            inView
              ? { opacity: 1, y: 0 }
              : reduced
                ? { opacity: 0 }
                : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-3xl text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text-on-dark sm:text-4xl"
        >
          {splitHighlight(heading, headingAccent, "coral")}
        </motion.h2>

        {reduced ? (
          // Reduced motion: card en flujo normal, sin pin; pasa a "Con
          // Pimentón" con un fade simple al entrar la sección en viewport.
          <div ref={spacerRef} className="relative mt-12 sm:mt-16">
            <CardFace variant="off" copy={comparison} />
            <motion.div
              aria-hidden
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: inView ? 1 : 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <CardFace variant="on" copy={comparison} />
            </motion.div>
          </div>
        ) : (
          // Spacer 220vh: el child sticky (100vh) fija la card centrada y
          // los ~120vh restantes son el recorrido de scroll del wipe.
          <div ref={spacerRef} className="relative mt-12 h-[220vh] sm:mt-16">
            <div className="sticky top-0 flex h-screen items-center">
              <div className="relative w-full">
                {/* Glow coral que crece con la revelación. Vive FUERA del
                    clip (hermano, no hijo) para que el resplandor no quede
                    recortado por el clip-path. */}
                <motion.div
                  aria-hidden
                  className="absolute inset-0 rounded-2xl shadow-[0_24px_60px_-24px_rgba(232,75,60,0.45)]"
                  style={{ opacity: progress }}
                />

                {/* ANTES — en flujo: define la altura de la card. */}
                <CardFace variant="off" copy={comparison} />

                {/* DESPUÉS — encima, revelado por el clip-path del scroll. */}
                <motion.div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ clipPath }}
                >
                  <CardFace variant="on" copy={comparison} />
                </motion.div>

                {/* Línea de escaneo — marca el borde de la revelación y
                    "imprime" el después a su paso (barrido hacia abajo). */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 z-10"
                  style={{ top: lineTop, opacity: lineOpacity }}
                >
                  <div className="h-16 bg-gradient-to-b from-pimenton-accent/25 to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-0.5 -translate-y-1/2 rounded-full bg-pimenton-accent shadow-[0_0_18px_2px_rgba(232,75,60,0.65)]" />
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
