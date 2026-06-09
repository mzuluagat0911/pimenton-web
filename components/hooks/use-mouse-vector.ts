"use client";

import { RefObject, useEffect, useState } from "react";

/**
 * Trackea la posición del mouse/touch (relativa a un contenedor opcional)
 * y el vector de movimiento entre frames. Escucha en window, así que
 * funciona aunque el puntero salga del contenedor.
 *
 * Fuente: danielpetho/use-mouse-vector (21st.dev). Tipos ajustados para
 * React 19 (los refs admiten null).
 */
export const useMouseVector = (
  containerRef?: RefObject<HTMLElement | SVGElement | null>,
) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [vector, setVector] = useState({ dx: 0, dy: 0 });

  useEffect(() => {
    let lastPosition = { x: 0, y: 0 };

    const updatePosition = (x: number, y: number) => {
      let newX: number, newY: number;

      if (containerRef && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        newX = x - rect.left;
        newY = y - rect.top;
      } else {
        newX = x;
        newY = y;
      }

      const dx = newX - lastPosition.x;
      const dy = newY - lastPosition.y;

      setVector({ dx, dy });
      setPosition({ x: newX, y: newY });
      lastPosition = { x: newX, y: newY };
    };

    const handleMouseMove = (ev: MouseEvent) => {
      updatePosition(ev.clientX, ev.clientY);
    };

    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (touch) updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [containerRef]);

  return { position, vector };
};
