"use client";

import { motion, useReducedMotion } from "motion/react";
import { splitHighlight } from "@/components/ui-custom/Highlight";
import { TiltImage } from "@/components/ui-custom/TiltImage";
import { useCopy } from "@/components/i18n/LanguageContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Row = ReturnType<typeof useCopy>["equipo"]["valores"]["rows"][number];

function ValorRow({
  row,
  index,
  reduced,
}: {
  row: Row;
  index: number;
  reduced: boolean;
}) {
  // rows 0 y 2: texto a la izquierda; row 1: imagen a la izquierda. En el
  // DOM va imagen → texto (para que en mobile siempre quede imagen-arriba /
  // texto-abajo); en desktop reordenamos con `order`.
  const textLeft = index % 2 === 0;

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16"
    >
      {/* Imagen — 4:3, border-radius 12px, tilt 3D al hover */}
      <TiltImage
        src={row.image}
        alt={row.alt}
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority={index === 0}
        className={`aspect-[4/3] w-full ${textLeft ? "lg:order-2" : "lg:order-1"}`}
      />

      {/* Texto */}
      <div className={textLeft ? "lg:order-1" : "lg:order-2"}>
        <h2 className="text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-4xl lg:text-5xl">
          {splitHighlight(row.heading, row.accent, "coral")}
        </h2>
        <p className="mt-5 max-w-md text-base leading-relaxed text-pimenton-text-muted sm:text-lg">
          {row.paragraph}
        </p>
      </div>
    </motion.div>
  );
}

export function ValoresRows() {
  const reduced = useReducedMotion() ?? false;
  const { rows } = useCopy().equipo.valores;

  return (
    <section className="bg-pimenton-bg px-[5%] py-24 sm:px-16 sm:py-32 lg:px-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-20 sm:gap-28 lg:gap-32">
        {rows.map((row, i) => (
          <ValorRow key={i} row={row} index={i} reduced={reduced} />
        ))}
      </div>
    </section>
  );
}
