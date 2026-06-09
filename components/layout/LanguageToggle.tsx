"use client";

import { useLanguage, type Lang } from "@/components/i18n/LanguageContext";

const LANGS: { code: Lang; label: string; aria: string }[] = [
  { code: "es", label: "ES", aria: "Cambiar idioma a español" },
  { code: "en", label: "EN", aria: "Switch language to English" },
];

/**
 * Toggle ES/EN. Sobrio, sobre fondo oscuro/transparente del header: el
 * idioma activo en coral, el inactivo en crema atenuado. Cada opción es un
 * button real con aria-label + aria-pressed.
 */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Idioma / Language"
      className={`inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide ${className}`}
    >
      {LANGS.map((l, i) => (
        <span key={l.code} className="inline-flex items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden className="text-pimenton-bg/30">
              /
            </span>
          )}
          <button
            type="button"
            onClick={() => setLang(l.code)}
            aria-pressed={lang === l.code}
            aria-label={l.aria}
            className={`cursor-pointer transition-colors duration-200 ${
              lang === l.code
                ? "text-pimenton-accent"
                : "text-pimenton-bg/55 hover:text-pimenton-bg/85"
            }`}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  );
}
