"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";
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

  const renderWord = (w: string, i: number) => {
    const node =
      norm(w) === accentNorm ? <Highlight color="coral">{w}</Highlight> : w;

    if (reduced) return <Fragment key={i}>{node} </Fragment>;

    // Reveal con máscara: cada palabra vive en un contenedor overflow-hidden
    // y entra desde abajo (translateY). El uppercase no tiene descendentes,
    // así que la máscara no recorta. Stagger por palabra.
    return (
      <Fragment key={i}>
        <span className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: i * 0.09, ease: EASE }}
          >
            {node}
          </motion.span>
        </span>{" "}
      </Fragment>
    );
  };

  return (
    <section className="flex min-h-[75vh] items-center justify-center overflow-hidden bg-pimenton-dark px-[5%] py-24 sm:px-16 sm:py-32 lg:px-24">
      <motion.h2
        initial={reduced ? { opacity: 0 } : false}
        whileInView={reduced ? { opacity: 1 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-5xl text-center text-5xl font-bold leading-[1.1] tracking-tight text-pimenton-text-on-dark sm:text-6xl lg:text-7xl"
      >
        {words.map(renderWord)}
      </motion.h2>
    </section>
  );
}
