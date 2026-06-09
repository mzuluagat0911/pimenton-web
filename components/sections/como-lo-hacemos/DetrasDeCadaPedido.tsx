"use client";

import {
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { splitHighlight } from "@/components/ui-custom/Highlight";
import { EASE } from "@/components/sections/servicios/Eyebrow";
import { CtaPill } from "@/components/ui-custom/CtaPill";
import { ControlRoomAutonomous } from "@/components/sections/control-room/Autonomous";
import {
  col3LogoPool,
  dashboardConfig,
  growthManagers,
  partesDiarios,
} from "@/data/comoLoHacemos";

// ════════════════════════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════════════════════════

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Las animaciones internas de cada card arrancan DESPUÉS de su animación
 * de entrada (stagger global). `hasEntered` se enciende a los
 * (index * 120ms + 700ms) de entrar la sección en viewport — coincide
 * con el delay + duración de la entrada de la card.
 */
function useHasEntered(inView: boolean, reduced: boolean, index: number) {
  const [entered, setEntered] = useState(reduced);
  useEffect(() => {
    if (reduced) {
      setEntered(true);
      return;
    }
    if (!inView) return;
    const t = setTimeout(() => setEntered(true), index * 120 + 700);
    return () => clearTimeout(t);
  }, [inView, reduced, index]);
  return entered;
}

// Indicador "En línea" — punto coral con halo radar pulsante. Mismo
// lenguaje visual que el latido del Control Room y el Live de Stats v1.
function LiveDot({ reduced }: { reduced: boolean }) {
  return (
    <span
      aria-hidden
      className="relative flex size-1.5 items-center justify-center"
    >
      {!reduced && (
        <motion.span
          className="absolute inset-0 rounded-full bg-pimenton-accent"
          // Halo "soft": la opacidad entra y sale (0 → pico → 0), así el
          // reinicio del loop ocurre con el anillo invisible → sin pop
          // brusco. Es un pulso continuo, no un ping que reaparece de golpe.
          animate={{ scale: [1, 2.2], opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <span
        className="relative size-1.5 rounded-full bg-pimenton-accent"
        style={{
          boxShadow: reduced ? undefined : "0 0 6px 0 rgba(232, 75, 60, 0.6)",
        }}
      />
    </span>
  );
}

// ════════════════════════════════════════════════════════════════════
// Columna 1 — Dashboard en vivo
// ════════════════════════════════════════════════════════════════════

/**
 * Número que cuenta de 0 a `base` al entrar, y luego SUBE de forma
 * continua (nunca resetea) sumando `inc` por tick. Si se pasa `fluct`,
 * en vez de subir micro-fluctúa alrededor de la base (±fluct) — usado
 * por el ROI.
 */
function RisingNumber({
  base,
  inc,
  fluct,
  prefix = "",
  decimals = 0,
  hasEntered,
  reduced,
}: {
  base: number;
  inc?: readonly [number, number];
  fluct?: number;
  prefix?: string;
  decimals?: number;
  hasEntered: boolean;
  reduced: boolean;
}) {
  const mv = useMotionValue(reduced ? base : 0);
  const text = useTransform(mv, (v) => {
    // ROI con punto decimal (10.77); enteros agrupados es-ES (12.850).
    const formatted =
      decimals > 0
        ? v.toFixed(decimals)
        : Math.round(v).toLocaleString("es-ES");
    return prefix + formatted;
  });
  const targetRef = useRef(base);

  useEffect(() => {
    if (reduced) {
      mv.set(base);
      return;
    }
    if (!hasEntered) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let live: { stop: () => void } | null = null;

    const intro = animate(mv, base, {
      duration: 1.5,
      ease: "easeOut",
      onComplete: startLoop,
    });

    function startLoop() {
      const tick = () => {
        if (cancelled) return;
        if (fluct != null) {
          targetRef.current = base + (Math.random() * 2 - 1) * fluct;
        } else if (inc) {
          targetRef.current += rand(inc[0], inc[1]);
        }
        live = animate(mv, targetRef.current, {
          duration: 0.45,
          ease: "easeOut",
        });
        timer = setTimeout(tick, rand(dashboardConfig.tickMs[0], dashboardConfig.tickMs[1]));
      };
      timer = setTimeout(tick, rand(2500, 4500));
    }

    return () => {
      cancelled = true;
      intro.stop();
      live?.stop();
      if (timer) clearTimeout(timer);
    };
  }, [hasEntered, reduced, base, inc, fluct, mv]);

  return <motion.span>{text}</motion.span>;
}

// Barra que crece desde abajo al entrar y luego fluctúa en loop,
// independiente del resto (dashboard "respirando").
function Bar({
  height,
  index,
  hasEntered,
  reduced,
}: {
  height: number;
  index: number;
  hasEntered: boolean;
  reduced: boolean;
}) {
  const sy = useMotionValue(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) {
      sy.set(1);
      return;
    }
    if (!hasEntered) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let live: { stop: () => void } | null = null;

    const intro = animate(sy, 1, {
      duration: 0.5,
      delay: index * 0.05,
      ease: "easeOut",
      onComplete: startFluct,
    });

    function startFluct() {
      const tick = () => {
        if (cancelled) return;
        live = animate(sy, rand(0.78, 1.18), { duration: 0.8, ease: "easeInOut" });
        timer = setTimeout(tick, rand(1800, 4000));
      };
      timer = setTimeout(tick, 1000 + index * 300);
    }

    return () => {
      cancelled = true;
      intro.stop();
      live?.stop();
      if (timer) clearTimeout(timer);
    };
  }, [hasEntered, reduced, index, sy]);

  return (
    <motion.span
      className="w-1.5 rounded-sm bg-pimenton-accent"
      style={{ height, scaleY: sy, transformOrigin: "bottom" }}
    />
  );
}

const BAR_HEIGHTS = [10, 16, 12, 20, 18];

function MockDashboard({
  inView,
  reduced,
  index,
}: {
  inView: boolean;
  reduced: boolean;
  index: number;
}) {
  const hasEntered = useHasEntered(inView, reduced, index);
  const { ordenes, facturacion, pedidos, roi } = dashboardConfig;

  return (
    <div className="w-full space-y-3">
      {/* Panel órdenes (dark) */}
      <div className="rounded-xl border border-pimenton-dark-border bg-pimenton-dark p-3.5">
        <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-pimenton-text-on-dark-muted">
          Órdenes 2025
        </p>
        <div className="mt-1.5 flex items-end justify-between gap-3">
          <span className="font-display text-2xl font-bold tabular-nums text-pimenton-accent">
            <RisingNumber
              base={ordenes.base}
              inc={ordenes.inc}
              hasEntered={hasEntered}
              reduced={reduced}
            />
          </span>
          <svg
            width="64"
            height="26"
            viewBox="0 0 64 26"
            fill="none"
            aria-hidden
            className="text-pimenton-accent"
          >
            <motion.path
              d="M1 24 L13 17 L25 19 L37 9 L49 11 L63 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduced ? false : { pathLength: 0 }}
              animate={
                reduced ? { pathLength: 1 } : { pathLength: hasEntered ? 1 : 0 }
              }
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
        </div>
      </div>
      {/* Panel facturación (claro) */}
      <div className="rounded-xl bg-pimenton-bg p-3.5">
        <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-pimenton-text-muted">
          Facturación
        </p>
        <div className="mt-1.5 flex items-end justify-between gap-3">
          <span className="font-display text-2xl font-bold tabular-nums text-pimenton-text">
            <RisingNumber
              base={facturacion.base}
              inc={facturacion.inc}
              prefix="$"
              hasEntered={hasEntered}
              reduced={reduced}
            />
          </span>
          <div className="flex h-6 items-end gap-1">
            {BAR_HEIGHTS.map((h, i) => (
              <Bar
                key={i}
                height={h}
                index={i}
                hasEntered={hasEntered}
                reduced={reduced}
              />
            ))}
          </div>
        </div>
        <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.16em] tabular-nums text-pimenton-text-muted">
          <RisingNumber
            base={pedidos.base}
            inc={pedidos.inc}
            hasEntered={hasEntered}
            reduced={reduced}
          />{" "}
          pedidos ·{" "}
          <RisingNumber
            base={roi.base}
            fluct={roi.fluct}
            decimals={2}
            hasEntered={hasEntered}
            reduced={reduced}
          />{" "}
          ROI
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// Columna 2 — Nota de operación con typing (2 días alternados en loop)
// ════════════════════════════════════════════════════════════════════

const TYPE_SPEED = 38; // ms por carácter

// Devuelve el substring visible (primeros `len` chars) con el fragmento
// `highlight` en coral cuando ya fue tipeado.
function renderTyped(text: string, len: number, highlight?: string): ReactNode {
  const visible = text.slice(0, len);
  if (!highlight) return visible;
  const hs = text.indexOf(highlight);
  if (hs < 0) return visible;
  const he = hs + highlight.length;
  const before = visible.slice(0, Math.min(len, hs));
  const hi = visible.slice(Math.min(len, hs), Math.min(len, he));
  const after = visible.slice(Math.min(len, he));
  return (
    <>
      {before}
      <span className="font-semibold text-pimenton-accent">{hi}</span>
      {after}
    </>
  );
}

function BlinkCaret() {
  return (
    <motion.span
      aria-hidden
      className="text-pimenton-accent"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
    >
      |
    </motion.span>
  );
}

function MockNota({
  inView,
  reduced,
  index,
}: {
  inView: boolean;
  reduced: boolean;
  index: number;
}) {
  const hasEntered = useHasEntered(inView, reduced, index);
  const [dayIndex, setDayIndex] = useState(0);
  const [reveals, setReveals] = useState<number[]>([0, 0, 0]);
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    if (reduced || !hasEntered) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let resolveWait: (() => void) | undefined;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        resolveWait = resolve;
        timer = setTimeout(resolve, ms);
      });

    (async () => {
      let day = 0;
      while (!cancelled) {
        setDayIndex(day);
        setReveals([0, 0, 0]);
        setCycleKey((k) => k + 1);
        await wait(520); // deja entrar la "notificación"
        if (cancelled) break;

        const items = partesDiarios[day].items;
        for (let i = 0; i < items.length; i++) {
          const len = items[i].text.length;
          await wait(200); // micro-pausa antes del ítem
          if (cancelled) break;
          for (let c = 1; c <= len; c++) {
            const item = i;
            const count = c;
            setReveals((prev) => {
              const next = [...prev];
              next[item] = count;
              return next;
            });
            await wait(TYPE_SPEED);
            if (cancelled) break;
          }
          if (cancelled) break;
        }
        if (cancelled) break;

        await wait(2000); // nota completa, legible
        day = (day + 1) % partesDiarios.length;
      }
    })();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      if (resolveWait) resolveWait(); // desbloquea el await pendiente
    };
  }, [hasEntered, reduced]);

  const day = partesDiarios[reduced ? 0 : dayIndex];
  const lens = reduced ? day.items.map((it) => it.text.length) : reveals;
  // Línea activa = última con algún caracter revelado (para el cursor).
  const activeLine = reduced
    ? -1
    : lens.reduce((acc, v, i) => (v > 0 ? i : acc), -1);

  return (
    <div className="mx-auto w-full max-w-[190px]">
      <motion.div
        key={reduced ? "static" : cycleKey}
        initial={reduced ? false : { opacity: 0, y: 10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={
          reduced ? undefined : { type: "spring", stiffness: 320, damping: 20 }
        }
        className="rounded-[1.75rem] border-2 border-pimenton-dark-border bg-pimenton-bg p-3.5 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.6)]"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-pimenton-text/20" />
        <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-pimenton-text-muted">
          Parte diario · {day.fecha}
        </p>
        <ul className="mt-3 space-y-2 text-xs leading-snug text-pimenton-text">
          {day.items.map((item, i) => (
            <li key={i}>
              {renderTyped(item.text, lens[i] ?? 0, item.highlight)}
              {i === activeLine && <BlinkCaret />}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// Columna 3 — Logos rotando (6 slots, pool de 13)
// ════════════════════════════════════════════════════════════════════

function MockLogos({
  inView,
  reduced,
  index,
}: {
  inView: boolean;
  reduced: boolean;
  index: number;
}) {
  const hasEntered = useHasEntered(inView, reduced, index);
  // 6 slots visibles. Estado = índices dentro del pool de 13. Los
  // primeros 6 son los originales (estado estático en reduced-motion).
  const [visible, setVisible] = useState<number[]>([0, 1, 2, 3, 4, 5]);

  useEffect(() => {
    if (reduced || !hasEntered) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const tick = () => {
      if (cancelled) return;
      setVisible((prev) => {
        const used = new Set(prev);
        const candidates: number[] = [];
        for (let i = 0; i < col3LogoPool.length; i++) {
          if (!used.has(i)) candidates.push(i);
        }
        if (candidates.length === 0) return prev;
        const slot = Math.floor(Math.random() * prev.length);
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        const next = [...prev];
        next[slot] = pick; // nunca duplica: pick ∉ visible
        return next;
      });
      timer = setTimeout(tick, rand(1500, 2500));
    };
    timer = setTimeout(tick, rand(1500, 2500));

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [hasEntered, reduced]);

  return (
    <div className="grid w-full grid-cols-3 gap-x-4 gap-y-6">
      {visible.map((logoIdx, slot) => (
        <motion.div
          key={slot}
          className="flex h-9 items-center justify-center"
          initial={reduced ? false : { opacity: 0, scale: 0.8 }}
          animate={
            reduced || hasEntered
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.8 }
          }
          transition={{ duration: 0.4, delay: reduced ? 0 : slot * 0.06, ease: EASE }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={logoIdx}
              src={col3LogoPool[logoIdx]}
              alt=""
              aria-hidden
              draggable={false}
              className="max-h-[60%] max-w-[82%] object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
              initial={reduced ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.9, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.35, ease: EASE }}
            />
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// Columna 4 — Growth Manager rotando (3 perfiles) + "En línea"
// ════════════════════════════════════════════════════════════════════

function MockPerfil({
  inView,
  reduced,
  index,
}: {
  inView: boolean;
  reduced: boolean;
  index: number;
}) {
  const hasEntered = useHasEntered(inView, reduced, index);
  const [gmIndex, setGmIndex] = useState(0);

  useEffect(() => {
    if (reduced || !hasEntered) return;
    let cancelled = false;
    const id = setInterval(() => {
      if (!cancelled) setGmIndex((i) => (i + 1) % growthManagers.length);
    }, 3000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [hasEntered, reduced]);

  const gm = growthManagers[reduced ? 0 : gmIndex];

  return (
    <div className="flex flex-col items-center text-center">
      {/* Perfil completo (foto + nombre + rol) cross-fade como bloque único,
          así la cara y el nombre cambian SIEMPRE juntos (sin desync). Grid
          1×1: ambas copias se apilan en la misma celda durante el cross-fade
          y el contenedor se auto-dimensiona a la más alta → responsive, sin
          altura fija que se desborde sobre "En línea". */}
      <div className="grid w-full grid-cols-1 grid-rows-1">
        <AnimatePresence initial={false}>
          <motion.div
            key={reduced ? "static" : gmIndex}
            className="col-start-1 row-start-1 flex flex-col items-center"
            initial={reduced ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gm.foto}
              alt=""
              aria-hidden
              draggable={false}
              className="size-20 rounded-full object-cover ring-1 ring-pimenton-accent/30"
            />
            <p className="mt-4 text-balance text-sm font-bold uppercase tracking-wide text-pimenton-text-on-dark">
              {gm.nombre}
            </p>
            <p className="mt-1 text-balance font-mono text-[9px] uppercase tracking-[0.16em] text-pimenton-text-on-dark-muted">
              {gm.rol} · {gm.pais}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* En línea — constante, con halo radar */}
      <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-pimenton-dark px-2.5 py-1 text-[10px] font-medium text-pimenton-text-on-dark-muted">
        <LiveDot reduced={reduced} />
        En línea
      </span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// TiltCard — card con tilt 3D follow-mouse + entrada (overflow-safe)
// ════════════════════════════════════════════════════════════════════

const TILT_MAX = 7; // grados máx por eje

function TiltCard({
  title,
  desc,
  index,
  reduced,
  children,
}: {
  title: string;
  desc: string;
  index: number;
  reduced: boolean;
  children: ReactNode;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);
  const rx = useSpring(rotateX, { stiffness: 150, damping: 18, mass: 0.4 });
  const ry = useSpring(rotateY, { stiffness: 150, damping: 18, mass: 0.4 });
  const sc = useSpring(scale, { stiffness: 200, damping: 20, mass: 0.4 });

  // El tilt sólo en dispositivos con puntero fino (sin touch) y sin
  // reduced-motion.
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    setCanHover(
      window.matchMedia?.("(hover: hover) and (pointer: fine)").matches ?? false,
    );
  }, []);
  const interactive = canHover && !reduced;

  const handleMove = (e: ReactMouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    rotateY.set(px * 2 * TILT_MAX);
    rotateX.set(-py * 2 * TILT_MAX); // cursor arriba → tilt hacia atrás arriba
  };
  const handleEnter = () => scale.set(1.02);
  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    // Wrapper = contenedor con perspective (la card hija aplica rotateX/Y).
    // La entrada (opacity + translateY) va acá; el tilt en la card → no se
    // pisan los transforms. py-8 da aire para escalar sin cortarse.
    <motion.div
      className="h-full [perspective:1000px]"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: reduced ? 0 : index * 0.12, ease: EASE }}
    >
      <motion.article
        ref={cardRef}
        onMouseMove={interactive ? handleMove : undefined}
        onMouseEnter={interactive ? handleEnter : undefined}
        onMouseLeave={interactive ? handleLeave : undefined}
        style={
          interactive
            ? {
                rotateX: rx,
                rotateY: ry,
                scale: sc,
                transformStyle: "preserve-3d",
                transformOrigin: "center",
              }
            : undefined
        }
        className="group flex h-full flex-col rounded-2xl border border-pimenton-dark-border bg-pimenton-dark-soft p-6 transition-colors duration-300 hover:border-pimenton-accent/40 sm:p-7"
      >
        <div className="flex min-h-[208px] flex-1 items-center justify-center">
          {children}
        </div>
        <h3 className="mt-6 text-xl font-semibold uppercase tracking-tight text-pimenton-text-on-dark sm:text-2xl">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-pimenton-text-on-dark-muted">
          {desc}
        </p>
      </motion.article>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════
// Sección
// ════════════════════════════════════════════════════════════════════

export function DetrasDeCadaPedido() {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="bg-pimenton-dark py-24 sm:py-32">
      {/* px en el wrapper externo (no en el max-w-7xl), igual que el Control
          Room: así el contenido llega al ancho completo de max-w-7xl y ambos
          bloques coinciden en ancho. */}
      <div className="px-[5%] sm:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-7xl">
          {/* Header */}
          <div className="max-w-3xl">
            <motion.h2
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text-on-dark sm:text-4xl"
            >
              {splitHighlight(
                "Detrás de cada pedido, hay una decisión.",
                "decisión.",
                "coral",
              )}
            </motion.h2>
          </div>

          {/* Grid de 4 columnas. py-8 da aire para el scale/tilt en hover
              (sin overflow-hidden en ningún ancestro → nada se corta). */}
          <div className="mt-14 grid grid-cols-1 gap-6 py-8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
            <TiltCard
              title="Ves todos los datos en el mismo lugar"
              desc="Ventas, margen, ticket y promos. Decidimos con datos reales."
              index={0}
              reduced={reduced}
            >
              <MockDashboard inView={inView} reduced={reduced} index={0} />
            </TiltCard>
            <TiltCard
              title="Nos metemos en la operación"
              desc="Operamos el canal todos los días, de punta a punta."
              index={1}
              reduced={reduced}
            >
              <MockNota inView={inView} reduced={reduced} index={1} />
            </TiltCard>
            <TiltCard
              title="Somos expertos en APPs de Delivery"
              desc="Gestionamos el canal como si fuera nuestro."
              index={2}
              reduced={reduced}
            >
              <MockLogos inView={inView} reduced={reduced} index={2} />
            </TiltCard>
            <TiltCard
              title="Contarás con un equipo de Growth a cargo"
              desc="Un especialista de tu región, dedicado a tu negocio."
              index={3}
              reduced={reduced}
            >
              <MockPerfil inView={inView} reduced={reduced} index={3} />
            </TiltCard>
          </div>
        </div>
      </div>

      {/* Control Room — variante A (video constante): los anillos rotan solos
          en loop. Va entre las 4 cards y el CTA. Renderiza full-width con su
          propio px/max-w-7xl, así alinea con el header, el grid y el CTA. */}
      <ControlRoomAutonomous />

      {/* CTA final — pill coral (mismo estilo que el resto de la web), al
          Contacto, sin icono. */}
      <div className="px-[5%] sm:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex justify-center">
            <CtaPill href="/contacto" label="Hablemos" />
          </div>
        </div>
      </div>
    </section>
  );
}
