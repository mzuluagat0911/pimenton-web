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
          <h3 className="text-xl font-semibold tracking-tight text-pimenton-text sm:text-2xl">
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
        {/* Columna izquierda — heading + subtítulo arriba (fijos, sin sticky)
            y el CTA abajo en desktop, alineado con el final de los pasos. */}
        <div className="flex flex-col">
          <div>
            <motion.h2
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-4xl"
            >
              {splitHighlight("¿Cómo lo hacemos?", "hacemos", "coral")}
            </motion.h2>
            <motion.p
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="mt-5 text-lg leading-relaxed text-pimenton-text-muted"
            >
              Un proceso claro, con foco en rentabilidad.
            </motion.p>
          </div>

          {/* CTA — desktop: justo debajo del subtítulo, arriba a la izquierda */}
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="mt-8 hidden lg:block"
          >
            <CtaPill href="/contacto" label="Quiero analizar mi delivery" />
          </motion.div>
        </div>

        {/* Columna derecha — los pasos */}
        <div>
          {pasos.map((paso, i) => (
            <Step key={paso.num} paso={paso} index={i} reduced={reduced} />
          ))}

          {/* CTA — mobile/tablet: al final, después de los pasos */}
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.6,
              delay: reduced ? 0 : pasos.length * 0.1,
              ease: EASE,
            }}
            className="border-t border-pimenton-border pt-8 sm:pt-10 lg:hidden"
          >
            <CtaPill href="/contacto" label="Quiero analizar mi delivery" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
