/**
 * Data layer de Casos de Éxito. Una sola fuente de verdad: el hub (/casos)
 * y la template dinámica (/casos/[slug]) se renderizan desde acá. Para sumar
 * un caso nuevo, agregá un objeto a `casos` — sin tocar componentes.
 *
 * El contenido es español neutro (data, no UI). Las etiquetas reutilizables
 * de la UI (headings de sección, CTA, etc.) viven en copy.ts (casos.*) con
 * estructura .es/.en para traducción futura.
 *
 * Métricas, contexto, approach y conclusión vienen del material de Pimentón.
 * Las imágenes de hero son PLACEHOLDERS por categoría (swap directo en la
 * misma ruta cuando lleguen las reales). Logos: los que existen en
 * /public/assets/clientes; el resto cae al nombre de la marca (logo: null).
 */

export interface Metrica {
  /** Valor destacado, ej "+30%", "6.000 → 11.000", "3 meses" */
  valor: string;
  /** Etiqueta bajo el valor, ej "en ventas" */
  label: string;
}

export interface Estrategia {
  /** Título opcional (cuando la estrategia lo amerita) */
  titulo?: string;
  descripcion: string;
}

export interface Caso {
  slug: string;
  marca: string;
  /** Frase de resultado principal */
  tagline: string;
  /** Path al logo de la marca, o null si no hay (fallback al nombre) */
  logo: string | null;
  categoria: string;
  pais: string;
  /** Emoji de bandera */
  bandera: string;
  /** Foto del local/producto en el hero del caso */
  heroImage: string;
  /** "El Desafío" */
  contexto: string;
  /** Exactamente 3 métricas destacadas */
  metricas: Metrica[];
  /** "Qué hicimos" — estrategias aplicadas */
  approach: Estrategia[];
  /** Conclusión estratégica (el remate / insight) */
  conclusion: string;
  /** Desglose para casos multi-sucursal / multimarca (opcional) */
  resultadosDetalle?: string[];
}

export const casos: Caso[] = [
  {
    slug: "lima-sushi",
    marca: "Lima Sushi",
    tagline: "+30% en ventas y +8 puntos de rentabilidad en 3 meses",
    logo: null,
    categoria: "Sushi",
    pais: "Perú",
    bandera: "🇵🇪",
    // TODO: imagen real pendiente (placeholder por categoría: sushi)
    heroImage: "/assets/casos/lima-sushi/hero.jpg",
    contexto:
      "Producto excelente y operación sólida, pero con un crecimiento estancado. Necesitaban generar más tráfico, captar nuevos usuarios y mejorar la rentabilidad del canal digital.",
    metricas: [
      { valor: "+30%", label: "en ventas" },
      { valor: "+8 pts", label: "de rentabilidad (63% → 71%)" },
      { valor: "3 meses", label: "para lograrlo" },
    ],
    approach: [
      { descripcion: "Optimizamos la estrategia de promociones." },
      { descripcion: "Pusimos foco en la adquisición de nuevos usuarios." },
      {
        descripcion:
          "Negociamos directamente con Uber Eats para co-financiar campañas y reducir comisiones.",
      },
    ],
    conclusion:
      "Cuando el producto es bueno, el crecimiento a escala depende de la estrategia. Ordenando las promociones y negociando con las plataformas, el impacto es inmediato.",
  },
  {
    slug: "roma-del-abasto",
    marca: "Roma del Abasto",
    tagline:
      "De tráfico estancado a un +200% de crecimiento en ventas digitales",
    logo: null,
    categoria: "Pizza y cocina porteña",
    pais: "Argentina",
    bandera: "🇦🇷",
    // TODO: imagen real pendiente (placeholder por categoría: pizza)
    heroImage: "/assets/casos/roma-del-abasto/hero.jpg",
    contexto:
      "Clientela fiel pero incapacidad de atraer nuevos consumidores debido a la falta total de estrategias de ads y promociones dentro de las aplicaciones, lo que reducía drásticamente su visibilidad diaria.",
    metricas: [
      { valor: "+200%", label: "crecimiento en ventas (YoY)" },
      { valor: "4 meses", label: "de trabajo" },
      { valor: "0 → full", label: "de cero a estrategia completa de ads" },
    ],
    approach: [
      {
        descripcion:
          "Implementamos campañas publicitarias estratégicas en cada aplicación de delivery.",
      },
      {
        descripcion:
          "Diseñamos promociones quirúrgicas orientadas exclusivamente a nuevos clientes.",
      },
    ],
    conclusion:
      "Las campañas de descuentos y ads bien optimizados generan un incremento exponencial en las visitas de la tienda virtual. El impacto en ventas es directo y, si se ejecuta bien, afecta mínimamente a la rentabilidad.",
  },
  {
    slug: "tienda-de-empanadas",
    // TODO: confirmar si es nombre real o anonimizado (Santiago)
    marca: "Tienda de Empanadas",
    tagline:
      "+60% de crecimiento reduciendo la dependencia de descuentos masivos",
    logo: "/assets/clientes/argentina/TIENDA_DE_EMPANADAS_ARG.webp",
    categoria: "Empanadas",
    pais: "Argentina",
    bandera: "🇦🇷",
    // TODO: imagen real pendiente (placeholder por categoría: empanadas)
    heroImage: "/assets/casos/tienda-de-empanadas/hero.jpg",
    contexto:
      "Con más de 70 locales en Buenos Aires, la marca sufría de baja rentabilidad y poca fidelización debido a una dependencia excesiva de los descuentos agresivos para poder vender de manera constante.",
    metricas: [
      { valor: "+60%", label: "de crecimiento (YoY)" },
      { valor: "70+", label: "locales en Buenos Aires" },
      { valor: "7 meses", label: "de trabajo" },
    ],
    approach: [
      { descripcion: "Redujimos la inversión en descuentos masivos generales." },
      { descripcion: "Redirigimos el presupuesto hacia ads más eficientes." },
      {
        descripcion:
          "Creamos combos estratégicos para aumentar el ticket promedio.",
      },
      { descripcion: "Mejoramos la ingeniería del menú." },
    ],
    conclusion:
      "No todo el crecimiento debe venir de los descuentos masivos. Con una correcta ejecución en anuncios y optimización de menú, se puede crecer más gastando mejor.",
  },
  {
    slug: "la-piccola-italia",
    marca: "La Piccola Italia",
    tagline: "Escala y expansión multimarket: +83% de crecimiento en órdenes",
    logo: "/assets/clientes/chile/LA_PICCOLA_ITALIANA_CHILE.webp",
    categoria: "Italiana / Pastas",
    pais: "Chile",
    bandera: "🇨🇱",
    // TODO: imagen real pendiente (placeholder por categoría: pastas)
    heroImage: "/assets/casos/la-piccola-italia/hero.jpg",
    contexto:
      "Producto sólido y alta recurrencia de clientes, pero crecimiento estancado. Operaban únicamente con Uber Eats manteniendo un flujo plano de entre 5.000 y 6.000 órdenes mensuales. El reto era lograr escala sin perder calidad operativa.",
    metricas: [
      { valor: "+83%", label: "en órdenes" },
      { valor: "6.000 → 11.000", label: "órdenes mensuales" },
      { valor: "4 meses", label: "de noviembre a marzo" },
    ],
    approach: [
      {
        descripcion:
          "Diseñamos una estrategia agresiva de captación de nuevos usuarios con promociones de prueba.",
      },
      {
        descripcion:
          "Implementamos seguimiento de recompra para validar la fidelización.",
      },
      { descripcion: "Aperturamos PedidosYa como nuevo canal." },
      {
        descripcion:
          "Cerramos una estrategia de lanzamiento con alta visibilidad dentro de la plataforma.",
      },
    ],
    conclusion:
      "Para productos validados, el desafío no es el producto, sino la escala. A través de una estrategia agresiva de adquisición y diversificación de canales, se maximiza el flujo. Aunque se sacrifique temporalmente una fracción de contribución marginal, el incremento en volumen genera un negocio mucho más grande y sólido.",
  },
  {
    slug: "la-birra-bar",
    marca: "La Birra Bar",
    tagline: "Incremento de hasta +77% en ganancia neta en EE.UU.",
    logo: "/assets/clientes/usa/LA_BIRRA_BAR_USA.webp",
    categoria: "Burgers",
    pais: "Estados Unidos",
    bandera: "🇺🇸",
    // TODO: imagen real pendiente (placeholder por categoría: burgers)
    heroImage: "/assets/casos/la-birra-bar/hero.jpg",
    contexto:
      "Tras desembarcar en Estados Unidos, la marca necesitaba consolidar su operación digital antes de acelerar. El reto inicial fue sanear los indicadores operativos clave (reducción de tasas de error, resolución de problemas de conectividad, control estricto de cancelaciones y mejora del NPS) para luego escalar agresivamente el volumen de ventas y los márgenes de ganancia.",
    metricas: [
      { valor: "+77%", label: "en ganancia neta (Weston)" },
      { valor: "+88%", label: "en ventas brutas (Wynwood)" },
      { valor: "4 sucursales", label: "optimizadas en Florida" },
    ],
    approach: [
      {
        titulo: "Ingeniería de menú",
        descripcion:
          "Re-estructuración de la oferta digital para priorizar los productos de mayor margen de contribución.",
      },
      {
        titulo: "Pruebas de promociones basadas en datos",
        descripcion:
          "Testeo iterativo de promociones para hallar el punto exacto de conversión sin erosionar el valor de marca.",
      },
      {
        titulo: "Acuerdos de co-financiamiento",
        descripcion:
          "Negociación directa con Uber Eats para co-financiar campañas promocionales, reduciendo el costo de adquisición.",
      },
    ],
    resultadosDetalle: [
      "Weston: +53% en ventas brutas / +77% en ganancia neta",
      "Wynwood: +88% en ventas brutas / +61% en ganancia neta",
      "Fort Lauderdale: +23% en ventas brutas / +41% en ganancia neta",
      "North Miami: +52% en ventas brutas / +31% en ganancia neta",
    ],
    conclusion:
      "Un delivery saludable no solo vende más, vende mejor. Al corregir primero las ineficiencias de la operación y luego aplicar promociones inteligentes co-financiadas por la plataforma, demostramos que es posible incrementar la facturación bruta y, al mismo tiempo, disparar la rentabilidad neta real en un mercado de alta competencia.",
  },
  {
    slug: "grupo-pekin",
    // TODO: confirmar nombre real y país (Santiago) — venía sin confirmar
    marca: "Grupo Gastronómico Pekín",
    tagline: "Máxima rentabilidad gestionando 3 marcas y 9 puntos de venta",
    logo: null,
    categoria: "Grupo multimarca (3 marcas, 9 puntos de venta)",
    // TODO: confirmar país
    pais: "",
    bandera: "",
    // TODO: imagen real pendiente (placeholder por categoría: restaurante)
    heroImage: "/assets/casos/grupo-pekin/hero.jpg",
    contexto:
      "Tomamos la operación de un holding gastronómico con un portafolio de marcas muy diversas y desafíos opuestos en sus canales digitales: una marca de sushi premium (con restricción de promociones para proteger su posicionamiento), un bistró latinoamericano (nicho hiper-competitivo con historial de promociones mal ejecutadas) y un restaurante de cocina peruana (ticket alto pero volumen plano).",
    metricas: [
      { valor: "3 marcas", label: "gestionadas en simultáneo" },
      { valor: "9", label: "puntos de venta" },
      { valor: "+90%", label: "en órdenes (bistró latinoamericano)" },
    ],
    approach: [
      {
        titulo: "Ingeniería de menú basada en datos",
        descripcion:
          "Análisis profundo para potenciar la venta de los productos más rentables, combos estratégicos y upselling digital.",
      },
      {
        titulo: "Iteración rápida de campañas",
        descripcion: "Ciclos ágiles de prueba y optimización en tiempo real.",
      },
      {
        titulo: "Segmentación avanzada de ads",
        descripcion:
          "Para el sushi premium, eliminamos las rebajas de platos y enfocamos el presupuesto en segmentación quirúrgica de anuncios en Uber Eats.",
      },
      {
        titulo: "Alianzas con la plataforma",
        descripcion:
          "Negociamos esquemas de co-financiamiento para el bistró y la marca peruana.",
      },
    ],
    resultadosDetalle: [
      "Bistró Latinoamericano: +68% ventas / +90% órdenes / +41% ganancia neta",
      "Cocina Peruana: +31% ventas / +31% órdenes / +32% ganancia neta",
      "Sushi Premium: +9% ventas / +2% órdenes / +17% ganancia neta (sin un solo descuento)",
    ],
    conclusion:
      "Los grupos multi-marca no pueden usar una estrategia de delivery genérica. La clave está en entender la identidad de cada marca: mientras un formato masivo se beneficia de promociones dinámicas y co-financiamientos, una marca premium incrementa su rentabilidad neta optimizando la visibilidad de sus anuncios y la arquitectura de su menú digital.",
  },
];

/** Devuelve un caso por slug (o undefined si no existe). */
export function getCaso(slug: string): Caso | undefined {
  return casos.find((c) => c.slug === slug);
}

/** Otros casos (para navegación cruzada), excluyendo el actual. */
export function getOtrosCasos(slug: string, limit = 3): Caso[] {
  return casos.filter((c) => c.slug !== slug).slice(0, limit);
}
