"use client";

import { motion, useReducedMotion } from "motion/react";
import { Eyebrow, EASE } from "./Eyebrow";

type Card = {
  emoji: string;
  title: string;
  text: string;
};

const CARDS: Card[] = [
  {
    emoji: "🎯",
    title: "Especialistas por región",
    text: "Cada cliente tiene un especialista de su país que entiende el mercado local, los hábitos del consumidor y las particularidades de cada Foodapp en su geografía.",
  },
  {
    emoji: "⚡",
    title: "Tecnología propia",
    text: "Operamos con Control Room ®, nuestra plataforma que centraliza Rappi, PedidosYa, Uber Eats, Glovo, Deliveroo y más en un solo lugar. Lo que en otras agencias son 8 paneles distintos, en Pimentón es uno.",
  },
  {
    emoji: "📈",
    title: "+500 restaurantes en +20 países",
    text: "De cafeterías independientes en Buenos Aires a cadenas de 20 sucursales en Madrid. Aprendimos qué funciona — y qué no — en cada vertical y cada mercado.",
  },
];

export function PorQuePimenton() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="bg-pimenton-bg px-[5%] py-24 sm:px-16 sm:py-32 lg:px-24">
      <div className="mx-auto w-full max-w-7xl">
        <Eyebrow>Por qué Pimentón</Eyebrow>
        <motion.h2
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mt-6 max-w-3xl text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-4xl lg:text-5xl"
        >
          No somos una agencia. Somos un equipo de operación delivery.
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <motion.article
              key={card.title}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: reduced ? 0 : i * 0.12,
                ease: EASE,
              }}
              whileHover={
                reduced
                  ? undefined
                  : { scale: 1.02, transition: { duration: 0.3, ease: EASE } }
              }
              className="flex flex-col rounded-2xl border border-pimenton-border bg-pimenton-surface p-8 shadow-[0_8px_24px_-16px_rgba(15,15,14,0.22)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-18px_rgba(15,15,14,0.28)] sm:p-9"
            >
              <span
                aria-hidden
                className="text-4xl leading-none sm:text-5xl"
                style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.18))" }}
              >
                {card.emoji}
              </span>
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-pimenton-text sm:text-2xl">
                {card.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-pimenton-text-muted">
                {card.text}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
