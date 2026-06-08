"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { EASE } from "./Eyebrow";
import { whatsappRegions, whatsappUrl } from "@/data/whatsapp";

// Mismo número del FAB (región LatAm como primaria) para el deep-link.
const waHref = whatsappUrl(whatsappRegions[0]!);

export function CtaContactoFinal() {
  const reduced = useReducedMotion() ?? false;

  const fadeUp = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <section className="flex min-h-[50vh] items-center bg-pimenton-accent px-[5%] py-24 sm:px-16 sm:py-32 lg:px-24">
      <div className="mx-auto w-full max-w-3xl text-center">
        <motion.p
          {...fadeUp(0)}
          className="text-sm font-semibold uppercase tracking-[0.22em] text-pimenton-bg/85"
        >
          Empezar ahora
        </motion.p>

        <motion.h2
          {...fadeUp(0.1)}
          className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-pimenton-bg sm:text-5xl lg:text-6xl"
        >
          Tu primer paso es una consultoría gratis.
        </motion.h2>

        <motion.p
          {...fadeUp(0.2)}
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pimenton-bg/85 sm:text-xl"
        >
          Sin compromiso, sin venta agresiva. Te escribimos por WhatsApp en
          las próximas horas.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="mt-10">
          <Link
            href="/contacto"
            className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-pimenton-dark px-8 py-4 text-base font-semibold text-pimenton-bg shadow-xl shadow-pimenton-dark/25 transition-transform duration-300 hover:scale-[1.03] sm:text-lg"
          >
            Ir a contacto
            <ArrowRight
              aria-hidden
              className="size-5 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <p className="mt-5 text-sm text-pimenton-bg/75">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline-offset-4 transition-colors hover:text-pimenton-bg hover:underline"
            >
              O escribinos directo por WhatsApp →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
