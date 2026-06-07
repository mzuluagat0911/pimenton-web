"use client";

import {
  useCallback,
  useEffect,
  useId,
  useReducer,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  Check,
  ChevronDown,
  MessageCircle,
  RotateCcw,
  X,
} from "lucide-react";
import {
  buildSummary,
  buildWhatsappLink,
  categories,
  countries,
  locations,
  type CategoryId,
  type FormSnapshot,
  type LocationsId,
} from "@/data/contactForm";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const TOTAL_STEPS = 4;

// ────────────────── State ──────────────────

type Step = 1 | 2 | 3 | 4 | "confirm";

type FormData = {
  category: CategoryId | null;
  categoryOther: string;
  locations: LocationsId | null;
  /** ISO 3166-1 alpha-2 — "" antes de elegir, válido cuando no vacío */
  country: string;
  name: string;
  restaurant: string;
  phone: string;
  instagram: string;
};

type State = {
  step: Step;
  /** Dirección de la última transición — para slide animation */
  direction: 1 | -1;
  data: FormData;
  /** Marca si el usuario ya clickeó "Enviar por WhatsApp" — habilita el
      mensaje de éxito + el botón de reset. */
  sent: boolean;
};

type Action =
  | { type: "patch"; patch: Partial<FormData> }
  | { type: "next" }
  | { type: "back" }
  | { type: "markSent" }
  | { type: "reset" };

const INITIAL: State = {
  step: 1,
  direction: 1,
  data: {
    category: null,
    categoryOther: "",
    locations: null,
    country: "",
    name: "",
    restaurant: "",
    phone: "",
    instagram: "",
  },
  sent: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "patch":
      return { ...state, data: { ...state.data, ...action.patch } };
    case "next": {
      if (state.step === "confirm") return state;
      if (state.step === 4) return { ...state, step: "confirm", direction: 1 };
      return {
        ...state,
        step: (state.step + 1) as Step,
        direction: 1,
      };
    }
    case "back": {
      if (state.step === 1) return state;
      if (state.step === "confirm") return { ...state, step: 4, direction: -1 };
      return {
        ...state,
        step: (state.step - 1) as Step,
        direction: -1,
      };
    }
    case "markSent":
      return { ...state, sent: true };
    case "reset":
      return INITIAL;
  }
}

function isStepValid(step: Step, data: FormData): boolean {
  switch (step) {
    case 1:
      if (!data.category) return false;
      if (data.category === "otros" && !data.categoryOther.trim()) return false;
      return true;
    case 2:
      return data.locations !== null;
    case 3:
      return data.country !== "";
    case 4:
      return (
        data.name.trim().length > 0 &&
        data.restaurant.trim().length > 0 &&
        data.phone.trim().length > 0
      );
    case "confirm":
      return true;
  }
}

function buildSnapshot(data: FormData): FormSnapshot | null {
  if (!data.category || !data.locations || !data.country) return null;
  return {
    category: data.category,
    categoryOther: data.categoryOther,
    locations: data.locations,
    country: data.country,
    name: data.name,
    restaurant: data.restaurant,
    phone: data.phone,
    instagram: data.instagram,
  };
}

// ────────────────── Animation variants ──────────────────

const stepVariants = {
  enter: (dir: number) => ({ x: dir * 28, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -28, opacity: 0 }),
};

// ────────────────── Component API ──────────────────

type Props =
  | { variant: "inline" }
  | { variant: "modal"; open: boolean; onClose: () => void };

export function ConsultancyForm(props: Props) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const reduced = useReducedMotion() ?? false;

  // Cuando el modal se cierra, reseteamos el form para que la próxima
  // apertura arranque limpia. Inline no se resetea — el usuario podría
  // estar viéndolo y no querés perder estado por re-render.
  useEffect(() => {
    if (props.variant === "modal" && !props.open) {
      // Pequeño delay para no resetear ANTES de que termine la animación
      // de salida del modal (sino el usuario ve un "flash" del step 1).
      const t = setTimeout(() => dispatch({ type: "reset" }), 350);
      return () => clearTimeout(t);
    }
  }, [props]);

  const handleSubmit = useCallback(() => {
    const snap = buildSnapshot(state.data);
    if (!snap) return;
    const url = buildWhatsappLink(snap);
    window.open(url, "_blank", "noopener,noreferrer");
    dispatch({ type: "markSent" });
  }, [state.data]);

  const body = (
    <FormBody
      state={state}
      dispatch={dispatch}
      reduced={reduced}
      onSubmit={handleSubmit}
      onClose={props.variant === "modal" ? props.onClose : undefined}
      variant={props.variant}
    />
  );

  if (props.variant === "modal") {
    return (
      <ModalShell
        open={props.open}
        onClose={props.onClose}
        reduced={reduced}
      >
        {body}
      </ModalShell>
    );
  }

  return body;
}

// ────────────────── Modal shell ──────────────────

function ModalShell({
  open,
  onClose,
  reduced,
  children,
}: {
  open: boolean;
  onClose: () => void;
  reduced: boolean;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Portal SSR-safe
  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC + focus trap + body scroll lock + restaurar foco al cerrar.
  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    // Foco al primer focusable después de la animación de entrada.
    const focusTimer = setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    }, 80);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="consultancy-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.15 : 0.24, ease: EASE }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Cerrar formulario"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.24 }}
            className="absolute inset-0 cursor-default bg-pimenton-dark/55 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={
              reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }
            }
            animate={
              reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }
            }
            transition={{ duration: reduced ? 0.18 : 0.32, ease: EASE }}
            className="relative z-10 w-full max-w-2xl"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ────────────────── Form body ──────────────────

function FormBody({
  state,
  dispatch,
  reduced,
  onSubmit,
  onClose,
  variant,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
  reduced: boolean;
  onSubmit: () => void;
  onClose?: () => void;
  variant: "inline" | "modal";
}) {
  const headingId = useId();
  const valid = isStepValid(state.step, state.data);
  const stepNum = state.step === "confirm" ? TOTAL_STEPS : state.step;

  // En step "confirm" no hay título — el header muestra el resumen. En
  // los 4 pasos del flujo, el título cambia.
  const stepTitles: Record<Exclude<Step, "confirm">, string> = {
    1: "Elegí tu categoría",
    2: "¿Cuántas ubicaciones tenés?",
    3: "¿En qué país estás?",
    4: "Tus datos",
  };

  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-3xl border border-pimenton-border bg-pimenton-surface shadow-[0_24px_60px_-20px_rgba(15,15,14,0.18)]"
      // Altura máxima razonable; el contenido scrollea internamente si
      // hace falta (útil en modal sobre viewports cortos).
      style={{ maxHeight: "calc(100vh - 4rem)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-pimenton-border px-6 py-5 sm:px-8 sm:py-6">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-pimenton-accent sm:text-xs">
            {state.step === "confirm"
              ? "Revisá tus datos"
              : `Paso ${stepNum} de ${TOTAL_STEPS}`}
          </p>
          <h2
            id={variant === "modal" ? "consultancy-modal-title" : headingId}
            className="mt-1 text-xl font-semibold tracking-tight text-pimenton-text sm:text-2xl"
          >
            {state.step === "confirm"
              ? "Listo, ¿enviamos?"
              : stepTitles[state.step]}
          </h2>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar formulario"
            className="flex size-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full text-pimenton-text-muted outline-none transition-colors hover:bg-pimenton-bg-soft hover:text-pimenton-text focus-visible:ring-2 focus-visible:ring-pimenton-accent"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <ProgressBar
        step={state.step === "confirm" ? TOTAL_STEPS + 1 : state.step}
        total={TOTAL_STEPS}
        reduced={reduced}
      />

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto px-6 py-7 sm:px-8 sm:py-9">
        <AnimatePresence mode="wait" custom={state.direction} initial={false}>
          <motion.div
            key={state.step}
            custom={state.direction}
            variants={stepVariants}
            initial={reduced ? { opacity: 0 } : "enter"}
            animate={reduced ? { opacity: 1 } : "center"}
            exit={reduced ? { opacity: 0 } : "exit"}
            transition={{ duration: reduced ? 0.18 : 0.28, ease: EASE }}
          >
            {state.step === 1 && (
              <StepCategory data={state.data} dispatch={dispatch} />
            )}
            {state.step === 2 && (
              <StepLocations data={state.data} dispatch={dispatch} />
            )}
            {state.step === 3 && (
              <StepCountry data={state.data} dispatch={dispatch} />
            )}
            {state.step === 4 && (
              <StepDetails data={state.data} dispatch={dispatch} />
            )}
            {state.step === "confirm" && (
              <StepConfirm data={state.data} sent={state.sent} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer / navegación */}
      <div className="flex items-center justify-between gap-3 border-t border-pimenton-border bg-pimenton-bg-soft/40 px-6 py-4 sm:px-8 sm:py-5">
        <button
          type="button"
          onClick={() => dispatch({ type: "back" })}
          disabled={state.step === 1}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-pimenton-text-soft outline-none transition-colors hover:text-pimenton-text focus-visible:ring-2 focus-visible:ring-pimenton-accent disabled:cursor-not-allowed disabled:opacity-40 sm:text-base"
        >
          <ArrowLeft className="size-4" />
          Atrás
        </button>

        {state.step === "confirm" ? (
          state.sent ? (
            <button
              type="button"
              onClick={() => dispatch({ type: "reset" })}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-pimenton-text px-5 py-3 text-sm font-semibold text-pimenton-bg outline-none transition-all hover:opacity-90 focus-visible:ring-2 focus-visible:ring-pimenton-accent focus-visible:ring-offset-2 sm:px-6 sm:text-base"
            >
              <RotateCcw className="size-4" />
              Empezar de nuevo
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-pimenton-accent px-5 py-3 text-sm font-semibold text-pimenton-bg shadow-lg shadow-pimenton-accent/30 outline-none transition-all hover:shadow-pimenton-accent/45 focus-visible:ring-2 focus-visible:ring-pimenton-accent focus-visible:ring-offset-2 sm:px-6 sm:text-base"
            >
              <MessageCircle className="size-4" />
              Enviar por WhatsApp
            </button>
          )
        ) : (
          <button
            type="button"
            onClick={() => dispatch({ type: "next" })}
            disabled={!valid}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-pimenton-accent px-5 py-3 text-sm font-semibold text-pimenton-bg shadow-md shadow-pimenton-accent/25 outline-none transition-all hover:shadow-pimenton-accent/40 focus-visible:ring-2 focus-visible:ring-pimenton-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none sm:px-6 sm:text-base"
          >
            {state.step === 4 ? "Continuar" : "Siguiente"}
            <ArrowRight className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ────────────────── Progress bar ──────────────────

function ProgressBar({
  step,
  total,
  reduced,
}: {
  step: number;
  total: number;
  reduced: boolean;
}) {
  // En "confirm" mostramos 100% (step = total + 1).
  const pct = Math.min(100, (step / total) * 100);
  return (
    <div className="h-1 w-full bg-pimenton-bg-soft" aria-hidden>
      <motion.div
        className="h-full bg-pimenton-accent"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: reduced ? 0.15 : 0.5, ease: EASE }}
      />
    </div>
  );
}

// ────────────────── Cards selector reutilizable ──────────────────

function OptionCard<Id extends string>({
  selected,
  onClick,
  label,
  layout = "default",
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  layout?: "default" | "wide";
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`group relative flex cursor-pointer items-center justify-between gap-3 rounded-2xl border bg-pimenton-bg-soft px-5 py-4 text-left outline-none transition-all hover:border-pimenton-accent/40 hover:bg-pimenton-bg-soft/80 focus-visible:ring-2 focus-visible:ring-pimenton-accent ${
        selected
          ? "border-pimenton-accent bg-pimenton-accent/10"
          : "border-pimenton-border"
      } ${layout === "wide" ? "min-h-[68px]" : "min-h-[60px]"}`}
    >
      <span
        className={`text-sm font-medium sm:text-base ${
          selected ? "text-pimenton-text" : "text-pimenton-text-soft"
        }`}
      >
        {label}
      </span>
      <span
        aria-hidden
        className={`flex size-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          selected
            ? "border-pimenton-accent bg-pimenton-accent text-pimenton-bg"
            : "border-pimenton-border bg-transparent"
        }`}
      >
        {selected && <Check className="size-3.5" strokeWidth={3} />}
      </span>
    </button>
  );
}

// ────────────────── Step 1 — Categoría ──────────────────

function StepCategory({
  data,
  dispatch,
}: {
  data: FormData;
  dispatch: React.Dispatch<Action>;
}) {
  return (
    <div role="radiogroup" aria-label="Categoría">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {categories.map((opt) => (
          <OptionCard
            key={opt.id}
            label={opt.label}
            selected={data.category === opt.id}
            onClick={() => dispatch({ type: "patch", patch: { category: opt.id } })}
          />
        ))}
      </div>
      <OtherInputCollapse
        show={data.category === "otros"}
        value={data.categoryOther}
        onChange={(v) =>
          dispatch({ type: "patch", patch: { categoryOther: v } })
        }
        placeholder="Contanos qué tipo de cocina"
        label="Especificá tu categoría"
      />
    </div>
  );
}

// ────────────────── Step 2 — Ubicaciones ──────────────────

function StepLocations({
  data,
  dispatch,
}: {
  data: FormData;
  dispatch: React.Dispatch<Action>;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Cantidad de ubicaciones"
      className="grid grid-cols-1 gap-3 sm:grid-cols-3"
    >
      {locations.map((opt) => (
        <OptionCard
          key={opt.id}
          label={opt.label}
          selected={data.locations === opt.id}
          onClick={() => dispatch({ type: "patch", patch: { locations: opt.id } })}
          layout="wide"
        />
      ))}
    </div>
  );
}

// ────────────────── Step 3 — País ──────────────────

function StepCountry({
  data,
  dispatch,
}: {
  data: FormData;
  dispatch: React.Dispatch<Action>;
}) {
  const id = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-pimenton-text sm:text-base"
      >
        País
      </label>
      <div className="relative">
        <select
          id={id}
          value={data.country}
          onChange={(e) =>
            dispatch({ type: "patch", patch: { country: e.target.value } })
          }
          required
          aria-required
          className="w-full cursor-pointer appearance-none rounded-xl border border-pimenton-border bg-pimenton-bg px-4 py-3.5 pr-12 text-sm text-pimenton-text outline-none transition-colors focus:border-pimenton-accent focus:ring-2 focus:ring-pimenton-accent/25 sm:text-base"
        >
          <option value="" disabled>
            Elegí tu país…
          </option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-pimenton-text-muted"
        />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-pimenton-text-muted sm:text-sm">
        Usamos tu país para conectarte con el especialista de tu región
        por WhatsApp.
      </p>
    </div>
  );
}

// ────────────────── Step 4 — Datos ──────────────────

function StepDetails({
  data,
  dispatch,
}: {
  data: FormData;
  dispatch: React.Dispatch<Action>;
}) {
  return (
    <div className="space-y-5">
      <TextField
        label="Tu nombre"
        required
        value={data.name}
        onChange={(v) => dispatch({ type: "patch", patch: { name: v } })}
        placeholder="Cómo te llamás"
        autoComplete="name"
      />
      <TextField
        label="Nombre del restaurante"
        required
        value={data.restaurant}
        onChange={(v) => dispatch({ type: "patch", patch: { restaurant: v } })}
        placeholder="Pimentón Pizzería"
        autoComplete="organization"
      />
      <TextField
        label="Teléfono móvil"
        required
        value={data.phone}
        onChange={(v) => dispatch({ type: "patch", patch: { phone: v } })}
        placeholder="+54 9 11 5703 5170"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
      />
      <TextField
        label="Instagram"
        optional
        value={data.instagram}
        onChange={(v) => dispatch({ type: "patch", patch: { instagram: v } })}
        placeholder="turestaurante"
        icon={<AtSign className="size-4" />}
        autoComplete="off"
      />
    </div>
  );
}

// ────────────────── Step "confirm" — Resumen ──────────────────

function StepConfirm({
  data,
  sent,
}: {
  data: FormData;
  sent: boolean;
}) {
  const snap = buildSnapshot(data);
  if (!snap) return null;
  const rows = buildSummary(snap);

  return (
    <div>
      <p className="text-sm text-pimenton-text-soft sm:text-base">
        Revisá los datos. Al enviar abrimos WhatsApp con el mensaje
        precargado en el chat del especialista de tu región.
      </p>

      <dl className="mt-6 divide-y divide-pimenton-border overflow-hidden rounded-2xl border border-pimenton-border bg-pimenton-bg-soft">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-4 px-4 py-3 sm:px-5 sm:py-3.5"
          >
            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-pimenton-text-muted sm:text-xs">
              {row.label}
            </dt>
            <dd className="min-w-0 break-words text-right text-sm font-medium text-pimenton-text sm:text-base">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {sent && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mt-6 flex items-start gap-3 rounded-2xl border border-pimenton-accent/40 bg-pimenton-accent/10 px-4 py-3.5 sm:px-5"
          role="status"
        >
          <Check className="mt-0.5 size-5 flex-shrink-0 text-pimenton-accent" />
          <div>
            <p className="text-sm font-semibold text-pimenton-text sm:text-base">
              Abrimos WhatsApp en otra pestaña.
            </p>
            <p className="mt-0.5 text-xs text-pimenton-text-soft sm:text-sm">
              Si no se abrió, revisá el bloqueador de pop-ups y volvé a tocar
              el botón.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ────────────────── Helpers de UI ──────────────────

function TextField({
  label,
  value,
  onChange,
  placeholder,
  required,
  optional,
  type = "text",
  autoComplete,
  inputMode,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "url";
  icon?: React.ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-center gap-2 text-sm font-medium text-pimenton-text sm:text-base"
      >
        <span>{label}</span>
        {optional && (
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-pimenton-text-muted">
            opcional
          </span>
        )}
      </label>
      <div className="relative">
        {icon && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-pimenton-text-muted"
          >
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-required={required || undefined}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className={`w-full rounded-xl border border-pimenton-border bg-pimenton-bg px-4 py-3 text-sm text-pimenton-text outline-none transition-colors placeholder:text-pimenton-text-muted/70 focus:border-pimenton-accent focus:ring-2 focus:ring-pimenton-accent/25 sm:text-base ${
            icon ? "pl-10" : ""
          }`}
        />
      </div>
    </div>
  );
}

/**
 * Input expandible para el caso "Otros" — aparece animado debajo del
 * grid de opciones. Reusa el mismo TextField visualmente.
 */
function OtherInputCollapse({
  show,
  value,
  onChange,
  placeholder,
  label,
}: {
  show: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label: string;
}) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="overflow-hidden"
        >
          <div className="pt-5">
            <TextField
              label={label}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              required
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
