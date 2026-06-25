"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { splitHighlight } from "@/components/ui-custom/Highlight";
import { CtaPill } from "@/components/ui-custom/CtaPill";
import { useCopy } from "@/components/i18n/LanguageContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * CTA de cierre reutilizable (hub /casos + cada caso, /insights, etc.).
 * Fondo coral, texto crema, palabra resaltada en dark (sobre coral el coral
 * no contrastaría) y pill oscuro → /contacto. Una sola fuente de verdad.
 *
 * Por defecto usa el copy de casos.cta; cualquier prop lo sobreescribe para
 * reusar el mismo componente con copy custom (p. ej. /insights).
 */
export function CtaPotenciar(props: {
  heading?: string;
  headingAccent?: string;
  description?: string;
  button?: string;
  href?: string;
} = {}) {
  const reduced = useReducedMotion() ?? false;
  const fallback = useCopy().casos.cta;
  const heading = props.heading ?? fallback.heading;
  const headingAccent = props.headingAccent ?? fallback.headingAccent;
  const description = props.description ?? fallback.description;
  const button = props.button ?? fallback.button;
  const href = props.href ?? fallback.href;

  const reveal = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.7, delay: reduced ? 0 : delay, ease: EASE },
  });

  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-pimenton-accent px-[5%] py-24 sm:px-16 sm:py-32 lg:px-24">
      <div className="mx-auto w-full max-w-3xl text-center">
        <motion.h2
          {...reveal(0)}
          className="text-4xl font-bold leading-[1.05] tracking-tight text-pimenton-bg sm:text-5xl lg:text-6xl"
        >
          {splitHighlight(heading, headingAccent, "dark")}
        </motion.h2>

        <motion.p
          {...reveal(0.12)}
          className="mx-auto mt-6 max-w-xl whitespace-pre-line text-lg leading-relaxed text-pimenton-bg/90 sm:text-xl"
        >
          {description}
        </motion.p>

        <motion.div {...reveal(0.24)} className="mt-10 flex justify-center">
          <CtaPill
            href={href}
            label={button}
            variant="dark"
            iconPosition="right"
            icon={<ArrowRight aria-hidden className="size-5" />}
            className="sm:px-9 sm:py-4"
          />
        </motion.div>
      </div>
    </section>
  );
}
