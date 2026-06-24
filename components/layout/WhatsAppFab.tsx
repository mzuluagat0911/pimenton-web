"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { whatsappRegions, whatsappUrl } from "@/data/whatsapp";
import { useCopy, useT } from "@/components/i18n/LanguageContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function CloseGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M6 6l12 12M18 6l-12 12" />
    </svg>
  );
}

export function WhatsAppFab() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion() ?? false;
  const wa = useCopy().whatsapp;
  const t = useT();

  const fabRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // Defer mount animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 700);
    return () => clearTimeout(t);
  }, []);

  // Permite abrir el selector de región desde afuera (p. ej. el CTA
  // "Hablar con un especialista" del hero) vía evento global.
  useEffect(() => {
    const openFromEvent = () => setOpen(true);
    window.addEventListener("pimenton:open-whatsapp", openFromEvent);
    return () =>
      window.removeEventListener("pimenton:open-whatsapp", openFromEvent);
  }, []);

  // ESC + focus trap dentro del panel
  useEffect(() => {
    if (!open) return;

    // Foco al primer option después de la animación de entrada
    const focusTimer = setTimeout(() => {
      optionsRef.current[0]?.focus();
    }, 160);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        // Devolver foco al FAB para no perderlo
        fabRef.current?.focus();
        return;
      }
      if (e.key === "Tab") {
        const items = optionsRef.current.filter(Boolean) as HTMLElement[];
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
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
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Click afuera cierra (pointerdown global). El FAB también lo capturamos
  // para que su propio click no dispare un cierre redundante.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current?.contains(target) ||
        fabRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const handleOptionClick = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <motion.button
        ref={fabRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="wa-region-panel"
        aria-label={open ? wa.fabClose : wa.fabOpen}
        initial={{ opacity: 0, scale: 0.6, y: 12 }}
        animate={
          mounted
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 0, scale: 0.6, y: 12 }
        }
        transition={{ duration: 0.5, ease: EASE }}
        whileHover={reduced ? undefined : { scale: 1.08 }}
        whileTap={reduced ? undefined : { scale: 0.94 }}
        className="fixed bottom-6 right-6 z-30 flex size-[70px] cursor-pointer items-center justify-center rounded-full bg-pimenton-whatsapp text-pimenton-bg shadow-[0_10px_28px_-6px_rgba(37,211,102,0.5)] outline-none focus-visible:ring-2 focus-visible:ring-pimenton-whatsapp focus-visible:ring-offset-2 focus-visible:ring-offset-pimenton-bg sm:bottom-8 sm:right-8 sm:size-20"
      >
        {/* Halo de pulso — sólo cuando el panel está cerrado, para no
            competir con el contenido del panel. */}
        {!reduced && !open && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-pimenton-whatsapp"
            // Halo "soft": la opacidad entra y sale (0 → pico → 0), así el
            // loop reinicia con el anillo invisible → sin pop brusco.
            animate={{ scale: [1, 1.7], opacity: [0, 0.4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />
        )}

        {/* Swap WA ↔ X con rotación */}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={
                reduced ? { opacity: 0 } : { opacity: 0, rotate: -90 }
              }
              animate={
                reduced ? { opacity: 1 } : { opacity: 1, rotate: 0 }
              }
              exit={reduced ? { opacity: 0 } : { opacity: 0, rotate: 90 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="relative flex items-center justify-center"
            >
              <CloseGlyph className="size-7 sm:size-8" />
            </motion.span>
          ) : (
            <motion.span
              key="wa"
              initial={
                reduced ? { opacity: 0 } : { opacity: 0, rotate: 90 }
              }
              animate={
                reduced ? { opacity: 1 } : { opacity: 1, rotate: 0 }
              }
              exit={reduced ? { opacity: 0 } : { opacity: 0, rotate: -90 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="relative flex items-center justify-center"
            >
              <WhatsAppGlyph className="size-7 sm:size-8" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="wa-region-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wa-panel-title"
            initial={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.92, y: 12 }
            }
            animate={
              reduced
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.92, y: 12 }
            }
            transition={{ duration: reduced ? 0.18 : 0.28, ease: EASE }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed bottom-24 right-6 z-30 w-[min(calc(100vw-3rem),22rem)] rounded-2xl border border-pimenton-border bg-pimenton-surface p-4 shadow-[0_24px_60px_-20px_rgba(15,15,14,0.32)] sm:bottom-28 sm:right-8 sm:p-5"
          >
            <div className="px-1 pt-1">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-pimenton-accent">
                {wa.panelKicker}
              </p>
              <h3
                id="wa-panel-title"
                className="mt-1.5 font-display text-lg font-semibold text-pimenton-text sm:text-xl"
              >
                {wa.panelTitle}
              </h3>
            </div>

            <ul className="mt-4 space-y-1">
              {whatsappRegions.map((r, i) => (
                <li key={r.id}>
                  <a
                    ref={(el) => {
                      optionsRef.current[i] = el;
                    }}
                    href={whatsappUrl(r)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleOptionClick}
                    aria-label={`${wa.optionAria} ${t(r.title)} — ${t(r.subtitle)}`}
                    className="group flex items-center gap-3 rounded-xl p-3 outline-none transition-colors duration-200 hover:bg-pimenton-bg-soft focus-visible:bg-pimenton-bg-soft focus-visible:ring-2 focus-visible:ring-pimenton-accent"
                  >
                    <span
                      aria-hidden
                      className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-pimenton-accent/15 text-pimenton-accent transition-colors duration-200 group-hover:bg-pimenton-accent group-hover:text-pimenton-bg group-focus-visible:bg-pimenton-accent group-focus-visible:text-pimenton-bg"
                    >
                      <WhatsAppGlyph className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-pimenton-text">
                        {t(r.title)}
                      </p>
                      <p className="text-xs text-pimenton-text-muted sm:text-sm">
                        {t(r.subtitle)}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
