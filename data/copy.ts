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
  whereWeOperate: {
    eyebrow: "Presencia global",
    heading: "Operamos delivery en +12 países.",
    subheading:
      "De LATAM a Europa, gestionamos el canal digital de restaurantes en todo el mundo.",
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
    heading: "El delivery ya no es un extra.\nEs un negocio en sí mismo.",
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
  comparison: {
    eyebrow: "El antes y el después",
    heading: "Tu delivery cambia cuando alguien lo opera en serio.",
    off: {
      title: "Sin Pimentón",
      badge: "Canal sin gestión profesional",
      footer: "A ciegas",
    },
    on: {
      title: "Con Pimentón",
      badge: "Delivery como unidad de negocio rentable",
      footer: "Con datos reales",
    },
    footerLabel: "Decisiones de canal",
    activate: "Activar Pimentón en mi Delivery",
    activated: "Desactivar Pimentón",
    items: [
      {
        off: "Sin datos reales: tomás decisiones a ciegas sobre precios, promos y horarios.",
        on: "Dashboard en tiempo real con ventas, margen, ticket y promos en un mismo lugar.",
      },
      {
        off: "Las apps te cobran más comisión de lo que deberían. Nadie negocia por vos.",
        on: "Un Growth Manager a cargo de tu cuenta. Operamos el canal todos los días.",
      },
      {
        off: "Promociones mal configuradas que destruyen tu margen en vez de subirlo.",
        on: "Optimización continua de precios, promos y horarios basada en datos reales.",
      },
      {
        off: "Bajo ranking en las apps = menos visibilidad = menos pedidos.",
        on: "Mejor ranking en las apps: entendemos sus reglas y palancas comerciales.",
      },
      {
        off: "Errores y reclamos sin gestionar: plata que se va sin que te des cuenta.",
        on: "Gestión activa de errores y reclamos. Recuperamos dinero que hoy estás perdiendo.",
      },
      {
        off: "Ticket promedio estancado. Ningún trabajo en combos, menú o recompra.",
        on: "Trabajo activo en ticket promedio, combos y recompra para subir la facturación.",
      },
      {
        off: "El canal digital te roba tiempo y foco del negocio principal.",
        on: "Vos te enfocás en cocinar. Nosotros nos encargamos del resto.",
      },
    ],
  },
  servicesTeaser: {},
  services: {
    eyebrow: "Nuestros servicios",
    heading: "Una unidad de negocio completa, no un servicio más.",
    cta: { label: "Contáctanos", href: "#contacto" },
    items: [
      {
        num: "01",
        name: "Gestión Integral",
        description:
          "Nos hacemos cargo del Delivery de punta a punta: equipo, análisis, estrategia, ejecución y seguimiento diario. Con foco en crecimiento y rentabilidad.",
        image: "/assets/services/service_gestion-integral.webp",
      },
      {
        num: "02",
        name: "Consultoría",
        description:
          "Trabajamos proyectos a medida en base a las necesidades de tu Restaurante, definiendo objetivos claros y metodologías ágiles.",
        image: "/assets/services/service_consultoria.webp",
      },
      {
        num: "03",
        name: "Performance",
        description:
          "Optimizamos lo que más impacta en tus ventas: visibilidad, conversión, ticket promedio y recompra. Ajustes constantes, decisiones rápidas.",
        image: "/assets/services/service_performance.webp",
      },
      {
        num: "04",
        name: "Estrategia",
        description:
          "Definimos en conjunto la combinación perfecta entre operaciones, marketing, procesos y rentabilidad que se ajuste a tu negocio.",
        image: "/assets/services/service_estrategia.webp",
      },
      {
        num: "05",
        name: "Tecnología",
        description:
          "Utilizamos data de las Food Apps y canales digitales para disponer en tiempo real de toda la información que tu Restaurante necesita para la toma de decisiones.",
        image: "/assets/services/service_tecnologia.webp",
      },
    ],
  },
  successStories: {},
  ctaFinal: {},
  footer: {},
} as const;

export type Copy = typeof copy;
