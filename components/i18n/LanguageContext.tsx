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
import { usePathname, useRouter } from "next/navigation";
import { copy } from "@/data/copy";
import {
  getLocaleFromPathname,
  switchLocalePath,
  withLocale,
} from "@/lib/i18n";

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
 * Provider global del idioma. La URL del browser (`/es`, `/en`) es la fuente
 * de verdad. Ojo: con rewrite del middleware, usePathname() devuelve la ruta
 * interna SIN el prefijo, así que leemos window.location.pathname en un effect.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  // SSR + primer paint: siempre "es" (mismo que el HTML del server) para no
  // romper hidratación. El effect sincroniza con /en|/es de la URL real.
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const next = getLocaleFromPathname(window.location.pathname);
    setLangState(next);
    persist(next);
    document.documentElement.lang = next;
  }, [pathname]);

  const setLang = useCallback(
    (next: Lang) => {
      const currentPath = window.location.pathname;
      const currentLang = getLocaleFromPathname(currentPath);
      if (next === currentLang) return;
      router.push(switchLocalePath(currentPath, next));
    },
    [router],
  );

  const toggle = useCallback(() => {
    setLang(lang === "es" ? "en" : "es");
  }, [lang, setLang]);

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

/** Prefija rutas internas con el idioma activo (`/contacto` → `/es/contacto`). */
export function useLocalizedHref(): (path: string) => string {
  const { lang } = useLanguage();
  return useCallback((path: string) => withLocale(path, lang), [lang]);
}
