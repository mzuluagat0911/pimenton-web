"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { Star } from "lucide-react";
import { useCopy } from "@/components/i18n/LanguageContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ENTRY_SPRING = {
  type: "spring" as const,
  stiffness: 80,
  damping: 14,
  mass: 0.7,
};
const TILT_SPRING = { stiffness: 220, damping: 22 };
const TILT_MAX_DEG = 5;

type TestimonialItem = ReturnType<typeof useCopy>["testimonials"]["items"][number];
type Metric = TestimonialItem["metrics"][number];

const METRIC_COUNT_DURATION = 1.4;

/**
 * PLACEHOLDER — Retrato ilustrado por persona (DiceBear "notionists"),
 * determinístico vía seed = nombre. Se va a reemplazar por la foto real
 * de cada owner cuando estén disponibles. Para volver a sacarlo, borrar
 * este componente y su uso en TestimonialCard.
 */
function PortraitPlaceholder({ name }: { name: string }) {
  const seed = encodeURIComponent(name);
  const url = `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=ffe0d7,ffd9cf,ffcec1`;
  return (
    <div className="flex size-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-pimenton-accent/30 bg-pimenton-accent/15">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt=""
        aria-hidden
        className="h-full w-full object-cover"
        draggable={false}
      />
    </div>
  );
}

/**
 * Renderiza una métrica con count-up de 0 al valor final + un pop sutil
 * al terminar. El número se formatea con locale es-ES para que 3000 → "3.000"
 * (separador de miles en español). Prefijo (+) y sufijo (%) en peso fino.
 */
function AnimatedMetric({
  metric,
  delay,
  inView,
  reduced,
}: {
  metric: Metric;
  delay: number;
  inView: boolean;
  reduced: boolean;
}) {
  const count = useMotionValue(reduced ? metric.value : 0);
  const display = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString("es-ES"),
  );

  useEffect(() => {
    if (reduced) {
      count.set(metric.value);
      return;
    }
    if (!inView) return;
    const controls = animate(count, metric.value, {
      duration: METRIC_COUNT_DURATION,
      delay,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [inView, reduced, metric.value, count, delay]);

  return (
    <div>
      <motion.div
        animate={
          inView && !reduced ? { scale: [1, 1.07, 1] } : { scale: 1 }
        }
        transition={{
          duration: 0.5,
          delay: delay + METRIC_COUNT_DURATION,
          ease: "easeOut",
        }}
        className="flex items-baseline font-display text-2xl font-semibold tracking-tight text-pimenton-accent tabular-nums sm:text-3xl"
      >
        {metric.prefix && (
          <span className="text-[0.7em] font-normal">{metric.prefix}</span>
        )}
        <motion.span>{display}</motion.span>
        {metric.suffix && (
          <span className="text-[0.7em] font-normal">{metric.suffix}</span>
        )}
      </motion.div>
      <p className="mt-1 text-xs leading-relaxed text-pimenton-text-muted sm:text-sm">
        {metric.label}
      </p>
    </div>
  );
}

/**
 * Hook: 3D tilt following the cursor position over the card. Returns
 * motion values for rotateX/Y and the handlers to wire into the
 * card. Disabled under reduced motion.
 */
function useCardTilt(disabled: boolean) {
  const ref = useRef<HTMLElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, TILT_SPRING);
  const springY = useSpring(rotateY, TILT_SPRING);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * -TILT_MAX_DEG * 2);
    rotateX.set(py * TILT_MAX_DEG * 2);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return { ref, springX, springY, handleMouseMove, handleMouseLeave };
}

function StarRow() {
  const aria = useCopy().testimonials.starsAria;
  return (
    <div aria-label={aria} className="flex gap-1 text-pimenton-accent">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-4 fill-current" strokeWidth={0} />
      ))}
    </div>
  );
}

function IntroCard({
  brand,
  heading,
  subheading,
  inView,
  reduced,
  rotateZStart,
}: {
  brand: string;
  heading: string;
  subheading: string;
  inView: boolean;
  reduced: boolean;
  rotateZStart: number;
}) {
  const tilt = useCardTilt(reduced);
  return (
    <motion.article
      ref={tilt.ref}
      initial={
        reduced
          ? { opacity: 0 }
          : { opacity: 0, y: 70, rotate: rotateZStart, scale: 0.94 }
      }
      animate={
        inView
          ? { opacity: 1, y: 0, rotate: 0, scale: 1 }
          : reduced
            ? { opacity: 0 }
            : { opacity: 0, y: 70, rotate: rotateZStart, scale: 0.94 }
      }
      transition={reduced ? { duration: 0.4 } : ENTRY_SPRING}
      style={
        reduced
          ? undefined
          : {
              rotateX: tilt.springY,
              rotateY: tilt.springX,
              transformPerspective: 1000,
            }
      }
      onMouseMove={tilt.handleMouseMove}
      onMouseLeave={tilt.handleMouseLeave}
      className="relative flex h-full flex-col justify-between rounded-2xl border border-pimenton-border bg-pimenton-surface p-7 sm:p-8"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute right-7 top-7 block size-3 border-r border-t border-pimenton-accent sm:right-8 sm:top-8"
      />

      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/logos/principal/logo-coral.webp"
          alt={brand}
          className="h-7 w-auto sm:h-8"
          draggable={false}
        />
        <h2 className="mt-10 text-2xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-3xl">
          {heading}
        </h2>
      </div>

      <p className="mt-12 text-sm leading-relaxed text-pimenton-text-muted sm:text-base">
        {subheading}
      </p>
    </motion.article>
  );
}

function TestimonialCard({
  item,
  index,
  inView,
  reduced,
  rotateZStart,
}: {
  item: TestimonialItem;
  index: number;
  inView: boolean;
  reduced: boolean;
  rotateZStart: number;
}) {
  const tilt = useCardTilt(reduced);
  return (
    <motion.article
      ref={tilt.ref}
      initial={
        reduced
          ? { opacity: 0 }
          : { opacity: 0, y: 70, rotate: rotateZStart, scale: 0.94 }
      }
      animate={
        inView
          ? { opacity: 1, y: 0, rotate: 0, scale: 1 }
          : reduced
            ? { opacity: 0 }
            : { opacity: 0, y: 70, rotate: rotateZStart, scale: 0.94 }
      }
      transition={
        reduced
          ? { duration: 0.4 }
          : { ...ENTRY_SPRING, delay: (index + 1) * 0.12 }
      }
      style={
        reduced
          ? undefined
          : {
              rotateX: tilt.springY,
              rotateY: tilt.springX,
              transformPerspective: 1000,
            }
      }
      onMouseMove={tilt.handleMouseMove}
      onMouseLeave={tilt.handleMouseLeave}
      className="relative flex h-full flex-col rounded-2xl border border-pimenton-border bg-pimenton-surface p-7 transition-shadow duration-300 hover:shadow-[0_22px_44px_-22px_rgba(15,15,14,0.22)] sm:p-8"
    >
      <StarRow />

      <p className="mt-6 text-base leading-relaxed text-pimenton-text-soft">
        {item.quote}
      </p>

      <div className="mt-auto pt-10">
        <div className="space-y-5">
          {item.metrics.map((m, mi) => {
            // Delay encadenado: espera a que la card termine su entrada
            // (stagger + entry ~0.6s) y luego escalona métrica a métrica.
            const delay = reduced
              ? 0
              : (index + 1) * 0.12 + 0.55 + mi * 0.18;
            return (
              <AnimatedMetric
                key={m.label}
                metric={m}
                delay={delay}
                inView={inView}
                reduced={reduced}
              />
            );
          })}
        </div>

        <div className="mt-6 flex items-start gap-3 border-t border-pimenton-border pt-5">
          <PortraitPlaceholder name={item.name} />
          <div className="min-w-0 leading-tight">
            <p className="text-sm font-semibold text-pimenton-text">
              {item.name}
            </p>
            <p className="mt-1 text-xs text-pimenton-text-soft sm:text-sm">
              {item.brand}
            </p>
            <p className="mt-0.5 text-xs text-pimenton-text-muted">
              {item.role}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function Testimonials() {
  const { intro, items } = useCopy().testimonials;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduced = useReducedMotion() ?? false;

  // Alternating rotation start angles for the "deck deal" entry — cards
  // arrive from slightly different tilts and settle to 0.
  const rotations = [-2.5, 2, -1.8, 2.2];

  // Parallax sutil sobre el background mint + ilustraciones amarillas.
  // La imagen se traslada ~±10% mientras el usuario scrollea por la
  // sección. El contenedor del bg es 20% más alto que la sección
  // (-inset-y-[10%]) para que el translate nunca revele un borde duro.
  // bg-pimenton-mint debajo como fallback de color mientras la imagen
  // carga (matchea el color dominante del asset).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : ["-10%", "10%"],
  );

  return (
    <section
      ref={ref}
      id="testimonios"
      className="relative isolate scroll-mt-24 overflow-hidden bg-pimenton-mint px-[5%] sm:px-16 lg:px-24 py-14 sm:py-20 lg:py-36"
    >
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="absolute -inset-y-[10%] inset-x-0 -z-10"
      >
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/reseñas/background-resenas.webp')",
          }}
        />
      </motion.div>

      <div className="mx-auto w-full max-w-7xl">
        {/*
          Grid responsive con dos modos:
          - mobile (< md): grid-flow-col + auto-cols-[80%] convierte el
            grid en una fila horizontal scrolleable. Cada card ocupa el
            80% del viewport, snap-x mandatory + snap-start en cada
            child = swipe natural. Scrollbar oculta. Esto evita que la
            sección se haga eterna en vertical en mobile.
          - md+: grid clásico 2 cols, lg+ 4 cols — el layout original
            (IntroCard + 3 testimonios) sin tocar.
          [&>*]:snap-start aplica scroll-snap-align: start a cada hijo
          directo sin tener que tocar IntroCard/TestimonialCard.
        */}
        <div
          className="grid grid-flow-col auto-cols-[80%] gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [&>*]:snap-start md:grid-flow-row md:auto-cols-auto md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 md:snap-none lg:grid-cols-4"
          style={{ perspective: 1200 }}
        >
          <IntroCard
            brand={intro.brand}
            heading={intro.heading}
            subheading={intro.subheading}
            inView={inView}
            reduced={reduced}
            rotateZStart={rotations[0]}
          />
          {items.map((item, i) => (
            <TestimonialCard
              key={item.name}
              item={item}
              index={i}
              inView={inView}
              reduced={reduced}
              rotateZStart={rotations[i + 1] ?? 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
