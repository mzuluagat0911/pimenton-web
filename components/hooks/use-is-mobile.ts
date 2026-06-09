"use client";

import { useEffect, useState } from "react";

/**
 * Detecta si el viewport es menor a `breakpoint` (default 768px).
 *
 * Devuelve `null` durante SSR y el primer render (aún no se conoce el
 * viewport) — quien lo consuma puede usar ese estado para NO renderizar
 * nada dependiente del viewport hasta saberlo (p. ej. no setear el `src`
 * de un video y así no descargar la variante equivocada).
 *
 * Escucha cambios de matchMedia (resize / rotación de dispositivo).
 */
export function useIsMobile(breakpoint = 768): boolean | null {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}
