"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { copy } from "@/data/copy";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const METRIC_COUNT_DURATION = 1.4;

type TestimonialItem = (typeof copy.testimonials.items)[number];
type Metric = TestimonialItem["metrics"][number];

/**
 * PLACEHOLDER — Retrato ilustrado por persona (DiceBear "notionists"),
 * determinístico vía seed = nombre. Se va a reemplazar por la foto real
 * de cada owner cuando estén disponibles.
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
 * Métrica con count-up de 0 → valor final + un pop sutil al terminar.
 * Locale es-ES para que 3000 se muestre "3.000".
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

function StarRow() {
  return (
    <div aria-label="5 estrellas" className="flex gap-1 text-pimenton-accent">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-4 fill-current" strokeWidth={0} />
      ))}
    </div>
  );
}

function TestimonialCard({
  item,
  index,
  inView,
  reduced,
}: {
  item: TestimonialItem;
  index: number;
  inView: boolean;
  reduced: boolean;
}) {
  return (
    <motion.article
      data-card
      initial={
        reduced ? { opacity: 0 } : { opacity: 0, y: 30 }
      }
      animate={
        inView
          ? { opacity: 1, y: 0 }
          : reduced
            ? { opacity: 0 }
            : { opacity: 0, y: 30 }
      }
      transition={{
        duration: 0.7,
        delay: reduced ? 0 : index * 0.1,
        ease: EASE,
      }}
      className="flex w-[300px] flex-shrink-0 snap-start flex-col rounded-2xl border border-pimenton-border bg-pimenton-surface p-7 shadow-[0_22px_44px_-22px_rgba(15,15,14,0.22)] sm:w-[360px] sm:p-8"
    >
      <StarRow />
      <p className="mt-6 text-base leading-relaxed text-pimenton-text-soft">
        {item.quote}
      </p>

      <div className="mt-auto pt-10">
        <div className="space-y-5">
          {item.metrics.map((m, mi) => {
            const delay = reduced
              ? 0
              : (index + 1) * 0.1 + 0.55 + mi * 0.18;
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
  const { intro, items } = copy.testimonials;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduced = useReducedMotion() ?? false;

  // Padding generoso pedido específicamente para esta sección — pesa
  // visualmente más que el resto del home.
  // Parallax sutil del background: la imagen se traslada un poco más
  // lento que el scroll del usuario. El contenedor del bg es 20% más
  // alto que la sección (10% extra arriba y abajo) para que el
  // translate ±10% nunca revele un borde.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : ["-10%", "10%"],
  );

  // Scroller horizontal — usa native overflow-x-auto con snap. Los
  // botones prev/next disparan scrollBy programático.
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      // 4px de tolerancia para evitar parpadeo del disabled en el
      // extremo (sub-pixel rounding del scroll).
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(
        el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
      );
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    // Tomamos el ancho de la primera card como step. El gap se suma
    // aparte (matchea gap-6 = 24px).
    const firstCard = el.querySelector<HTMLElement>("[data-card]");
    const step = firstCard ? firstCard.offsetWidth + 24 : 360;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      id="testimonios"
      className="relative isolate scroll-mt-24 overflow-hidden bg-pimenton-mint py-24 sm:py-36"
    >
      {/* Background parallax — la imagen ya es mint + ilustraciones
          amarillas. bg-pimenton-mint queda detrás por si la imagen
          tarda en cargar (fallback de color compatible). */}
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

      <div className="mx-auto max-w-7xl px-[5%] sm:px-16 lg:px-24">
        {/* Header: heading + subheading a la izquierda, controles
            prev/next a la derecha. En mobile se apilan. */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
          <div className="max-w-2xl">
            <motion.h2
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={
                inView
                  ? { opacity: 1, y: 0 }
                  : reduced
                    ? { opacity: 0 }
                    : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.8, ease: EASE }}
              className="text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-4xl lg:text-5xl"
            >
              {intro.heading}
            </motion.h2>
            <motion.p
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={
                inView
                  ? { opacity: 1, y: 0 }
                  : reduced
                    ? { opacity: 0 }
                    : { opacity: 0, y: 16 }
              }
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="mt-5 text-base leading-relaxed text-pimenton-text-soft sm:text-lg"
            >
              {intro.subheading}
            </motion.p>
          </div>

          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={
              inView
                ? { opacity: 1, y: 0 }
                : reduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: 10 }
            }
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="flex flex-shrink-0 gap-3"
          >
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={!canScrollLeft}
              aria-label="Reseña anterior"
              className="flex size-12 cursor-pointer items-center justify-center rounded-full border border-pimenton-text/15 bg-pimenton-bg/90 text-pimenton-text outline-none backdrop-blur-sm transition-all hover:bg-pimenton-text hover:text-pimenton-bg focus-visible:ring-2 focus-visible:ring-pimenton-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-pimenton-bg/90 disabled:hover:text-pimenton-text"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={!canScrollRight}
              aria-label="Reseña siguiente"
              className="flex size-12 cursor-pointer items-center justify-center rounded-full border border-pimenton-text/15 bg-pimenton-bg/90 text-pimenton-text outline-none backdrop-blur-sm transition-all hover:bg-pimenton-text hover:text-pimenton-bg focus-visible:ring-2 focus-visible:ring-pimenton-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-pimenton-bg/90 disabled:hover:text-pimenton-text"
            >
              <ChevronRight className="size-5" />
            </button>
          </motion.div>
        </div>

        {/* Scroller — máscara lateral para fade en los bordes, sugiere
            que hay más cards fuera del viewport. Native overflow-x-auto
            + scroll-snap-type da swipe libre en touch y smoothness al
            scrollBy programático. Scrollbar visual oculta. */}
        <div
          className="relative mt-12 sm:mt-16"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 3%, black 97%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 3%, black 97%, transparent)",
          }}
        >
          <div
            ref={scrollerRef}
            className="overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollSnapType: "x mandatory" }}
          >
            <div className="flex gap-6 px-1">
              {items.map((item, i) => (
                <TestimonialCard
                  key={item.name}
                  item={item}
                  index={i}
                  inView={inView}
                  reduced={reduced}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
