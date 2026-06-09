/**
 * Los 4 pasos del proceso de Pimentón (página /como-lo-hacemos).
 * `icon` es un slot opcional: si en una iteración futura Santiago sube
 * iconografía custom por paso, se agrega el path acá y el componente la
 * renderiza. Por ahora cada paso usa el número en círculo + corner bracket.
 */

export type Paso = {
  num: string;
  title: string;
  description: string;
  /** Frase destacada en coral, debajo de la descripción. */
  highlight: string;
  /** Slot opcional para iconografía custom futura (ruta a un SVG). */
  icon?: string;
};

export const pasos: Paso[] = [
  {
    num: "01",
    title: "Analizamos",
    description: "Entendemos tu negocio y detectamos oportunidades clave.",
    highlight: "Somos expertos en APPs de delivery.",
  },
  {
    num: "02",
    title: "Diagnosticamos",
    description:
      "Estudiamos tu restaurante y cada métrica para hacer crecer tus ventas.",
    highlight:
      "Tenemos herramientas, tecnología y un equipo de Data especializado.",
  },
  {
    num: "03",
    title: "Operamos",
    description: "Operamos tu delivery, llevamos la relación con las APPs.",
    highlight: "Un Growth Manager estará a cargo de tu negocio.",
  },
  {
    num: "04",
    title: "Optimizamos",
    description: "Ajustamos las variables que impactan en tus ventas.",
    highlight:
      "Trabajamos en la visibilidad, facturación, ticket promedio, conversión y recompra.",
  },
];
