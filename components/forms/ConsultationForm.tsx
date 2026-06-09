"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MessageCircle,
  Search,
} from "lucide-react";
import {
  buildWhatsappLink,
  categories,
  featuredCountries,
  otherCountries,
  phoneCodeForCountry,
  sizes,
  type CategoryId,
  type FormSnapshot,
  type SizeId,
} from "@/data/consultationForm";
import { Highlight, splitHighlight } from "@/components/ui-custom/Highlight";
import {
  useCopy,
  useLanguage,
  useT,
} from "@/components/i18n/LanguageContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const AUTO_ADVANCE_DELAY = 600;
const EMOJI_BASE_PATH = "/assets/emoji/3d/";

// ════════════════════════════════════════════════════════════════════
// Emoji 3D — Fluent PNG con fallback a Unicode
// ════════════════════════════════════════════════════════════════════

/**
 * Renderiza el PNG 3D de Microsoft Fluent (en /public/assets/emoji/3d/).
 * Si el archivo no existe todavía, cae al emoji Unicode equivalente
 * para que la UI no se vea rota.
 *
 * Animaciones (todas via motion/react):
 * - Idle: drop-shadow sutil + scale 1, rotate 0.
 * - Hover: scale 1.12, rotate -6°, drop-shadow más fuerte oscuro.
 * - Selected: drop-shadow coral, mantiene scale del hover si activo,
 *   y dispara un wobble corto (rotate [-10, 10, 0] en 0.4s) en cada
 *   toggle del estado seleccionado.
 *
 * Reduced motion: sin scale/rotate/wobble. El drop-shadow (informativo
 * del estado) sí se mantiene.
 */
function Emoji3D({
  name,
  fallback,
  size,
  hovered = false,
  selected = false,
  reduced = false,
  interactive = true,
}: {
  name: string;
  fallback: string;
  size: number;
  hovered?: boolean;
  selected?: boolean;
  reduced?: boolean;
  /** Si false, no aplica animaciones de hover/select (uso decorativo). */
  interactive?: boolean;
}) {
  // El PNG 3D de Fluent puede no existir todavía. En vez de renderizar el
  // <img> y esperar que falle (el onError se PIERDE si el 404 ocurre antes
  // de que React hidrate y enganche el handler → queda la imagen rota),
  // mostramos el emoji Unicode por defecto y sólo hacemos "upgrade" al PNG
  // cuando confirmamos que carga, precargándolo con new Image(). Así nunca
  // se ve una imagen rota y, si en el futuro dropean los PNG en
  // /public/assets/emoji/3d/, se actualiza solo.
  const [pngOk, setPngOk] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const probe = new window.Image();
    probe.onload = () => {
      // naturalWidth 0 == respuesta válida pero no es imagen → no upgrade.
      if (!cancelled && probe.naturalWidth > 0) setPngOk(true);
    };
    probe.src = `${EMOJI_BASE_PATH}${name}`;
    return () => {
      cancelled = true;
    };
  }, [name]);

  // Wobble: re-mount un div interno cada vez que selected cambia. Cada
  // remount dispara los keyframes [-10, 10, 0] en 0.4s. El primer render
  // no dispara (firstRenderRef guard) para evitar que pase al cargar.
  const [wobbleKey, setWobbleKey] = useState(0);
  const firstRenderRef = useRef(true);
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (!interactive || reduced) return;
    setWobbleKey((k) => k + 1);
  }, [selected, interactive, reduced]);

  const inner = pngOk ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${EMOJI_BASE_PATH}${name}`}
      alt=""
      aria-hidden
      width={size}
      height={size}
      draggable={false}
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      aria-hidden
      role="img"
      className="inline-flex items-center justify-center leading-none"
      style={{ fontSize: size * 0.85, width: size, height: size }}
    >
      {fallback}
    </span>
  );

  if (!interactive) {
    return inner;
  }

  // Drop shadow por estado. Selected gana sobre hover (la coral marca
  // estado, el hover es transitorio).
  const filterValue = selected
    ? "drop-shadow(0 6px 12px rgba(232, 75, 60, 0.5))"
    : hovered
      ? "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2))"
      : "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))";

  return (
    <motion.div
      animate={
        reduced
          ? { filter: filterValue }
          : {
              scale: hovered ? 1.12 : 1,
              rotate: hovered ? -6 : 0,
              filter: filterValue,
            }
      }
      transition={{ duration: reduced ? 0.15 : 0.25, ease: EASE }}
      style={{ display: "inline-flex", transformOrigin: "center" }}
    >
      <motion.div
        key={wobbleKey}
        initial={{ rotate: 0 }}
        animate={reduced ? { rotate: 0 } : { rotate: [-10, 10, 0] }}
        transition={{ duration: reduced ? 0 : 0.4, ease: "easeOut" }}
        style={{ display: "inline-flex" }}
      >
        {inner}
      </motion.div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════
// useAutoAdvance — timer reseteable para avance automático del wizard
// ════════════════════════════════════════════════════════════════════

function useAutoAdvance(callback: () => void, delay = AUTO_ADVANCE_DELAY) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const trigger = useCallback(() => {
    cancel();
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      callbackRef.current();
    }, delay);
  }, [cancel, delay]);

  useEffect(() => () => cancel(), [cancel]);
  return { trigger, cancel };
}

// ════════════════════════════════════════════════════════════════════
// OptionCard — card visual con emoji + label + (opcional) caption
// ════════════════════════════════════════════════════════════════════

function OptionCard({
  selected,
  onClick,
  label,
  caption,
  emoji,
  fallback,
  emojiSize = 56,
  reduced,
  ariaPressed,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  caption?: string;
  emoji: string;
  fallback: string;
  emojiSize?: number;
  reduced: boolean;
  ariaPressed?: boolean;
}) {
  // Hover tracked en React (no whileHover) para poder propagar a
  // <Emoji3D>: la animación del emoji depende del hover sobre el botón
  // entero, no sólo sobre el emoji.
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-pressed={ariaPressed}
      animate={
        reduced
          ? { scale: 1 }
          : { scale: selected || hovered ? 1.02 : 1 }
      }
      transition={{ duration: 0.25, ease: EASE }}
      className={`group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 bg-pimenton-surface px-3 py-4 text-center outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-pimenton-accent sm:gap-3 sm:px-4 sm:py-5 ${
        selected
          ? "border-pimenton-accent bg-pimenton-accent/[0.06] shadow-[0_10px_30px_-12px_rgba(232,75,60,0.25)]"
          : "border-pimenton-border shadow-[0_4px_14px_-8px_rgba(15,15,14,0.1)] hover:border-pimenton-accent/40 hover:shadow-[0_10px_30px_-12px_rgba(15,15,14,0.18)]"
      }`}
    >
      <AnimatePresence>
        {selected && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-pimenton-accent text-pimenton-bg sm:right-2.5 sm:top-2.5"
            aria-hidden
          >
            <Check className="size-3" strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>

      <Emoji3D
        name={emoji}
        fallback={fallback}
        size={emojiSize}
        hovered={hovered}
        selected={selected}
        reduced={reduced}
      />

      <div>
        <span className="block text-sm font-bold leading-tight text-pimenton-text sm:text-base">
          {label}
        </span>
        {caption && (
          <span className="mt-0.5 block text-xs text-pimenton-text-muted sm:text-sm">
            {caption}
          </span>
        )}
      </div>
    </motion.button>
  );
}

// ════════════════════════════════════════════════════════════════════
// ProgressBar — 4 segmentos pill
// ════════════════════════════════════════════════════════════════════

function ProgressBar({
  step,
  total,
  reduced,
}: {
  step: number;
  total: number;
  reduced: boolean;
}) {
  return (
    <div className="flex gap-1.5" aria-hidden>
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < step;
        return (
          <div
            key={i}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-pimenton-border"
          >
            <motion.div
              initial={false}
              animate={{ width: filled ? "100%" : "0%" }}
              transition={{ duration: reduced ? 0.15 : 0.45, ease: EASE }}
              className="h-full rounded-full bg-pimenton-accent"
            />
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ConfettiBurst — partículas coral/crema al entrar el success
// ════════════════════════════════════════════════════════════════════

function ConfettiBurst({ reduced }: { reduced: boolean }) {
  // Math.random() acá vive en un componente que sólo renderiza en
  // client (success step), por eso no rompe hydration.
  const particles = useMemo(() => {
    if (reduced) return [];
    return Array.from({ length: 36 }, (_, i) => ({
      id: i,
      angle: Math.random() * Math.PI * 2,
      distance: 140 + Math.random() * 200,
      delay: Math.random() * 0.18,
      duration: 0.9 + Math.random() * 0.9,
      rotation: Math.random() * 720 - 360,
      isAccent: i % 2 === 0,
      size: 6 + Math.random() * 8,
    }));
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 size-0"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-0 top-0 rounded-sm"
          style={{
            width: p.size,
            height: p.size,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
            backgroundColor: p.isAccent
              ? "var(--color-pimenton-accent)"
              : "var(--color-pimenton-bg)",
            border: p.isAccent
              ? undefined
              : "1px solid var(--color-pimenton-border-strong)",
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{
            x: Math.cos(p.angle) * p.distance,
            y: Math.sin(p.angle) * p.distance,
            opacity: [1, 1, 0],
            rotate: p.rotation,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// State + reducer + validación
// ════════════════════════════════════════════════════════════════════

type Step = 1 | 2 | 3 | 4 | "success";

type FormData = {
  categories: CategoryId[];
  countryIso: string;
  countryLabel: string;
  size: SizeId | null;
  restaurant: string;
  phone: string;
  instagram: string;
};

type State = {
  step: Step;
  direction: 1 | -1;
  data: FormData;
};

type Action =
  | { type: "set"; patch: Partial<FormData> }
  | { type: "toggleCategory"; id: CategoryId }
  | { type: "next" }
  | { type: "back" }
  | { type: "reset" };

const INITIAL_STATE: State = {
  step: 1,
  direction: 1,
  data: {
    categories: [],
    countryIso: "",
    countryLabel: "",
    size: null,
    restaurant: "",
    phone: "",
    instagram: "",
  },
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "set":
      return { ...state, data: { ...state.data, ...action.patch } };
    case "toggleCategory": {
      const current = state.data.categories;
      const next = current.includes(action.id)
        ? current.filter((c) => c !== action.id)
        : [...current, action.id];
      return { ...state, data: { ...state.data, categories: next } };
    }
    case "next":
      if (state.step === "success") return state;
      if (state.step === 4) return { ...state, step: "success", direction: 1 };
      return {
        ...state,
        step: (state.step + 1) as Step,
        direction: 1,
      };
    case "back":
      if (state.step === 1) return state;
      if (state.step === "success") return { ...state, step: 4, direction: -1 };
      return {
        ...state,
        step: (state.step - 1) as Step,
        direction: -1,
      };
    case "reset":
      return INITIAL_STATE;
  }
}

/** Cuenta dígitos del teléfono: necesitamos al menos 7 para validar. */
function isValidPhone(s: string): boolean {
  return s.replace(/\D/g, "").length >= 7;
}

function isValid(step: Step, data: FormData): boolean {
  switch (step) {
    case 1:
      return data.categories.length > 0;
    case 2:
      return data.countryIso !== "";
    case 3:
      return data.size !== null;
    case 4:
      return (
        data.restaurant.trim().length > 0 &&
        isValidPhone(data.phone)
      );
    case "success":
      return true;
  }
}

// ════════════════════════════════════════════════════════════════════
// Step components
// ════════════════════════════════════════════════════════════════════

const STEP_VARIANTS = {
  enter: (dir: number) => ({ x: dir * 32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -32, opacity: 0 }),
};

function Step1Category({
  data,
  dispatch,
  reduced,
}: {
  data: FormData;
  dispatch: React.Dispatch<Action>;
  reduced: boolean;
}) {
  const t = useT();
  const aria = useCopy().consultationForm.aria;
  return (
    <div role="group" aria-label={aria.categories}>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {categories.map((c) => {
          const isSelected = data.categories.includes(c.id);
          return (
            <OptionCard
              key={c.id}
              label={t(c.label)}
              emoji={c.emoji}
              fallback={c.fallback}
              selected={isSelected}
              onClick={() => dispatch({ type: "toggleCategory", id: c.id })}
              reduced={reduced}
              ariaPressed={isSelected}
            />
          );
        })}
      </div>
    </div>
  );
}

function Step2Country({
  data,
  dispatch,
  reduced,
}: {
  data: FormData;
  dispatch: React.Dispatch<Action>;
  reduced: boolean;
}) {
  const t = useT();
  const cf = useCopy().consultationForm;
  const formCopy = cf.step2;
  const aria = cf.aria;
  const [otherOpen, setOtherOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { trigger, cancel } = useAutoAdvance(() =>
    dispatch({ type: "next" }),
  );

  const isFeaturedSelected = featuredCountries.some(
    (c) => c.isoCode === data.countryIso,
  );
  const otherSelected = !isFeaturedSelected && data.countryIso !== "";

  const handleFeatured = (iso: string, label: string) => {
    cancel();
    setOtherOpen(false);
    dispatch({ type: "set", patch: { countryIso: iso, countryLabel: label } });
    trigger();
  };

  const handleOtherCard = () => {
    cancel();
    // Si la dropdown está abierta y todavía no hay "otro" elegido, toggle off.
    if (otherOpen && !otherSelected) {
      setOtherOpen(false);
      return;
    }
    // Si la dropdown está cerrada → abrirla. Si había un featured seleccionado,
    // limpiarlo (el usuario está cambiando de opinión).
    setOtherOpen(true);
    if (isFeaturedSelected) {
      dispatch({ type: "set", patch: { countryIso: "", countryLabel: "" } });
    }
  };

  const handleDropdownSelect = (code: string, name: string) => {
    cancel();
    dispatch({ type: "set", patch: { countryIso: code, countryLabel: name } });
    setOtherOpen(false);
    trigger();
  };

  const filteredOthers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return otherCountries;
    return otherCountries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {featuredCountries.map((c) => (
          <OptionCard
            key={c.isoCode}
            label={t(c.label)}
            emoji={c.emoji}
            fallback={c.fallback}
            selected={data.countryIso === c.isoCode}
            onClick={() => handleFeatured(c.isoCode, t(c.label))}
            reduced={reduced}
          />
        ))}
        <OptionCard
          label={otherSelected ? data.countryLabel : formCopy.otherLabel}
          emoji="globe.png"
          fallback="🌎"
          selected={otherSelected || otherOpen}
          onClick={handleOtherCard}
          reduced={reduced}
        />
      </div>

      <AnimatePresence initial={false}>
        {otherOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-2xl border border-pimenton-border bg-pimenton-bg p-3 sm:p-4">
              <div className="relative">
                <Search
                  aria-hidden
                  className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-pimenton-text-muted"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={formCopy.searchPlaceholder}
                  aria-label={aria.searchCountry}
                  className="block h-11 w-full rounded-xl border border-pimenton-border bg-pimenton-surface pl-10 pr-3 text-sm text-pimenton-text outline-none placeholder:text-pimenton-text-muted/70 focus:border-pimenton-accent focus:ring-2 focus:ring-pimenton-accent/25 sm:text-base"
                />
              </div>

              <ul
                className="mt-3 max-h-72 overflow-y-auto"
                role="listbox"
                aria-label={aria.countryList}
              >
                {filteredOthers.length === 0 && (
                  <li className="px-3 py-4 text-center text-sm text-pimenton-text-muted">
                    {formCopy.emptyState}
                  </li>
                )}
                {filteredOthers.map((c) => (
                  <li key={c.code}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={data.countryIso === c.code}
                      onClick={() => handleDropdownSelect(c.code, c.name)}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left outline-none transition-colors hover:bg-pimenton-surface focus-visible:bg-pimenton-surface focus-visible:ring-2 focus-visible:ring-pimenton-accent"
                    >
                      <span className="text-lg" aria-hidden>
                        {c.flag}
                      </span>
                      <span className="flex-1 text-sm font-medium text-pimenton-text sm:text-base">
                        {c.name}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Step3Size({
  data,
  dispatch,
  reduced,
}: {
  data: FormData;
  dispatch: React.Dispatch<Action>;
  reduced: boolean;
}) {
  const { trigger, cancel } = useAutoAdvance(() =>
    dispatch({ type: "next" }),
  );

  const select = (id: SizeId) => {
    cancel();
    dispatch({ type: "set", patch: { size: id } });
    trigger();
  };

  const t = useT();
  const aria = useCopy().consultationForm.aria;

  return (
    <div role="radiogroup" aria-label={aria.sizeGroup}>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {sizes.map((s) => (
          <OptionCard
            key={s.id}
            label={t(s.label)}
            caption={t(s.caption)}
            emoji={s.emoji}
            fallback={s.fallback}
            emojiSize={64}
            selected={data.size === s.id}
            onClick={() => select(s.id)}
            reduced={reduced}
          />
        ))}
      </div>
    </div>
  );
}

function Step4Details({
  data,
  dispatch,
}: {
  data: FormData;
  dispatch: React.Dispatch<Action>;
}) {
  const formCopy = useCopy().consultationForm.step4;
  // Pre-fill del teléfono con el código del país elegido en step 2 — sólo
  // la primera vez que el usuario llega a este paso y no escribió nada.
  const prefilledRef = useRef(false);
  useEffect(() => {
    if (prefilledRef.current) return;
    prefilledRef.current = true;
    if (data.phone.trim()) return;
    const code = phoneCodeForCountry(data.countryIso);
    if (code) dispatch({ type: "set", patch: { phone: code } });
    // dispatch / data.countryIso son estables / sólo lectura inicial.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restaurantId = useId();
  const phoneId = useId();
  const instagramId = useId();

  // Clase compartida — bg blanco (no más cream marronoso) + borde sutil
  // + ring coral al focus.
  const inputClass =
    "block h-12 w-full rounded-xl border border-pimenton-border bg-pimenton-surface px-4 text-base text-pimenton-text outline-none placeholder:text-pimenton-text-muted/70 focus:border-pimenton-accent focus:ring-2 focus:ring-pimenton-accent/25";

  return (
    <div className="space-y-5">
      {/* Restaurante — required */}
      <div>
        <label
          htmlFor={restaurantId}
          className="mb-1.5 block text-sm font-medium text-pimenton-text sm:text-base"
        >
          {formCopy.restaurantLabel}
        </label>
        <input
          id={restaurantId}
          type="text"
          value={data.restaurant}
          onChange={(e) =>
            dispatch({ type: "set", patch: { restaurant: e.target.value } })
          }
          placeholder={formCopy.restaurantPlaceholder}
          autoComplete="organization"
          required
          aria-required
          className={inputClass}
        />
      </div>

      {/* Móvil — required */}
      <div>
        <label
          htmlFor={phoneId}
          className="mb-1.5 block text-sm font-medium text-pimenton-text sm:text-base"
        >
          {formCopy.phoneLabel}
        </label>
        <input
          id={phoneId}
          type="tel"
          inputMode="tel"
          value={data.phone}
          onChange={(e) =>
            dispatch({ type: "set", patch: { phone: e.target.value } })
          }
          placeholder={formCopy.phonePlaceholder}
          autoComplete="tel"
          required
          aria-required
          aria-describedby={`${phoneId}-hint`}
          className={inputClass}
        />
        <p
          id={`${phoneId}-hint`}
          className="mt-2 text-xs text-pimenton-text-muted sm:text-sm"
        >
          {formCopy.phoneHint}
        </p>
      </div>

      {/* Instagram — opcional */}
      <div>
        <label
          htmlFor={instagramId}
          className="mb-1.5 flex items-center gap-2 text-sm font-medium text-pimenton-text sm:text-base"
        >
          <span>{formCopy.instagramLabel}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-pimenton-text-muted">
            {formCopy.instagramOptional}
          </span>
        </label>
        <div className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-pimenton-text-muted"
          >
            @
          </span>
          <input
            id={instagramId}
            type="text"
            value={data.instagram}
            onChange={(e) =>
              dispatch({ type: "set", patch: { instagram: e.target.value } })
            }
            placeholder={formCopy.instagramPlaceholder}
            autoComplete="off"
            className={`${inputClass} pl-10`}
          />
        </div>
      </div>
    </div>
  );
}

function SuccessScreen({
  data,
  reduced,
  link,
}: {
  data: FormData;
  reduced: boolean;
  link: string;
}) {
  const successCopy = useCopy().consultationForm.success;
  const restaurant = data.restaurant.trim();
  // Partimos el template "¡Listo, {restaurant}!" para resaltar el nombre
  // del restaurante en coral. Si por algún edge case viene vacío, caemos
  // a "¡Listo!" sin interpolación para no mostrar "¡Listo, !".
  const [titleBefore, titleAfter] = successCopy.title.split("{restaurant}");

  return (
    <div className="relative flex flex-col items-center text-center">
      <ConfettiBurst reduced={reduced} />

      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <Emoji3D name="party.png" fallback="🎉" size={96} />
      </motion.div>

      <motion.h3
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
        className="mt-6 text-3xl font-black tracking-tight text-pimenton-text sm:text-4xl"
      >
        {restaurant ? (
          <>
            {titleBefore}
            <Highlight color="coral">{restaurant}</Highlight>
            {titleAfter}
          </>
        ) : (
          successCopy.titleFallback
        )}
      </motion.h3>

      <motion.p
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
        className="mt-4 max-w-md text-base leading-relaxed text-pimenton-text-soft sm:text-lg"
      >
        {successCopy.description}
      </motion.p>

      <motion.a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
        whileHover={reduced ? undefined : { scale: 1.04 }}
        whileTap={reduced ? undefined : { scale: 0.96 }}
        className="mt-8 inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-pimenton-accent px-8 py-4 text-base font-semibold text-pimenton-bg shadow-xl shadow-pimenton-accent/40 outline-none transition-shadow duration-300 hover:shadow-pimenton-accent/60 focus-visible:ring-2 focus-visible:ring-pimenton-accent focus-visible:ring-offset-2 sm:text-lg"
      >
        <MessageCircle aria-hidden className="size-5" />
        {successCopy.cta}
      </motion.a>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// Main component
// ════════════════════════════════════════════════════════════════════

export function ConsultationForm() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const reduced = useReducedMotion() ?? false;
  const formCopy = useCopy().consultationForm;
  const { lang } = useLanguage();

  const valid = isValid(state.step, state.data);

  // Construye el snapshot al disparar submit. Asumimos que validación
  // pasó antes de llegar acá (state.step === 4 && valid).
  const buildSnapshot = useCallback((): FormSnapshot | null => {
    const d = state.data;
    if (!d.size) return null;
    return {
      categories: d.categories,
      countryIso: d.countryIso,
      countryLabel: d.countryLabel,
      size: d.size,
      restaurant: d.restaurant,
      phone: d.phone,
      instagram: d.instagram,
    };
  }, [state.data]);

  const submitForm = useCallback(() => {
    if (!isValid(4, state.data)) return;
    const snap = buildSnapshot();
    if (!snap) return;
    const link = buildWhatsappLink(snap, lang);
    window.open(link, "_blank", "noopener,noreferrer");
    dispatch({ type: "next" });
  }, [state.data, buildSnapshot, lang]);

  // Para el botón de WhatsApp en success — pre-armamos el link una vez
  // estamos en success (no antes, los datos pueden no estar completos).
  const successLink = useMemo(() => {
    if (state.step !== "success") return "";
    const snap = buildSnapshot();
    return snap ? buildWhatsappLink(snap, lang) : "";
  }, [state.step, buildSnapshot, lang]);

  // Resolver label/title por paso para el header del wizard.
  const stepLabel =
    state.step === 1
      ? formCopy.step1.label
      : state.step === 2
        ? formCopy.step2.label
        : state.step === 3
          ? formCopy.step3.label
          : state.step === 4
            ? formCopy.step4.label
            : "";

  // Título del paso con la parte resaltada (estilo marcador) por paso.
  // Todos en coral para consistencia visual dentro del wizard.
  const stepTitle =
    state.step === 1
      ? splitHighlight(formCopy.step1.title, formCopy.step1.titleAccent, "coral")
      : state.step === 2
        ? splitHighlight(formCopy.step2.title, formCopy.step2.titleAccent, "coral")
        : state.step === 3
          ? splitHighlight(
              formCopy.step3.title,
              formCopy.step3.titleAccent,
              "coral",
            )
          : state.step === 4
            ? splitHighlight(
                formCopy.step4.title,
                formCopy.step4.titleAccent,
                "coral",
              )
            : null;

  const progressStep = state.step === "success" ? 4 : state.step;

  const handleNext = () => {
    if (state.step === 4) submitForm();
    else dispatch({ type: "next" });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-pimenton-border bg-pimenton-surface p-6 shadow-[0_22px_60px_-24px_rgba(15,15,14,0.22)] sm:p-8 lg:p-10">
      {state.step !== "success" ? (
        <>
          {/* Header */}
          <div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-pimenton-accent sm:text-xs">
              {stepLabel}
            </p>
            <h3 className="mt-2 text-2xl font-black leading-[1.05] tracking-tight text-pimenton-text sm:text-3xl">
              {stepTitle}
            </h3>
            {state.step === 1 && (
              <p className="mt-2 text-sm text-pimenton-text-muted sm:text-base">
                {formCopy.step1.helper}
              </p>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <ProgressBar step={progressStep} total={4} reduced={reduced} />
          </div>

          {/* Step content */}
          <div className="mt-7 sm:mt-8">
            <AnimatePresence
              mode="wait"
              custom={state.direction}
              initial={false}
            >
              <motion.div
                key={state.step}
                custom={state.direction}
                variants={STEP_VARIANTS}
                initial={reduced ? { opacity: 0 } : "enter"}
                animate={reduced ? { opacity: 1 } : "center"}
                exit={reduced ? { opacity: 0 } : "exit"}
                transition={{ duration: reduced ? 0.18 : 0.28, ease: EASE }}
              >
                {state.step === 1 && (
                  <Step1Category
                    data={state.data}
                    dispatch={dispatch}
                    reduced={reduced}
                  />
                )}
                {state.step === 2 && (
                  <Step2Country
                    data={state.data}
                    dispatch={dispatch}
                    reduced={reduced}
                  />
                )}
                {state.step === 3 && (
                  <Step3Size
                    data={state.data}
                    dispatch={dispatch}
                    reduced={reduced}
                  />
                )}
                {state.step === 4 && (
                  <Step4Details data={state.data} dispatch={dispatch} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer / navegación */}
          <div className="mt-8 flex items-center justify-between border-t border-pimenton-border pt-5">
            <button
              type="button"
              onClick={() => dispatch({ type: "back" })}
              disabled={state.step === 1}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-pimenton-text-soft outline-none transition-colors hover:text-pimenton-text focus-visible:ring-2 focus-visible:ring-pimenton-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-pimenton-text-soft sm:text-base"
            >
              <ArrowLeft className="size-4" />
              {formCopy.nav.back}
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!valid}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-pimenton-accent px-5 py-3 text-sm font-semibold text-pimenton-bg shadow-md shadow-pimenton-accent/25 outline-none transition-all hover:shadow-pimenton-accent/40 focus-visible:ring-2 focus-visible:ring-pimenton-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none sm:px-6 sm:text-base"
            >
              {state.step === 4 ? formCopy.step4.submitLabel : formCopy.nav.next}
              <ArrowRight className="size-4" />
            </button>
          </div>
        </>
      ) : (
        <motion.div
          key="success"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="py-6 sm:py-10"
        >
          <SuccessScreen
            data={state.data}
            reduced={reduced}
            link={successLink}
          />
        </motion.div>
      )}
    </div>
  );
}
