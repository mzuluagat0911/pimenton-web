"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { splitHighlight } from "@/components/ui-custom/Highlight";
import { CtaPill } from "@/components/ui-custom/CtaPill";
import { TiltImage } from "@/components/ui-custom/TiltImage";
import { useCopy } from "@/components/i18n/LanguageContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function CtaSumarte() {
  const reduced = useReducedMotion() ?? false;
  const { heading, headingAccent, description, button, href, image, imageAlt } =
    useCopy().equipo.cta;

  const reveal = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.7, delay: reduced ? 0 : delay, ease: EASE },
  });

  return (
    <section className="bg-pimenton-accent px-[5%] py-24 sm:px-16 sm:py-32 lg:px-24">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Texto — alineado a izquierda */}
        <div className="text-left">
          {/* "SUMARTE" resaltado en dark (coral sobre coral no contrastaría)
              sobre el heading crema. */}
          <motion.h2
            {...reveal(0)}
            className="text-4xl font-bold leading-[1.05] tracking-tight text-pimenton-bg sm:text-5xl lg:text-6xl"
          >
            {splitHighlight(heading, headingAccent, "dark")}
          </motion.h2>

          <motion.p
            {...reveal(0.1)}
            className="mt-6 max-w-xl text-lg leading-relaxed text-pimenton-bg/90 sm:text-xl"
          >
            {description}
          </motion.p>

          <motion.div {...reveal(0.2)} className="mt-9">
            <CtaPill
              href={href}
              label={button}
              external
              variant="dark"
              iconPosition="right"
              icon={<ArrowRight aria-hidden className="size-5" />}
              className="sm:px-9 sm:py-4"
            />
          </motion.div>
        </div>

        {/* Foto del equipo completo — tilt 3D al hover */}
        <motion.div {...reveal(0.15)}>
          <TiltImage
            src={image}
            alt={imageAlt}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-[4/3] w-full shadow-2xl shadow-pimenton-dark/25"
          />
        </motion.div>
      </div>
    </section>
  );
}
