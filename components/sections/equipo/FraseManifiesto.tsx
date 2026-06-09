"use client";

import { Fragment } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Highlight } from "@/components/ui-custom/Highlight";
import { useCopy } from "@/components/i18n/LanguageContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Normaliza una palabra para matchear con el acento (saca puntuación/case).
const norm = (w: string) => w.toLowerCase().replace(/[.,;:!?¿¡—]/g, "");

export function FraseManifiesto() {
  const reduced = useReducedMotion() ?? false;
  const { text, accent } = useCopy().equipo.manifesto;
  const words = text.split(" ");
  const accentNorm = norm(accent);

  // Un único observer en el h2 dispara el reveal y reparte el stagger a las
  // palabras vía variants (no un whileInView por palabra: las spans están
  // translateY(110%) dentro de un mask overflow-hidden y el observer por
  // palabra no llega a intersectar). reduced-motion → fade sin máscara.
  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduced ? 0 : 0.09, delayChildren: 0.05 },
    },
  };
  const wordVariant: Variants = reduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } }
    : { hidden: { y: "110%" }, visible: { y: "0%", transition: { duration: 0.7, ease: EASE } } };

  return (
    <section className="flex min-h-[75vh] items-center justify-center overflow-hidden bg-pimenton-dark px-[5%] py-24 sm:px-16 sm:py-32 lg:px-24">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={container}
        className="mx-auto max-w-5xl text-center text-5xl font-bold leading-[1.1] tracking-tight text-pimenton-text-on-dark sm:text-6xl lg:text-7xl"
      >
        {words.map((w, i) => {
          const node =
            norm(w) === accentNorm ? <Highlight color="coral">{w}</Highlight> : w;
          return (
            <Fragment key={i}>
              <span className="inline-block overflow-hidden align-bottom">
                <motion.span className="inline-block" variants={wordVariant}>
                  {node}
                </motion.span>
              </span>{" "}
            </Fragment>
          );
        })}
      </motion.h2>
    </section>
  );
}
