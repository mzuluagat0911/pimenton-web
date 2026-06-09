// Versión previa del componente Stats — dashboard estilo dark con
// indicador "Live" pulsante y valores fluctuantes tipo dashboard en
// tiempo real. Reemplazado por Stats.tsx (bento color-block editorial)
// en diciembre 2026. Mantener por referencia: si se quiere volver a
// este lenguaje visual, basta con cambiar el import en app/page.tsx.
//
// La data legacy queda embebida acá (LEGACY_ITEMS) para que el archivo
// siga compilando sin depender del shape de copy.stats actual.

"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { ClientMarquee } from "@/components/ui-custom/ClientMarquee";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const COUNT_DURATION = 1.7;
const STAGGER = 0.1;

// Noise SVG inline — tile 240×240 con turbulencia fractal. Se aplica con
// mix-blend-overlay a opacidad muy baja para texturizar el fondo dark
// sin gritar "soy un overlay".
const NOISE_DATA_URI =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E";

// Snapshot de la data que consumía esta versión previa. Coexiste con
// la nueva shape de copy.stats (que tiene bg/size). Si se restaura este
// componente y querés volver a la fuente compartida, mové este array a
// data/copy.ts bajo otra key (p.ej. statsLegacy).
type LegacyStatItem = {
  value: number;
  prefix: string;
  suffix: string;
  label: string;
  caption: string;
  fluctuationRange: number;
};

const LEGACY_ITEMS: ReadonlyArray<LegacyStatItem> = [
  {
    value: 30,
    prefix: "+",
    suffix: "%",
    label: "Ventas",
    caption: "en los primeros 3 meses",
    fluctuationRange: 1,
  },
  {
    value: 500,
    prefix: "+",
    suffix: "",
    label: "Restaurantes",
    caption: "confían en nosotros",
    fluctuationRange: 3,
  },
  {
    value: 20,
    prefix: "+",
    suffix: "",
    label: "Países",
    caption: "en USA, LatAm y Europa",
    fluctuationRange: 0,
  },
  {
    value: 18,
    prefix: "+",
    suffix: "%",
    label: "Rentabilidad",
    caption: "aumento promedio trimestral",
    fluctuationRange: 1,
  },
];

type StatItem = LegacyStatItem;

/**
 * Indicador "Live" — punto coral con halo pulsante tipo radar.
 * - Reduced motion: punto estático sin halo.
 * - Hover (intense=true): el pulso acelera (~1s en vez de 1.6s) y el
 *   halo expande un poco más, reaccionando al cursor.
 */
function LiveIndicator({
  reduced,
  intense,
}: {
  reduced: boolean;
  intense: boolean;
}) {
  const duration = intense ? 1.0 : 1.6;
  const maxScale = intense ? 2.8 : 2.4;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-5 top-5 flex size-2.5 items-center justify-center sm:right-6 sm:top-6"
    >
      {!reduced && (
        <motion.span
          className="absolute inset-0 rounded-full bg-pimenton-accent"
          animate={{
            scale: [1, maxScale, maxScale],
            opacity: [0.75, 0, 0],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}
      <motion.span
        className="relative size-2.5 rounded-full bg-pimenton-accent"
        style={{
          boxShadow: reduced
            ? undefined
            : "0 0 8px 0 rgba(232, 75, 60, 0.6)",
        }}
        animate={reduced ? undefined : { opacity: [1, 0.78, 1] }}
        transition={
          reduced
            ? undefined
            : { duration, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </div>
  );
}

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
  const [hovered, setHovered] = useState(false);
  const [countDone, setCountDone] = useState(reduced);
  const [bouncing, setBouncing] = useState(false);
  const bounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Valor de display animado (count-up + fluctuación).
  const count = useMotionValue(reduced ? item.value : 0);
  const rounded = useTransform(count, (v) => Math.round(v));

  // Count-up de entrada — al entrar en viewport, contar de 0 al value.
  // Al terminar: trigger bounce + habilitar fluctuación.
  useEffect(() => {
    if (reduced) {
      count.set(item.value);
      setCountDone(true);
      return;
    }
    if (!inView) return;
    const controls = animate(count, item.value, {
      duration: COUNT_DURATION,
      delay: stagger,
      ease: "easeOut",
      onComplete: () => {
        setCountDone(true);
        setBouncing(true);
        // Bounce timer rastreado en ref para que el cleanup del effect
        // lo pueda cancelar si la card desmonta durante esos 380ms.
        bounceTimerRef.current = setTimeout(() => setBouncing(false), 380);
      },
    });
    return () => {
      controls.stop();
      if (bounceTimerRef.current) {
        clearTimeout(bounceTimerRef.current);
        bounceTimerRef.current = null;
      }
    };
  }, [inView, reduced, item.value, count, stagger]);

  // Micro-fluctuación post count-up — cada 4-8s, target dentro de
  // ±fluctuationRange del valor base. Cada card es independiente: el
  // primer tick se escalona por index, y los waits son random.
  // Países (fluctuationRange = 0) NO entra acá: las naciones no
  // aparecen y desaparecen cada 6 segundos.
  useEffect(() => {
    if (reduced || !countDone || item.fluctuationRange === 0) return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let controls: { stop: () => void } | null = null;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      // Delta uniforme en [-range, +range], redondeado.
      const delta = (Math.random() * 2 - 1) * item.fluctuationRange;
      const target = Math.round(item.value + delta);
      controls = animate(count, target, {
        duration: 0.45,
        ease: "easeOut",
      });
      const wait = 4000 + Math.random() * 4000; // 4-8s
      timeoutId = setTimeout(tick, wait);
    };

    // Primer tick: 800ms base + 600ms por index para desincronizar las
    // 4 cards en el arranque.
    timeoutId = setTimeout(tick, 800 + index * 600);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      controls?.stop();
    };
  }, [countDone, reduced, item.fluctuationRange, item.value, count, index]);

  return (
    <motion.article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 22 }}
      animate={
        inView
          ? { opacity: 1, y: 0 }
          : reduced
            ? { opacity: 0 }
            : { opacity: 0, y: 22 }
      }
      transition={{ duration: 0.65, delay: stagger, ease: EASE }}
      whileHover={
        reduced ? undefined : { y: -5, transition: { duration: 0.3, ease: EASE } }
      }
      style={{
        boxShadow:
          hovered && !reduced
            ? "0 14px 38px -12px rgba(232, 75, 60, 0.32), 0 4px 12px -6px rgba(0,0,0,0.25)"
            : "0 4px 14px -8px rgba(0,0,0,0.22)",
      }}
      className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-pimenton-dark p-8 transition-shadow duration-300 sm:rounded-[20px] sm:p-10 lg:p-12"
    >
      {/* Grano — overlay SVG con turbulencia fractal. Muy bajo opacity
          + mix-blend-overlay = textura premium sin competir con el
          contenido. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage: `url("${NOISE_DATA_URI}")`,
          backgroundSize: "240px 240px",
        }}
      />

      {/* Live indicator — esquina superior derecha */}
      <LiveIndicator reduced={reduced} intense={hovered} />

      {/* Valor — arriba izquierda, coral, héroe. El motion wrapper hace
          el micro-bounce (scale 1 → 1.05 → 1) al terminar el count-up. */}
      <motion.div
        animate={bouncing && !reduced ? { scale: [1, 1.025, 1] } : { scale: 1 }}
        transition={{ duration: 0.48, ease: EASE }}
        style={{ transformOrigin: "left center" }}
        className="relative z-10 flex items-baseline font-display text-6xl font-semibold leading-none tracking-tight text-pimenton-accent tabular-nums sm:text-7xl lg:text-8xl"
      >
        {item.prefix && (
          <span className="text-[0.55em] font-normal">{item.prefix}</span>
        )}
        <motion.span>{rounded}</motion.span>
        {item.suffix && (
          <span className="text-[0.55em] font-normal">{item.suffix}</span>
        )}
      </motion.div>

      {/* Label + caption — abajo izquierda. justify-between en el wrapper
          empuja este bloque al piso, dejando las cards de altura pareja
          aunque los captions varíen en largo. */}
      <div className="relative z-10 mt-14 sm:mt-20 lg:mt-24">
        <h3 className="text-lg font-semibold tracking-wide text-pimenton-text-on-dark sm:text-xl lg:text-2xl">
          {item.label}
        </h3>
        <p className="mt-2 text-base leading-relaxed text-pimenton-text-on-dark-muted sm:text-lg">
          {item.caption}
        </p>
      </div>
    </motion.article>
  );
}

export function StatsDashboard() {
  const items = LEGACY_ITEMS;
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="bg-pimenton-bg py-24 sm:py-32 overflow-hidden"
    >
      {/* Cards: padding wrapper AFUERA del max-w-7xl (= mismo patrón que
          MarketStats). Las cards llenan el ancho del contenido sin que
          el px-24 las achique adentro del cap. */}
      <div className="px-[5%] sm:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Wall de clientes — bleed full-width, prueba visual de los +500.
          Vive AFUERA del wrapper de padding para que pueda extenderse
          edge-to-edge sin heredar el px-24 de las cards. */}
      <div className="mt-20 sm:mt-28">
        <ClientMarquee />
      </div>
    </section>
  );
}
