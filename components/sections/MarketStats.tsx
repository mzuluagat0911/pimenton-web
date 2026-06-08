"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { splitHighlight } from "@/components/ui-custom/Highlight";
import { copy } from "@/data/copy";
import {
  FacturacionIcon,
  ImpresionesIcon,
  PedidoSemanaIcon,
  PersonasIcon,
} from "@/components/icons/MarketIcons";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ICON_MAP = {
  "pedido-semana": PedidoSemanaIcon,
  facturacion: FacturacionIcon,
  personas: PersonasIcon,
  impresiones: ImpresionesIcon,
} as const;

type IconKey = keyof typeof ICON_MAP;
type Item = (typeof copy.marketStats.items)[number];

function MarketCard({
  item,
  index,
  sectionInView,
}: {
  item: Item;
  index: number;
  sectionInView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion() ?? false;
  const Icon = ICON_MAP[item.icon as IconKey];

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={
        sectionInView
          ? { opacity: 1, y: 0 }
          : reduced
            ? { opacity: 0 }
            : { opacity: 0, y: 20 }
      }
      transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
      whileHover={reduced ? undefined : { y: -4 }}
      className="rounded-lg border border-pimenton-border bg-pimenton-surface p-6 transition-shadow duration-300 hover:shadow-[0_8px_24px_-12px_rgba(15,15,14,0.18)] sm:p-8"
    >
      <div className="size-12 text-pimenton-accent sm:size-14">
        {Icon ? <Icon inView={sectionInView} hovered={hovered} /> : null}
      </div>
      <p className="mt-6 font-display text-xl font-semibold tracking-tight text-pimenton-text sm:text-2xl">
        {item.stat}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-pimenton-text-muted sm:text-base">
        {item.label}
      </p>
    </motion.div>
  );
}

export function MarketStats() {
  const { heading, items } = copy.marketStats;
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="bg-pimenton-bg px-[5%] sm:px-16 lg:px-24 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl">
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
          className="max-w-3xl whitespace-pre-line text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-4xl"
        >
          {splitHighlight(heading, "tu delivery?", "mint")}
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <MarketCard
              key={item.icon}
              item={item}
              index={i}
              sectionInView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
