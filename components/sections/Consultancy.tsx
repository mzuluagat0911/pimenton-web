"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { ConsultancyForm } from "@/components/forms/ConsultancyForm";
import { clients } from "@/data/clients";
import { copy } from "@/data/copy";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Primeros 5 logos del wall de clientes para la prueba social. Cualquier
// logo sirve (las "pruebas" son el conjunto, no el orden específico) —
// si el orden de data/clients.ts cambia, no impacta el sentido.
const SHOWCASE_LOGOS = clients.slice(0, 5);

/**
 * Sección de cierre del home: bloque editorial a la izquierda
 * (eyebrow / heading / subhead / prueba social / 3 bullets) +
 * formulario inline a la derecha. El ancho de sección replica el de
 * Stats (padding wrapper afuera del max-w-7xl + ClientMarquee bleed
 * fuera del wrapper).
 */
export function Consultancy() {
  const { eyebrow, heading, subheading, socialProof, bullets } =
    copy.consultancy;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      ref={ref}
      id="contacto"
      className="scroll-mt-24 bg-pimenton-bg py-24 sm:py-32"
    >
      <div className="px-[5%] sm:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* ── Columna izquierda: editorial ── */}
            <div className="flex flex-col">
              <motion.p
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={
                  inView
                    ? { opacity: 1, y: 0 }
                    : reduced
                      ? { opacity: 0 }
                      : { opacity: 0, y: 12 }
                }
                transition={{ duration: 0.6, ease: EASE }}
                className="flex items-center text-pimenton-accent text-xs sm:text-sm uppercase tracking-[0.22em] font-medium"
              >
                <span
                  aria-hidden
                  className="mr-3 inline-block h-px w-8 bg-pimenton-accent"
                />
                {eyebrow}
              </motion.p>

              <motion.h2
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={
                  inView
                    ? { opacity: 1, y: 0 }
                    : reduced
                      ? { opacity: 0 }
                      : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
                className="mt-6 text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-4xl lg:text-5xl"
              >
                {heading}
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
                {subheading}
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
                <div className="flex -space-x-2.5">
                  {SHOWCASE_LOGOS.map((c) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={c.logo}
                      src={c.logo}
                      alt=""
                      aria-hidden
                      className="size-10 rounded-full border-2 border-pimenton-bg bg-pimenton-dark object-cover sm:size-11"
                      draggable={false}
                      loading="lazy"
                    />
                  ))}
                </div>
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
              <ConsultancyForm variant="inline" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
