"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { ClientMarquee } from "@/components/ui-custom/ClientMarquee";
import { copy } from "@/data/copy";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const COUNT_DURATION = 1.4;
const STAGGER = 0.12;

type StatItem = (typeof copy.stats.items)[number];
type BgKey = StatItem["bg"];

/**
 * Mapping bg key → clase Tailwind. La data de copy.ts queda agnóstica de
 * tokens (usa ids semánticos: "coral", "mint", "soft", "yellow"), y el
 * componente traduce. Si se renombra un token de paleta, sólo se toca acá.
 */
const BG_BY_KEY: Record<BgKey, string> = {
  coral: "bg-pimenton-accent",
  mint: "bg-pimenton-mint",
  soft: "bg-pimenton-bg-soft",
  yellow: "bg-pimenton-yellow",
};

/**
 * Color del texto por fondo. Coral lleva texto crema; el resto
 * (mint / soft / yellow) lleva texto oscuro. Caption con opacidad
 * reducida para jerarquía sobre label + valor.
 */
const TEXT_BY_KEY: Record<
  BgKey,
  { primary: string; caption: string }
> = {
  coral: {
    primary: "text-pimenton-bg",
    caption: "text-pimenton-bg/80",
  },
  mint: {
    primary: "text-pimenton-text",
    caption: "text-pimenton-text/70",
  },
  soft: {
    primary: "text-pimenton-text",
    caption: "text-pimenton-text/70",
  },
  yellow: {
    primary: "text-pimenton-text",
    caption: "text-pimenton-text/70",
  },
};

/**
 * Placement de cada card en el grid bento de desktop (lg+). En mobile
 * y tablet estas clases no aplican (el grid es 1 col / 2 cols simple).
 *
 * Composición desktop:
 *   col1 row1-2 → coral large
 *   col1 row3   → mint small
 *   col2 row1   → soft small
 *   col2 row2-3 → yellow large
 *
 * Las dos cards grandes quedan en diagonal (coral arriba-izq /
 * amarillo abajo-der). Las dos chicas en la otra diagonal.
 */
const PLACEMENT_BY_INDEX: Record<number, string> = {
  0: "lg:col-start-1 lg:row-start-1 lg:row-span-2",
  1: "lg:col-start-1 lg:row-start-3 lg:row-span-1",
  2: "lg:col-start-2 lg:row-start-1 lg:row-span-1",
  3: "lg:col-start-2 lg:row-start-2 lg:row-span-2",
};

function StatCard({
  item,
  index,
  inView,
  reduced,
}: {
  item: StatItem;
  index: number;
  inView: boolean;
  reduced: boolean;
}) {
  const stagger = reduced ? 0 : index * STAGGER;
  const count = useMotionValue(reduced ? item.value : 0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const text = TEXT_BY_KEY[item.bg];
  const isLarge = item.size === "large";

  // Count-up al entrar en viewport. Una sola vez (porque inView es
  // once: true). Prefix/suffix permanecen estáticos.
  useEffect(() => {
    if (reduced) {
      count.set(item.value);
      return;
    }
    if (!inView) return;
    const controls = animate(count, item.value, {
      duration: COUNT_DURATION,
      delay: stagger,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [inView, reduced, item.value, count, stagger]);

  return (
    <motion.article
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={
        inView
          ? { opacity: 1, y: 0 }
          : reduced
            ? { opacity: 0 }
            : { opacity: 0, y: 20 }
      }
      transition={{ duration: 0.7, delay: stagger, ease: EASE }}
      whileHover={
        reduced
          ? undefined
          : {
              scale: 1.02,
              transition: { duration: 0.3, ease: EASE },
            }
      }
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-8 sm:p-10 lg:rounded-[28px] ${
        isLarge
          ? "min-h-[280px] lg:min-h-[480px] lg:p-12"
          : "min-h-[220px] lg:min-h-[230px] lg:p-10"
      } ${BG_BY_KEY[item.bg]} ${PLACEMENT_BY_INDEX[index] ?? ""}`}
    >
      {/* Bloque arriba-izquierda: label (h3 → font-display + uppercase
          por @layer base) + caption editorial debajo. */}
      <div>
        <h3
          className={`text-2xl font-bold leading-[1.05] tracking-tight sm:text-3xl ${
            isLarge ? "lg:text-4xl" : "lg:text-2xl"
          } ${text.primary}`}
        >
          {item.label}
        </h3>
        <p
          className={`mt-2.5 max-w-[28ch] text-sm leading-relaxed sm:text-base ${text.caption}`}
        >
          {item.caption}
        </p>
      </div>

      {/* Valor — abajo derecha. self-end alinea al borde derecho del
          flex-col (cross axis = horizontal). justify-between del padre
          lo empuja al piso. */}
      <div
        className={`mt-8 self-end font-display font-bold leading-none tracking-tight tabular-nums ${
          isLarge
            ? "text-7xl sm:text-8xl lg:text-9xl"
            : "text-6xl sm:text-7xl lg:text-7xl"
        } ${text.primary}`}
      >
        <span className="text-[0.45em] font-normal align-baseline">
          {item.prefix}
        </span>
        <motion.span>{rounded}</motion.span>
        {item.suffix && (
          <span className="text-[0.45em] font-normal align-baseline">
            {item.suffix}
          </span>
        )}
      </div>
    </motion.article>
  );
}

export function Stats() {
  const { items } = copy.stats;
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="bg-pimenton-bg py-14 sm:py-20 overflow-hidden"
    >
      {/* Padding wrapper afuera del max-w-7xl (mismo patrón que
          MarketStats/Consultancy), para que el ClientMarquee de abajo
          pueda bleedear edge-to-edge sin heredar el px-24. */}
      <div className="px-[5%] sm:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">
          {/*
            Grid bento:
              - mobile: 1 col, cards stacked en orden de la data
                (coral → mint → soft → yellow).
              - md (768-1023): 2x2 simple. DOM flow: [coral, mint] /
                [soft, yellow]. Sin asimetría porque a este ancho no aporta.
              - lg (≥1024): bento asimétrico vía row-span. Coral large
                arriba-izq, amarillo large abajo-der; mint y soft en la
                otra diagonal. Ver PLACEMENT_BY_INDEX.
          */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-rows-3 lg:gap-6">
            {items.map((item, i) => (
              <StatCard
                key={item.label}
                item={item}
                index={i}
                inView={inView}
                reduced={reduced}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Wall de clientes — bleed full-width. Se preserva porque la
          sección Stats sigue funcionando como bloque editorial completo:
          dashboard bento arriba + marquee abajo. */}
      <div className="mt-12 sm:mt-16">
        <ClientMarquee />
      </div>
    </section>
  );
}
