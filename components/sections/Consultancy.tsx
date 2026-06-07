"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ConsultancyForm } from "@/components/forms/ConsultancyForm";
import { copy } from "@/data/copy";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Sección de cierre del home: bloque editorial + formulario inline.
 * El mismo <ConsultancyForm /> se va a reutilizar en /contacto y como
 * modal disparado desde otros puntos del sitio.
 */
export function Consultancy() {
  const { eyebrow, heading, subheading } = copy.consultancy;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      ref={ref}
      id="contacto"
      className="scroll-mt-24 bg-pimenton-bg px-[5%] sm:px-16 lg:px-24 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-3xl">
        <div className="text-left">
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
            className="mt-5 max-w-2xl text-base leading-relaxed text-pimenton-text-soft sm:text-lg"
          >
            {subheading}
          </motion.p>
        </div>

        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={
            inView
              ? { opacity: 1, y: 0 }
              : reduced
                ? { opacity: 0 }
                : { opacity: 0, y: 24 }
          }
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="mt-10 sm:mt-14"
        >
          <ConsultancyForm variant="inline" />
        </motion.div>
      </div>
    </section>
  );
}
