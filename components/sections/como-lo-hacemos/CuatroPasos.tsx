"use client";

import { motion, useReducedMotion } from "motion/react";
import { splitHighlight } from "@/components/ui-custom/Highlight";
import { EASE } from "@/components/sections/servicios/Eyebrow";
import { CtaPill } from "@/components/ui-custom/CtaPill";
import { useT } from "@/components/i18n/LanguageContext";
import { pasos, type Paso } from "@/data/comoLoHacemos";

// Icono SVG de la iconografía de marca, renderizado como máscara para
// poder tintarlo con un color de paleta (bg-pimenton-text) en vez de
// depender del fill del asset. Conserva la flotación sutil del diseño.
function ProcessIcon({
  icon,
  index,
  reduced,
}: {
  icon: string;
  index: number;
  reduced: boolean;
}) {
  const maskStyle = {
    maskImage: `url("${icon}")`,
    WebkitMaskImage: `url("${icon}")`,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    maskSize: "contain",
    WebkitMaskSize: "contain",
  } as const;

  return (
    <motion.span
      aria-hidden
      className="block size-14 flex-shrink-0 bg-pimenton-text sm:size-16"
      style={maskStyle}
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
    />
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
  const t = useT();
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
        <ProcessIcon icon={paso.icon} index={index} reduced={reduced} />
        <div className="pt-1">
          <h3 className="text-xl font-semibold tracking-tight text-pimenton-text sm:text-2xl">
            {t(paso.title)}
          </h3>
          <p className="mt-3 max-w-prose text-base leading-relaxed text-pimenton-text-muted">
            {t(paso.description)}
          </p>
          <p className="mt-2 max-w-prose text-base font-medium leading-relaxed text-pimenton-accent">
            {t(paso.highlight)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function CuatroPasos() {
  const reduced = useReducedMotion() ?? false;
  const t = useT();
  const ctaLabel = t({
    es: "Quiero analizar mi delivery",
    en: "Analyze my delivery",
  });

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
              {splitHighlight(
                t({ es: "¿Cómo lo hacemos?", en: "How we do it" }),
                t({ es: "hacemos", en: "we do it" }),
                "coral",
              )}
            </motion.h2>
            <motion.p
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="mt-5 text-lg leading-relaxed text-pimenton-text-muted"
            >
              {t({
                es: "Un proceso claro, con foco en rentabilidad.",
                en: "A clear process, focused on profitability.",
              })}
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
            <CtaPill href="/contacto" label={ctaLabel} />
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
            <CtaPill href="/contacto" label={ctaLabel} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
