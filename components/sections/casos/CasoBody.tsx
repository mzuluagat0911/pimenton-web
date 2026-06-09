"use client";

import { motion, useReducedMotion } from "motion/react";
import { splitHighlight } from "@/components/ui-custom/Highlight";
import { useCopy } from "@/components/i18n/LanguageContext";
import type { Estrategia } from "@/data/casos";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function useReveal() {
  const reduced = useReducedMotion() ?? false;
  return (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.7, delay: reduced ? 0 : delay, ease: EASE },
  });
}

/** 3. El Desafío (contexto) — fondo oscuro. */
export function CasoDesafio({ contexto }: { contexto: string }) {
  const reveal = useReveal();
  const { desafioHeading, desafioAccent } = useCopy().casos.caso;
  return (
    <section className="bg-pimenton-dark px-[5%] py-20 sm:px-16 sm:py-28 lg:px-24">
      <div className="mx-auto w-full max-w-3xl">
        <motion.h2
          {...reveal(0)}
          className="text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text-on-dark sm:text-4xl lg:text-5xl"
        >
          {splitHighlight(desafioHeading, desafioAccent, "coral")}
        </motion.h2>
        <motion.p
          {...reveal(0.1)}
          className="mt-6 text-lg leading-relaxed text-pimenton-text-on-dark-muted sm:text-xl"
        >
          {contexto}
        </motion.p>
      </div>
    </section>
  );
}

/** 4. Qué hicimos (approach) — fondo crema, lista numerada con stagger. */
export function CasoApproach({ approach }: { approach: Estrategia[] }) {
  const reduced = useReducedMotion() ?? false;
  const reveal = useReveal();
  const { approachHeading, approachAccent } = useCopy().casos.caso;
  return (
    <section className="bg-pimenton-bg px-[5%] py-20 sm:px-16 sm:py-28 lg:px-24">
      <div className="mx-auto w-full max-w-3xl">
        <motion.h2
          {...reveal(0)}
          className="text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-4xl lg:text-5xl"
        >
          {splitHighlight(approachHeading, approachAccent, "coral")}
        </motion.h2>

        <ul className="mt-10 flex flex-col">
          {approach.map((step, i) => (
            <motion.li
              key={i}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.55,
                delay: reduced ? 0 : i * 0.08,
                ease: EASE,
              }}
              className="flex gap-5 border-t border-pimenton-border py-6 sm:gap-6"
            >
              <span className="font-display text-xl font-bold leading-none text-pimenton-accent sm:text-2xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                {step.titulo && (
                  <h3 className="text-lg font-bold tracking-tight text-pimenton-text sm:text-xl">
                    {step.titulo}
                  </h3>
                )}
                <p
                  className={`text-base leading-relaxed text-pimenton-text-soft sm:text-lg ${
                    step.titulo ? "mt-2" : ""
                  }`}
                >
                  {step.descripcion}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** 5. Resultados en detalle — sólo casos multi-sucursal/multimarca. Oscuro. */
export function CasoResultados({ items }: { items: string[] }) {
  const reduced = useReducedMotion() ?? false;
  const reveal = useReveal();
  const { resultadosHeading, resultadosAccent } = useCopy().casos.caso;
  return (
    <section className="bg-pimenton-dark px-[5%] py-20 sm:px-16 sm:py-28 lg:px-24">
      <div className="mx-auto w-full max-w-3xl">
        <motion.h2
          {...reveal(0)}
          className="text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text-on-dark sm:text-4xl lg:text-5xl"
        >
          {splitHighlight(resultadosHeading, resultadosAccent, "coral")}
        </motion.h2>

        <ul className="mt-10 border-t border-pimenton-dark-border">
          {items.map((item, i) => {
            const idx = item.indexOf(":");
            const label = idx > -1 ? item.slice(0, idx) : null;
            const detail = idx > -1 ? item.slice(idx + 1).trim() : item;
            return (
              <motion.li
                key={i}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.5,
                  delay: reduced ? 0 : i * 0.08,
                  ease: EASE,
                }}
                className="flex items-start gap-4 border-b border-pimenton-dark-border py-5"
              >
                <span
                  aria-hidden
                  className="mt-2.5 size-1.5 shrink-0 rounded-full bg-pimenton-accent"
                />
                <span className="text-base leading-relaxed text-pimenton-text-on-dark-muted sm:text-lg">
                  {label && (
                    <span className="font-semibold text-pimenton-text-on-dark">
                      {label}:{" "}
                    </span>
                  )}
                  {detail}
                </span>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** 6. Conclusión estratégica — el remate, bloque editorial con barra coral. */
export function CasoConclusion({ text }: { text: string }) {
  const reveal = useReveal();
  const { conclusionHeading, conclusionAccent } = useCopy().casos.caso;
  return (
    <section className="bg-pimenton-bg px-[5%] py-24 sm:px-16 sm:py-32 lg:px-24">
      <div className="mx-auto w-full max-w-3xl">
        <motion.h2
          {...reveal(0)}
          className="text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-4xl lg:text-5xl"
        >
          {splitHighlight(conclusionHeading, conclusionAccent, "coral")}
        </motion.h2>
        <motion.div
          {...reveal(0.1)}
          className="mt-8 border-l-4 border-pimenton-accent pl-6 sm:pl-8"
        >
          <p className="font-display text-2xl font-medium leading-snug tracking-tight text-pimenton-text sm:text-3xl">
            {text}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
