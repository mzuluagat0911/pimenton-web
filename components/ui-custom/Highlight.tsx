import type { ReactNode } from "react";

export type HighlightColor = "coral" | "mint" | "yellow" | "dark";

// Color de texto por contraste sobre cada fondo de resaltado:
// coral → crema; menta/amarillo → oscuro; dark → crema (para resaltar
// sobre fondos coral, donde el coral sobre coral sería invisible).
const STYLES: Record<HighlightColor, string> = {
  coral: "bg-pimenton-accent text-pimenton-bg",
  mint: "bg-pimenton-mint text-pimenton-text",
  yellow: "bg-pimenton-yellow text-pimenton-text",
  dark: "bg-pimenton-dark text-pimenton-bg",
};

/**
 * Resaltado estilo marcador (sin border-radius) en colores de la paleta
 * Pimentón. box-decoration-clone hace que, si el texto resaltado envuelve
 * a varias líneas, cada línea conserve su fondo + padding. El padding es
 * horizontal en em para escalar con el tamaño del heading.
 */
export function Highlight({
  color,
  children,
  className = "",
}: {
  color: HighlightColor;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`box-decoration-clone px-[0.2em] ${STYLES[color]} ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * Parte un string alrededor de la primera ocurrencia de `segment` y
 * envuelve esa parte en <Highlight>. Devuelve el texto sin cambios si no
 * encuentra el segmento (no rompe el render).
 */
export function splitHighlight(
  text: string,
  segment: string,
  color: HighlightColor,
  className?: string,
): ReactNode {
  const i = text.indexOf(segment);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <Highlight color={color} className={className}>
        {segment}
      </Highlight>
      {text.slice(i + segment.length)}
    </>
  );
}
