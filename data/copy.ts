export const copy = {
  hero: {
    eyebrow: "Growth Partner · LATAM & Europa",
    headline: "Escalamos tu Delivery y optimizamos tus Canales Digitales.",
    headlineAccent: "Canales Digitales",
    subhead: "Convertimos tu Restaurante en una unidad de negocio rentable.",
    ctaPrimary: { label: "Servicios", href: "#servicios" },
    ctaSecondary: { label: "Contáctanos", href: "#contacto" },
    scrollLabel: "Scroll",
  },
  wall: {},
  stats: {},
  controlRoom: {},
  marketStats: {},
  comparison: {},
  servicesTeaser: {},
  successStories: {},
  ctaFinal: {},
  footer: {},
} as const;

export type Copy = typeof copy;
