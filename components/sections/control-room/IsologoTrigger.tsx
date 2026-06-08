"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { ArrowRight, X } from "lucide-react";
import { CenterIsologo } from "./CenterIsologo";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Tiempo entre que la sección entra en viewport y aparece el hint.
const HINT_DELAY = 2500;

// PLACEHOLDER PATH — cuando Pimentón mande el clip real, dropear el
// archivo en este path manteniendo el nombre. El componente lo
// consume directo sin re-deploy de código.
const VIDEO_SRC = "/assets/video/control-room-preview.mp4";
// Poster fallback: dashboard analytics image que ya está en
// /public/assets/gallery/. Si el .mp4 todavía no fue dropeado, el
// browser muestra el poster (no rompe el modal). Cuando esté el .mp4
// real, este poster sigue funcionando como primer frame mientras carga.
const VIDEO_POSTER = "/assets/gallery/dashboard-analisis.webp";

type Props = {
  className?: string;
  glowInset?: string;
};

/**
 * Wrapper interactivo del isologo central del Control Room.
 *
 * - Click (mismo comportamiento en todos los dispositivos) abre un
 *   modal con un video que muestra Pimentón en acción. NO se abre por
 *   hover — el hover sólo aporta affordance visual (scale + glow).
 * - Microcopy "Ver en acción →" como affordance pasiva — aparece
 *   ~2.5s después que la sección entra en viewport, y se oculta en
 *   cuanto el usuario interactúa por primera vez.
 * - Scroll del body se bloquea mientras el modal está abierto,
 *   compatible con Lenis (window.__lenis.stop()/start()).
 * - Respeta toda la animación interna de <CenterIsologo> (latido,
 *   glow base, descargas) — sólo agrega capas encima.
 */
export function IsologoTrigger({ className = "", glowInset = "-60%" }: Props) {
  const reduced = useReducedMotion() ?? false;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapperRef, { once: true, amount: 0.3 });

  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Hint visible 2.5s después que entra la sección, siempre que el
  // usuario no haya interactuado todavía.
  useEffect(() => {
    if (!inView || hasInteracted) return;
    const t = setTimeout(() => {
      if (!hasInteracted) setHintVisible(true);
    }, HINT_DELAY);
    return () => clearTimeout(t);
  }, [inView, hasInteracted]);

  const markInteracted = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setHintVisible(false);
    }
  };

  // Hover handlers — sólo para affordance visual (scale + glow extra
  // + ocultar el hint). NO abren el modal: eso es exclusivo del click.
  const handleEnter = () => {
    setHovered(true);
    markInteracted();
  };

  const handleLeave = () => {
    setHovered(false);
  };

  // Click — único disparador del modal en todos los dispositivos.
  const handleClick = () => {
    markInteracted();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={`${className} relative aspect-square`}
    >
      <motion.button
        type="button"
        aria-label="Ver Control Room en acción"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={handleClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        whileHover={reduced ? undefined : { scale: 1.04 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="group relative block size-full cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-pimenton-accent focus-visible:ring-offset-4 focus-visible:ring-offset-pimenton-dark"
      >
        {/* Glow extra coral que se intensifica con hover/open. Se
            apila SOBRE el glow base de CenterIsologo, no lo reemplaza.
            Reforzá el "se va a abrir algo" sin tocar el latido. */}
        {!reduced && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-[-40%] rounded-full bg-pimenton-accent/40 blur-3xl"
            animate={{
              opacity: hovered || open ? 0.6 : 0,
              scale: hovered || open ? 1.12 : 1,
            }}
            transition={{ duration: 0.35, ease: EASE }}
          />
        )}
        <CenterIsologo className="size-full" glowInset={glowInset} />
      </motion.button>

      {/* Microcopy hint debajo del pimiento. Position absolute para no
          desplazar el layout del grid de órbitas. */}
      <AnimatePresence>
        {hintVisible && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={
              reduced
                ? { opacity: 0.9, y: 0 }
                : { opacity: 0.9, y: [0, -3, 0] }
            }
            exit={{ opacity: 0, y: -6 }}
            transition={
              reduced
                ? { opacity: { duration: 0.4 } }
                : {
                    opacity: { duration: 0.4 },
                    y: {
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }
            }
            className="pointer-events-none absolute left-1/2 top-full mt-6 -translate-x-1/2 whitespace-nowrap"
          >
            <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-pimenton-accent sm:text-sm">
              Ver en acción
              <ArrowRight aria-hidden className="size-3.5" />
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <VideoModal
        open={open}
        onClose={handleClose}
        videoRef={videoRef}
        reduced={reduced}
      />
    </div>
  );
}

function VideoModal({
  open,
  onClose,
  videoRef,
  reduced,
}: {
  open: boolean;
  onClose: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  reduced: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll lock — Lenis.stop() pausa el RAF loop del smooth scroll
  // (lo que pausa ScrollTrigger del Control Room en consecuencia,
  // las órbitas no rotan). body.overflow:hidden bloquea el scroll
  // nativo por si Lenis no está activo (reduced motion / SSR).
  useEffect(() => {
    if (!open) return;
    const lenis =
      typeof window !== "undefined" ? window.__lenis : undefined;
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // ESC cierra.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Play/pause según open. Al abrir reseteamos a 0 para que el clip
  // arranque desde el inicio cada vez (el video es corto y en loop,
  // empezar siempre desde 0 hace que el primer frame sea predecible).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (open) {
      try {
        v.currentTime = 0;
      } catch {
        // ignore — algunos browsers throw si el video no terminó de
        // metadata-load; no es crítico.
      }
      v.play().catch(() => {
        // autoplay puede ser bloqueado por el browser; ya tenemos
        // muted=true en el elemento, debería pasar. Silenciamos por
        // las dudas para no spamear la consola.
      });
    } else {
      v.pause();
    }
  }, [open, videoRef]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.18 : 0.25, ease: EASE }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
        >
          {/* Backdrop como button para que sea focuseable y semántico. */}
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-pimenton-dark/65 backdrop-blur-sm outline-none"
          />

          {/* Panel del modal — el modal se cierra con X, backdrop o
              ESC. No reacciona al mouse (es click-only). */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Control Room en acción"
            initial={
              reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }
            }
            animate={
              reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }
            }
            exit={
              reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }
            }
            transition={{ duration: reduced ? 0.18 : 0.3, ease: EASE }}
            className="relative z-10 w-full max-w-[600px] overflow-hidden rounded-2xl border border-pimenton-dark-border bg-pimenton-dark shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
          >
            {/* Botón cerrar — siempre visible (no sólo mobile) por
                accesibilidad y como salida de teclado complementaria
                al ESC. */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="absolute right-3 top-3 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full bg-pimenton-dark/70 text-pimenton-text-on-dark backdrop-blur-sm outline-none transition-all hover:scale-105 hover:bg-pimenton-dark/90 focus-visible:ring-2 focus-visible:ring-pimenton-accent sm:right-4 sm:top-4"
            >
              <X className="size-5" />
            </button>

            <video
              ref={videoRef}
              src={VIDEO_SRC}
              poster={VIDEO_POSTER}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="block aspect-video w-full object-cover"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
