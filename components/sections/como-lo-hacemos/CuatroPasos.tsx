"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { splitHighlight } from "@/components/ui-custom/Highlight";
import { EASE } from "@/components/sections/servicios/Eyebrow";
import { CtaPill } from "@/components/ui-custom/CtaPill";
import { pasos, type Paso } from "@/data/comoLoHacemos";

const EMOJI_BASE_PATH = "/assets/emoji/3d/";

// Emoji 3D de Microsoft Fluent con flotación sutil + drop-shadow. Mismo
// patrón de carga que el formulario de consultoría: mostramos el emoji
// Unicode de fallback y sólo hacemos "upgrade" al PNG cuando confirmamos
// que carga (precarga con new Image()), así nunca se ve una imagen rota.
function ProcessEmoji({
  name,
  fallback,
  index,
  reduced,
}: {
  name: string;
  fallback: string;
  index: number;
  reduced: boolean;
}) {
  const [pngOk, setPngOk] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const probe = new window.Image();
    probe.onload = () => {
      if (!cancelled && probe.naturalWidth > 0) setPngOk(true);
    };
    probe.src = `${EMOJI_BASE_PATH}${name}`;
    return () => {
      cancelled = true;
    };
  }, [name]);

  const inner = pngOk ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${EMOJI_BASE_PATH}${name}`}
      alt=""
      aria-hidden
      width={64}
      height={64}
      draggable={false}
      className="size-14 sm:size-16"
    />
  ) : (
    <span
      aria-hidden
      role="img"
      className="inline-flex size-14 items-center justify-center text-5xl leading-none sm:size-16 sm:text-6xl"
    >
      {fallback}
    </span>
  );

  return (
    <motion.div
      aria-hidden
      className="flex-shrink-0"
      style={{ filter: "drop-shadow(0 8px 14px rgba(0, 0, 0, 0.18))" }}
      animate={reduced ? undefined : { y: [0, -6, 0] }}
      transition={
        reduced
          ? undefined
          : {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.35,
            }
      }
    >
      {inner}
    </motion.div>
  );
}

function Step({
  paso,
  index,
  reduced,
}: {
  paso: Paso;
  index: number;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: 0.6,
        delay: reduced ? 0 : index * 0.1,
        ease: EASE,
      }}
      className="border-t border-pimenton-border py-8 sm:py-10"
    >
      <div className="flex items-start gap-5 sm:gap-7">
        <ProcessEmoji
          name={paso.emoji}
          fallback={paso.fallback}
          index={index}
          reduced={reduced}
        />
        <div className="pt-1">
          <h3 className="text-2xl font-bold normal-case tracking-tight text-pimenton-text sm:text-3xl">
            {paso.title}
          </h3>
          <p className="mt-3 max-w-prose text-base leading-relaxed text-pimenton-text-muted">
            {paso.description}
          </p>
          <p className="mt-2 max-w-prose text-base font-medium leading-relaxed text-pimenton-accent">
            {paso.highlight}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function CuatroPasos() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="bg-pimenton-bg px-[5%] py-24 sm:px-16 sm:py-32 lg:px-24">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
        {/* Columna izquierda — heading (sticky en desktop, acompaña el scroll
            hasta el final de la sección) */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <motion.h2
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-4xl lg:text-5xl"
          >
            {splitHighlight("¿Cómo lo hacemos?", "hacemos?", "coral")}
          </motion.h2>
          <motion.p
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mt-6 max-w-[400px] text-base leading-relaxed text-pimenton-text-muted sm:text-lg"
          >
            Un proceso claro. Con foco en rentabilidad.
          </motion.p>
        </div>

        {/* Columna derecha — pasos + CTA */}
        <div>
          {pasos.map((paso, i) => (
            <Step key={paso.num} paso={paso} index={i} reduced={reduced} />
          ))}

          {/* CTA — pill coral (mismo estilo que el resto de la web) */}
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.6,
              delay: reduced ? 0 : pasos.length * 0.1,
              ease: EASE,
            }}
            className="border-t border-pimenton-border pt-8 sm:pt-10"
          >
            <CtaPill href="/contacto" label="Quiero analizar mi delivery" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
