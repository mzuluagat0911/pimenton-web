"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { copy } from "@/data/copy";

export type Lang = "es" | "en";

/** Campo bilingüe. `en` es opcional: si falta, el helper cae a `es`. */
export type Localized = { es: string; en?: string };

/**
 * Tipo que "resuelve" el árbol de copy: cada hoja {es,en} pasa a ser un
 * string; el resto (números, paths, enums) queda igual. Permite que
 * useCopy() devuelva un árbol ya traducido y type-safe.
 */
export type Resolved<T> = T extends Localized
  ? string
  : T extends readonly (infer E)[]
    ? Resolved<E>[]
    : T extends object
      ? { -readonly [K in keyof T]: Resolved<T[K]> }
      : T;

const STORAGE_KEY = "pimenton-lang";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function persist(lang: Lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* localStorage no disponible — la preferencia no persiste, sin romper */
  }
}

/**
 * Provider global del idioma (client-side, sin routing i18n). El idioma vive
 * en runtime; la URL no cambia. Persiste en localStorage.
 *
 * SSR/hidratación: el primer render es SIEMPRE "es" (igual que el server),
 * y recién en el efecto se lee la preferencia guardada / el idioma del
 * navegador. Así no hay mismatch de hidratación.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    let next: Lang | null = null;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "es" || stored === "en") next = stored;
    } catch {
      /* noop */
    }
    // Primera visita sin preferencia: sugerir EN si el navegador no es español.
    if (!next) {
      const navLang =
        typeof navigator !== "undefined" ? navigator.language : "";
      if (navLang && !navLang.toLowerCase().startsWith("es")) next = "en";
    }
    if (next && next !== "es") setLangState(next);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    persist(next);
  }, []);

  const toggle = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === "es" ? "en" : "es";
      persist(next);
      return next;
    });
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, toggle }),
    [lang, setLang, toggle],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage debe usarse dentro de <LanguageProvider>.");
  }
  return ctx;
}

/**
 * Helper de traducción. Resuelve un campo bilingüe al idioma activo, con
 * fallback a `.es` si falta `.en` (clave aún no traducida).
 *
 *   const t = useT();
 *   t(copy.hero.headline)  // string en el idioma actual
 */
export function useT(): (field: Localized) => string {
  const { lang } = useLanguage();
  return useCallback((field: Localized) => field[lang] ?? field.es, [lang]);
}

// Resuelve recursivamente el árbol: las hojas {es,en} (objeto cuyas únicas
// claves son es/en) colapsan al idioma activo (con fallback a es); el resto
// se preserva (números, paths, enums, nombres propios).
function deepResolve(node: unknown, lang: Lang): unknown {
  if (Array.isArray(node)) return node.map((n) => deepResolve(n, lang));
  if (node && typeof node === "object") {
    const keys = Object.keys(node);
    if (
      keys.includes("es") &&
      keys.every((k) => k === "es" || k === "en")
    ) {
      const loc = node as Localized;
      return loc[lang] ?? loc.es;
    }
    const out: Record<string, unknown> = {};
    for (const k of keys) {
      out[k] = deepResolve((node as Record<string, unknown>)[k], lang);
    }
    return out;
  }
  return node;
}

/**
 * Devuelve TODO el copy ya resuelto al idioma activo. Los componentes hacen
 * `const c = useCopy()` y acceden `c.hero.headline` como string. Memoizado
 * por idioma (copy es estático).
 */
export function useCopy(): Resolved<typeof copy> {
  const { lang } = useLanguage();
  return useMemo(
    () => deepResolve(copy, lang) as Resolved<typeof copy>,
    [lang],
  );
}
