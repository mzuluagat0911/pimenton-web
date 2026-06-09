/**
 * Los 4 pasos del proceso de Pimentón (página /como-lo-hacemos).
 *
 * Cada paso se ilustra con un emoji 3D de Microsoft Fluent (PNG en
 * /public/assets/emoji/3d/) — mismo tratamiento que el formulario de
 * consultoría. `fallback` es el emoji Unicode equivalente, que se muestra
 * si el PNG no estuviera disponible.
 */

export type Paso = {
  num: string;
  title: string;
  description: string;
  /** Frase destacada en coral, debajo de la descripción. */
  highlight: string;
  /** Nombre del archivo PNG en /public/assets/emoji/3d/. */
  emoji: string;
  /** Emoji Unicode de fallback. */
  fallback: string;
};

export const pasos: Paso[] = [
  {
    num: "01",
    title: "Analizamos",
    description: "Entendemos tu negocio y detectamos oportunidades clave.",
    highlight: "Somos expertos en APPs de delivery.",
    emoji: "magnifying-glass.png",
    fallback: "🔍",
  },
  {
    num: "02",
    title: "Diagnosticamos",
    description:
      "Estudiamos tu restaurante y cada métrica para hacer crecer tus ventas.",
    highlight:
      "Tenemos herramientas, tecnología y un equipo de Data especializado.",
    emoji: "stethoscope.png",
    fallback: "🩺",
  },
  {
    num: "03",
    title: "Operamos",
    description: "Operamos tu delivery, llevamos la relación con las APPs.",
    highlight: "Un Growth Manager estará a cargo de tu negocio.",
    emoji: "gear.png",
    fallback: "⚙️",
  },
  {
    num: "04",
    title: "Optimizamos",
    description: "Ajustamos las variables que impactan en tus ventas.",
    highlight:
      "Trabajamos en la visibilidad, facturación, ticket promedio, conversión y recompra.",
    emoji: "chart-increasing.png",
    fallback: "📈",
  },
];
