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
  stats: {
    eyebrow: "Los números hablan",
    heading: "La escala de operar en serio.",
    items: [
      { value: 500, prefix: "+", suffix: "", label: "Restaurantes confían en nosotros" },
      { value: 12, prefix: "+", suffix: "", label: "Países en LATAM y Europa" },
      { value: 30, prefix: "~", suffix: "%", label: "Crecimiento en ventas los primeros 3 meses" },
      { value: 6, prefix: "+", suffix: "M", label: "Pedidos gestionados por año" },
    ],
  },
  controlRoom: {
    eyebrow: "Nuestra tecnología",
    heading: "Control Room ®",
    subheading: "Tu delivery operado desde una sola pantalla.",
  },
  marketStats: {
    eyebrow: "Por qué profesionalizar tu delivery",
    heading: "El delivery ya no es un extra. Es un negocio en sí mismo.",
    items: [
      {
        stat: "1 pedido por semana",
        label: "Gen Z y Millennials piden delivery al menos una vez por semana",
        icon: "pedido-semana",
      },
      {
        stat: "+40-50%",
        label: "Incremento de facturación combinando delivery y canales digitales",
        icon: "facturacion",
      },
      {
        stat: "8 de cada 10",
        label: "Personas leen reseñas y miran tu calificación antes de pedirte",
        icon: "personas",
      },
      {
        stat: "+1M",
        label: "De impresiones: tu restaurante genera visibilidad en las apps",
        icon: "impresiones",
      },
    ],
  },
  comparison: {},
  servicesTeaser: {},
  successStories: {},
  ctaFinal: {},
  footer: {},
} as const;

export type Copy = typeof copy;
