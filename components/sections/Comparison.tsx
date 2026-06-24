"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { Check, X } from "lucide-react";
import { splitHighlight } from "@/components/ui-custom/Highlight";
import { useCopy } from "@/components/i18n/LanguageContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ITEM_STAGGER = 0.08;

type CrossFadeProps = {
  active: boolean;
  delay?: number;
  duration?: number;
  className?: string;
  offClassName?: string;
  onClassName?: string;
  off: React.ReactNode;
  on: React.ReactNode;
};

function CrossFade({
  active,
  delay = 0,
  duration = 0.4,
  className = "",
  offClassName = "",
  onClassName = "",
  off,
  on,
}: CrossFadeProps) {
  return (
    <span className={`grid ${className}`}>
      <motion.span
        animate={{ opacity: active ? 0 : 1, y: active ? -4 : 0 }}
        transition={{ duration, delay, ease: EASE }}
        className={`col-start-1 row-start-1 ${offClassName}`}
      >
        {off}
      </motion.span>
      <motion.span
        animate={{ opacity: active ? 1 : 0, y: active ? 0 : 4 }}
        transition={{ duration, delay, ease: EASE }}
        className={`col-start-1 row-start-1 ${onClassName}`}
      >
        {on}
      </motion.span>
    </span>
  );
}

function ComparisonItem({
  offText,
  onText,
  index,
  active,
  reduced,
  scanning,
}: {
  offText: string;
  onText: string;
  index: number;
  active: boolean;
  reduced: boolean;
  scanning: boolean;
}) {
  // Durante el escáner: stagger más amplio (los ítems se prenden uno por uno,
  // en sincronía con el barrido) y flip más lento, para que se vea claro.
  const stagger = scanning ? 0.22 : ITEM_STAGGER;
  const delay = reduced ? 0 : index * stagger;
  const iconDuration = reduced ? 0.2 : scanning ? 0.5 : 0.35;
  const textDuration = reduced ? 0.2 : scanning ? 0.55 : 0.45;

  return (
    <li className="grid grid-cols-[auto_1fr] items-start gap-3 py-3.5 sm:gap-4 sm:py-4">
      {/* Icon — stacked ✕ and ✓ */}
      <div className="relative mt-0.5 size-6 sm:size-7">
        <motion.span
          aria-hidden
          animate={{
            opacity: active ? 0 : 1,
            scale: active ? (reduced ? 1 : 0.6) : 1,
            rotate: reduced ? 0 : active ? -90 : 0,
          }}
          transition={{ duration: iconDuration, delay, ease: EASE }}
          className="absolute inset-0 flex items-center justify-center rounded-full border border-pimenton-dark-border bg-pimenton-dark text-pimenton-text-on-dark-muted"
        >
          <X className="size-3.5 sm:size-4" strokeWidth={2.5} />
        </motion.span>
        <motion.span
          aria-hidden
          animate={{
            opacity: active ? 1 : 0,
            scale: active ? 1 : reduced ? 1 : 0.6,
            rotate: reduced ? 0 : active ? 0 : 90,
          }}
          transition={{ duration: iconDuration, delay, ease: EASE }}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-pimenton-accent text-pimenton-bg"
        >
          <Check className="size-3.5 sm:size-4" strokeWidth={3} />
        </motion.span>
      </div>

      {/* Text — stacked off and on */}
      <div className="grid text-sm leading-snug sm:text-base">
        <motion.p
          animate={{ opacity: active ? 0 : 1, y: active ? -4 : 0 }}
          transition={{ duration: textDuration, delay, ease: EASE }}
          className="col-start-1 row-start-1 text-pimenton-text-on-dark-muted"
        >
          {offText}
        </motion.p>
        <motion.p
          animate={{ opacity: active ? 1 : 0, y: active ? 0 : 4 }}
          transition={{ duration: textDuration, delay, ease: EASE }}
          className="col-start-1 row-start-1 text-pimenton-text-on-dark"
        >
          {onText}
        </motion.p>
      </div>
    </li>
  );
}

/**
 * Switch tipo iOS — riel ovalado + thumb circular que se desliza.
 * - OFF: riel dark-surface + thumb crema a la izquierda + halo de invitación
 *   (anillo coral que respira) → invita a tocarlo.
 * - ON: riel coral con glow + thumb a la derecha. Sin pulso (queda "calmo").
 * Tamaño: w-24 h-14 (96 × 56) — tap target generoso, supera 44×44.
 */
function SwitchToggle({
  active,
  onToggle,
  reduced,
  aria,
}: {
  active: boolean;
  onToggle: () => void;
  reduced: boolean;
  aria: string;
}) {
  // Distancia que viaja el thumb. Riel 96px, padding 6px×2, thumb 44px →
  // 96 − 12 − 44 = 40px.
  const TRAVEL = 40;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={aria}
      onClick={onToggle}
      className="relative flex h-14 w-24 cursor-pointer items-center rounded-full p-1.5 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-pimenton-accent focus-visible:ring-offset-2 focus-visible:ring-offset-pimenton-dark"
      style={{
        backgroundColor: active
          ? "var(--color-pimenton-accent)"
          : "var(--color-pimenton-dark-surface)",
        borderWidth: active ? 0 : 1,
        borderStyle: "solid",
        borderColor: "var(--color-pimenton-dark-border)",
        boxShadow: active
          ? "0 0 32px 0 rgba(232, 75, 60, 0.5)"
          : "inset 0 1px 0 0 rgba(0,0,0,0.25)",
      }}
    >
      {/* Halo de invitación — sólo cuando OFF, respeta reduced-motion.
          Coherente con el latido del Control Room. */}
      {!reduced && !active && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-pimenton-accent"
          animate={{ scale: [1, 1.18, 1], opacity: [0, 0.7, 0] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Thumb */}
      <motion.span
        aria-hidden
        className="block size-11 rounded-full bg-pimenton-bg shadow-[0_2px_6px_-1px_rgba(0,0,0,0.4)]"
        animate={{ x: active ? TRAVEL : 0 }}
        transition={
          reduced
            ? { duration: 0.2, ease: EASE }
            : { type: "spring", stiffness: 520, damping: 32, mass: 0.6 }
        }
      />
    </button>
  );
}

export function Comparison() {
  const { heading, off, on, footerLabel, toggleAria, items } =
    useCopy().comparison;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduced = useReducedMotion() ?? false;

  const [active, setActive] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);
  // `scanning`: la PRIMERA activación al scrollear corre con una animación más
  // lenta y secuencial (efecto "escáner" — los ítems se revelan uno a uno y el
  // barrido baja más despacio). Los toggles manuales posteriores son rápidos.
  const [scanning, setScanning] = useState(false);

  // Al entrar en viewport se activa sola con el efecto escáner. El efecto sólo
  // corre en la transición a inView (once: true), así que si el usuario la
  // apaga manualmente después, queda apagada (no se vuelve a forzar).
  useEffect(() => {
    if (!inView) return;
    setActive(true);
    setScanning(true);
    setPulseCount((c) => c + 1);
    const t = setTimeout(() => setScanning(false), 1700);
    return () => clearTimeout(t);
  }, [inView]);

  const toggle = () => {
    setScanning(false); // toggle manual → rápido
    setActive((a) => !a);
    setPulseCount((c) => c + 1);
  };

  // Duraciones de cross-fade: más lentas durante el escáner.
  const crossDur = scanning ? 0.7 : 0.4;

  return (
    <section
      ref={ref}
      className="relative bg-pimenton-dark px-[5%] sm:px-16 lg:px-24 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-4xl">
        <motion.h2
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
          {splitHighlight(heading, "opera en serio.", "coral")}
        </motion.h2>

        {/* The transformation card */}
        <motion.div
          className="relative mt-12 overflow-hidden rounded-2xl sm:mt-16"
          animate={{
            backgroundColor: active
              ? "var(--color-pimenton-dark-soft)"
              : "var(--color-pimenton-dark-surface)",
            borderColor: active
              ? "var(--color-pimenton-accent)"
              : "var(--color-pimenton-dark-border)",
            boxShadow: active
              ? "0 24px 60px -24px rgba(232, 75, 60, 0.45)"
              : "0 8px 24px -16px rgba(0, 0, 0, 0.5)",
          }}
          style={{ borderWidth: 2, borderStyle: "solid" }}
          transition={{ duration: scanning ? 0.9 : 0.6, ease: EASE }}
        >
          {/* Energy pulse — vertical sweep on every toggle */}
          <AnimatePresence>
            {!reduced && pulseCount > 0 && (
              <motion.span
                key={pulseCount}
                aria-hidden
                initial={{ y: "-100%", opacity: scanning ? 0 : 0.8 }}
                animate={
                  scanning
                    ? { y: "100%", opacity: [0, 0.9, 0.9, 0] }
                    : { y: "100%", opacity: 0 }
                }
                transition={
                  scanning
                    ? { duration: 1.5, ease: "easeInOut", times: [0, 0.1, 0.85, 1] }
                    : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
                }
                className={`pointer-events-none absolute inset-x-0 z-10 bg-gradient-to-b from-transparent to-transparent ${
                  scanning
                    ? "h-32 via-pimenton-accent/55"
                    : "h-48 via-pimenton-accent/35"
                }`}
              />
            )}
          </AnimatePresence>

          {/* Card header */}
          <div className="relative z-0 px-6 pt-6 sm:px-10 sm:pt-8">
            <CrossFade
              active={active}
              duration={crossDur}
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
          <ul className="relative z-0 mt-6 divide-y divide-pimenton-dark-border/60 px-6 sm:mt-8 sm:px-10">
            {items.map((item, i) => (
              <ComparisonItem
                key={i}
                offText={item.off}
                onText={item.on}
                index={i}
                active={active}
                reduced={reduced}
                scanning={scanning}
              />
            ))}
          </ul>

          {/* Card footer */}
          <div className="relative z-0 mt-4 flex items-center justify-between gap-3 border-t border-pimenton-dark-border/60 px-6 py-4 sm:px-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-pimenton-text-on-dark-muted sm:text-xs">
              {footerLabel}
            </span>
            <CrossFade
              active={active}
              duration={crossDur}
              off={off.footer}
              on={on.footer}
              className="text-sm sm:text-base"
              offClassName="text-pimenton-text-on-dark-muted"
              onClassName="font-medium text-pimenton-accent"
            />
          </div>
        </motion.div>

        {/* Switch CTA — kicker arriba, switch en el medio, label abajo */}
        <div className="mt-10 flex flex-col items-center gap-3 sm:mt-12">
          <CrossFade
            active={active}
            duration={crossDur}
            off={off.toggleKicker}
            on={on.toggleKicker}
            className="justify-items-center"
            offClassName="font-mono text-[10px] uppercase tracking-[0.22em] text-pimenton-accent sm:text-xs"
            onClassName="font-mono text-[10px] uppercase tracking-[0.22em] text-pimenton-accent sm:text-xs"
          />
          <SwitchToggle
            active={active}
            onToggle={toggle}
            reduced={reduced}
            aria={toggleAria}
          />
          <CrossFade
            active={active}
            duration={crossDur}
            off={off.toggleLabel}
            on={on.toggleLabel}
            className="justify-items-center"
            offClassName="text-sm font-semibold text-pimenton-text-on-dark sm:text-base"
            onClassName="text-sm font-normal text-pimenton-text-on-dark-muted sm:text-base"
          />
        </div>
      </div>
    </section>
  );
}
