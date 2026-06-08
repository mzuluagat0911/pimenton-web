"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { Check } from "lucide-react";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { Highlight } from "@/components/ui-custom/Highlight";
import { clients } from "@/data/clients";
import { copy } from "@/data/copy";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Cantidad de logos visibles en el stack. Es el "ancho" del wall — más
// de 5 empieza a comerse el espacio editorial en columnas anchas.
const SHOWCASE_SLOTS = 5;

/**
 * Stack de logos de clientes que va rotando. Cada slot mantiene su
 * posición en el stack; el contenido del slot cambia con un crossfade
 * cuando le toca rotar. Garantiza que ningún cliente aparezca en dos
 * slots a la vez (los swaps eligen sólo entre clientes que no estén
 * actualmente visibles).
 *
 * Bajo prefers-reduced-motion: rotación apagada, muestra los primeros
 * SHOWCASE_SLOTS clientes estáticos.
 */
function RotatingClientLogos({ reduced }: { reduced: boolean }) {
  const [indices, setIndices] = useState<number[]>(() =>
    Array.from({ length: SHOWCASE_SLOTS }, (_, i) => i),
  );

  useEffect(() => {
    if (reduced) return;
    // Si no hay más clientes que slots, no hay nada para rotar.
    if (clients.length <= SHOWCASE_SLOTS) return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      setIndices((prev) => {
        const used = new Set(prev);
        const available: number[] = [];
        for (let i = 0; i < clients.length; i++) {
          if (!used.has(i)) available.push(i);
        }
        if (available.length === 0) return prev;
        const slotToSwap = Math.floor(Math.random() * prev.length);
        const newClientIdx =
          available[Math.floor(Math.random() * available.length)]!;
        const next = [...prev];
        next[slotToSwap] = newClientIdx;
        return next;
      });
      // Próximo tick en 2.5–5s — random para que no se sienta robótico.
      const wait = 2500 + Math.random() * 2500;
      timeoutId = setTimeout(tick, wait);
    };

    // Arrancamos después de 2s para que el usuario alcance a ver el
    // stack inicial antes de que empiece a moverse.
    timeoutId = setTimeout(tick, 2000);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [reduced]);

  return (
    <div className="flex -space-x-2.5">
      {indices.map((clientIdx, slotIdx) => {
        const client = clients[clientIdx];
        if (!client) return null;
        return (
          <div
            key={slotIdx}
            className="relative size-10 overflow-hidden rounded-full border-2 border-pimenton-bg bg-pimenton-dark sm:size-11"
            style={{ zIndex: SHOWCASE_SLOTS - slotIdx }}
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={client.logo}
                src={client.logo}
                alt=""
                aria-hidden
                initial={
                  reduced
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 0.85 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.85 }
                }
                transition={{
                  duration: reduced ? 0.2 : 0.55,
                  ease: EASE,
                }}
                className="absolute inset-0 size-full object-cover"
                draggable={false}
                loading="lazy"
              />
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Sección de cierre del home: bloque editorial a la izquierda
 * (eyebrow / heading / subhead / prueba social / 3 bullets) +
 * formulario inline a la derecha. El ancho de sección replica el de
 * Stats (padding wrapper afuera del max-w-7xl + ClientMarquee bleed
 * fuera del wrapper).
 */
export function Consultancy() {
  const { heading, headingAccent, description, socialProof, bullets } =
    copy.consultationForm.intro;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduced = useReducedMotion() ?? false;

  // Split del heading para resaltar el accent ("en 4 pasos.") en amarillo.
  // Si por algún motivo el accent no está en el heading, mostramos el
  // string entero sin resaltado (safe fallback).
  const accentIndex = heading.indexOf(headingAccent);
  const headingBefore = accentIndex >= 0 ? heading.slice(0, accentIndex) : heading;
  const headingAfter =
    accentIndex >= 0 ? heading.slice(accentIndex + headingAccent.length) : "";

  return (
    <section
      ref={ref}
      id="contacto"
      className="scroll-mt-24 bg-pimenton-bg py-14 sm:py-20"
    >
      <div className="px-[5%] sm:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* ── Columna izquierda: editorial ── */}
            <div className="flex flex-col">
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
                className="text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-4xl lg:text-5xl"
              >
                {headingBefore}
                {accentIndex >= 0 && (
                  <Highlight color="yellow">{headingAccent}</Highlight>
                )}
                {headingAfter}
              </motion.h2>

              <motion.p
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={
                  inView
                    ? { opacity: 1, y: 0 }
                    : reduced
                      ? { opacity: 0 }
                      : { opacity: 0, y: 16 }
                }
                transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                className="mt-5 max-w-xl text-base leading-relaxed text-pimenton-text-soft sm:text-lg"
              >
                {description}
              </motion.p>

              {/* Prueba social: stack de logos + texto */}
              <motion.div
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={
                  inView
                    ? { opacity: 1, y: 0 }
                    : reduced
                      ? { opacity: 0 }
                      : { opacity: 0, y: 16 }
                }
                transition={{ duration: 0.7, delay: 0.32, ease: EASE }}
                className="mt-9 flex items-center gap-4 sm:mt-10"
              >
                <RotatingClientLogos reduced={reduced} />
                <p className="text-sm font-medium leading-snug text-pimenton-text sm:text-base">
                  {socialProof}
                </p>
              </motion.div>

              {/* Separador */}
              <motion.div
                aria-hidden
                initial={reduced ? { opacity: 0 } : { opacity: 0, scaleX: 0 }}
                animate={
                  inView
                    ? { opacity: 1, scaleX: 1 }
                    : reduced
                      ? { opacity: 0 }
                      : { opacity: 0, scaleX: 0 }
                }
                transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
                style={{ transformOrigin: "left" }}
                className="mt-9 h-px w-full bg-pimenton-border sm:mt-10"
              />

              {/* 3 bullets con check coral */}
              <motion.ul
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={
                  inView
                    ? { opacity: 1, y: 0 }
                    : reduced
                      ? { opacity: 0 }
                      : { opacity: 0, y: 12 }
                }
                transition={{ duration: 0.7, delay: 0.48, ease: EASE }}
                className="mt-8 space-y-3.5 sm:space-y-4"
              >
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-0.5 flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-pimenton-accent text-pimenton-bg"
                    >
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-sm leading-relaxed text-pimenton-text-soft sm:text-base">
                      {b}
                    </span>
                  </li>
                ))}
              </motion.ul>
            </div>

            {/* ── Columna derecha: formulario inline ── */}
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
              animate={
                inView
                  ? { opacity: 1, y: 0 }
                  : reduced
                    ? { opacity: 0 }
                    : { opacity: 0, y: 24 }
              }
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="lg:sticky lg:top-28"
            >
              <ConsultationForm />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
