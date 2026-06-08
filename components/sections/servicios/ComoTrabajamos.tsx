"use client";

import { motion, useReducedMotion } from "motion/react";
import { Eyebrow, EASE } from "./Eyebrow";

type Step = {
  num: string;
  title: string;
  text: string;
};

const STEPS: Step[] = [
  {
    num: "01",
    title: "Diagnóstico",
    text: "Analizamos tus Foodapps, tu operación actual y tus números reales. Sin compromiso, sin venta.",
  },
  {
    num: "02",
    title: "Propuesta",
    text: "Te mandamos un plan concreto: qué vamos a hacer, en qué orden, qué métricas vamos a mover y qué esperar mes a mes.",
  },
  {
    num: "03",
    title: "Setup",
    text: "Conectamos tu operación a nuestro Control Room. Migramos configuraciones, optimizamos menús y dejamos todo listo para correr.",
  },
  {
    num: "04",
    title: "Operación",
    text: "Tu especialista regional ejecuta el plan. Vos seguís enfocado en cocinar y operar tu local.",
  },
  {
    num: "05",
    title: "Optimización continua",
    text: "Cada mes revisamos, ajustamos y subimos la vara. Lo que funciona se escala, lo que no, se cambia.",
  },
];

function StepNumber({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-display text-4xl font-bold leading-none tracking-tight text-pimenton-accent sm:text-5xl">
      {children}
    </span>
  );
}

function StepBody({ step }: { step: Step }) {
  return (
    <>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-pimenton-text-on-dark sm:text-xl">
        {step.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-pimenton-text-on-dark-muted sm:text-base">
        {step.text}
      </p>
    </>
  );
}

export function ComoTrabajamos() {
  const reduced = useReducedMotion() ?? false;

  const stepAnim = (i: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: {
      duration: 0.6,
      delay: reduced ? 0 : i * 0.15,
      ease: EASE,
    },
  });

  return (
    // border-t da un seam limpio respecto a la sección de servicios (también
    // oscura) que viene justo arriba, para que lean como dos secciones.
    <section className="border-t border-pimenton-dark-border bg-pimenton-dark px-[5%] py-24 sm:px-16 sm:py-32 lg:px-24">
      <div className="mx-auto w-full max-w-7xl">
        <Eyebrow>Cómo trabajamos</Eyebrow>
        <motion.h2
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mt-6 max-w-3xl text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text-on-dark sm:text-4xl lg:text-5xl"
        >
          De la primera llamada al primer mes en piloto automático.
        </motion.h2>
        <motion.p
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="mt-5 max-w-2xl text-base leading-relaxed text-pimenton-text-on-dark-muted sm:text-lg"
        >
          Un proceso claro, sin sorpresas, con responsables definidos.
        </motion.p>

        {/* ── Desktop: timeline horizontal ── */}
        <ol className="mt-16 hidden grid-cols-5 gap-6 md:grid">
          {STEPS.map((step, i) => (
            <motion.li key={step.num} {...stepAnim(i)}>
              <div className="flex items-center">
                <StepNumber>{step.num}</StepNumber>
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden
                    className="ml-4 h-px flex-1 bg-pimenton-dark-border"
                  />
                )}
              </div>
              <StepBody step={step} />
            </motion.li>
          ))}
        </ol>

        {/* ── Mobile: timeline vertical ── */}
        <ol className="mt-12 md:hidden">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.num}
              {...stepAnim(i)}
              className="relative flex gap-5 pb-10 last:pb-0"
            >
              {/* línea vertical conectora (excepto el último) */}
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute bottom-0 left-[19px] top-12 w-px bg-pimenton-dark-border"
                />
              )}
              <div className="flex w-10 flex-shrink-0 justify-center">
                <StepNumber>{step.num}</StepNumber>
              </div>
              <div className="flex-1 pb-2">
                <StepBody step={step} />
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
