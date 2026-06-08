"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { Plus } from "lucide-react";
import { Eyebrow, EASE } from "./Eyebrow";

type Qa = { q: string; a: string };

const FAQS: Qa[] = [
  {
    q: "¿Cuánto cuesta trabajar con Pimentón?",
    a: "Depende de tu operación. Cobramos una fee mensual que ajustamos según el tamaño, la cantidad de sucursales y los servicios activos. La consultoría inicial es gratis y te pasamos un presupuesto claro ahí mismo.",
  },
  {
    q: "¿Tienen contrato de permanencia?",
    a: "No. Operamos con contrato mes a mes. Si en cualquier momento sentís que no estás recibiendo valor, cortás. Sin penalidades.",
  },
  {
    q: "¿Cuánto tarda en verse resultados?",
    a: "Los primeros impactos en posicionamiento y orders suelen aparecer en 30 a 60 días. Los resultados sostenidos en ventas y rentabilidad, en 90 días. No prometemos magia: prometemos método.",
  },
  {
    q: "¿En qué países operan?",
    a: "Argentina, Chile, Colombia, México, Perú, Uruguay, España y Estados Unidos como mercados principales. Trabajamos también con clientes en otros países de LatAm y Europa caso por caso.",
  },
  {
    q: "¿Trabajan con restaurantes chicos?",
    a: "Sí. Tenemos clientes desde 1 sucursal hasta cadenas de +20. La metodología se adapta al tamaño, no al revés.",
  },
  {
    q: "¿Y si ya tengo a alguien manejando mis Foodapps?",
    a: "No es excluyente. Muchos clientes nos contratan para auditar y optimizar lo que su equipo interno ya hace. Coordinamos sin problema.",
  },
  {
    q: "¿Qué incluye la consultoría gratuita?",
    a: "Una llamada o intercambio por WhatsApp con un especialista de tu región. Revisamos tu operación actual, identificamos las fugas más evidentes y te decimos en concreto qué se puede mejorar. Sin compromiso.",
  },
  {
    q: "¿Cómo me contacto?",
    a: "Tenés dos opciones: ir a la página de contacto y dejar tus datos para que un especialista te escriba, o escribir directo al WhatsApp del FAB coral abajo a la derecha. Te responde una persona, no un bot.",
  },
];

function FaqItem({
  item,
  isOpen,
  onToggle,
  reduced,
}: {
  item: Qa;
  isOpen: boolean;
  onToggle: () => void;
  reduced: boolean;
}) {
  return (
    <div className="border-b border-pimenton-dark-border">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left outline-none"
      >
        <h3
          className={`text-lg font-semibold tracking-tight transition-colors duration-300 sm:text-xl ${
            isOpen
              ? "text-pimenton-accent"
              : "text-pimenton-text-on-dark group-hover:text-pimenton-accent"
          }`}
        >
          {item.q}
        </h3>
        <motion.span
          aria-hidden
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: reduced ? 0.15 : 0.3, ease: EASE }}
          className={`flex size-9 flex-shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
            isOpen
              ? "border-pimenton-accent text-pimenton-accent"
              : "border-pimenton-dark-border text-pimenton-text-on-dark-muted group-hover:border-pimenton-accent group-hover:text-pimenton-accent"
          }`}
        >
          <Plus className="size-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={
              reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }
            }
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.2 : 0.35, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <p className="max-w-3xl pb-6 pr-12 text-base leading-relaxed text-pimenton-text-on-dark-muted">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqServicios() {
  const reduced = useReducedMotion() ?? false;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-pimenton-dark px-[5%] py-24 sm:px-16 sm:py-32 lg:px-24">
      <div className="mx-auto w-full max-w-4xl">
        <Eyebrow>Preguntas frecuentes</Eyebrow>
        <motion.h2
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mt-6 text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text-on-dark sm:text-4xl lg:text-5xl"
        >
          Las dudas que llegan por WhatsApp.
        </motion.h2>

        <div className="mt-12 border-t border-pimenton-dark-border">
          {FAQS.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
