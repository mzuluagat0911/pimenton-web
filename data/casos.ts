/**
 * Data layer de Casos de Éxito. Una sola fuente de verdad: el hub (/casos)
 * y la template dinámica (/casos/[slug]) se renderizan desde acá. Para sumar
 * un caso nuevo, agregá un objeto a `casos` — sin tocar componentes.
 *
 * El contenido es bilingüe {es,en}: español neutro + inglés. Los componentes
 * (client) resuelven el idioma activo con useT(); el server (metadata +
 * JSON-LD) usa .es por SEO. Las etiquetas reutilizables de la UI (headings de
 * sección, CTA, etc.) viven en copy.ts (casos.*).
 *
 * Métricas, contexto, approach y conclusión vienen del material de Pimentón.
 * Las imágenes de hero son PLACEHOLDERS por categoría (swap directo en la
 * misma ruta cuando lleguen las reales). Logos: los que existen en
 * /public/assets/clientes; el resto cae al nombre de la marca (logo: null).
 */

type Localized = { es: string; en: string };

export interface Metrica {
  /** Valor destacado, ej "+30%", "6.000 → 11.000", "3 meses" */
  valor: Localized;
  /** Etiqueta bajo el valor, ej "en ventas" */
  label: Localized;
}

export interface Estrategia {
  /** Título opcional (cuando la estrategia lo amerita) */
  titulo?: Localized;
  descripcion: Localized;
}

export interface Caso {
  slug: string;
  marca: string;
  /** Frase de resultado principal */
  tagline: Localized;
  /** Path al logo de la marca, o null si no hay (fallback al nombre) */
  logo: string | null;
  categoria: Localized;
  pais: Localized;
  /** Emoji de bandera */
  bandera: string;
  /** Foto del local/producto en el hero del caso */
  heroImage: string;
  /** "El Desafío" */
  contexto: Localized;
  /** Exactamente 3 métricas destacadas */
  metricas: Metrica[];
  /** "Qué hicimos" — estrategias aplicadas */
  approach: Estrategia[];
  /** Conclusión estratégica (el remate / insight) */
  conclusion: Localized;
  /** Desglose para casos multi-sucursal / multimarca (opcional) */
  resultadosDetalle?: Localized[];
}

export const casos: Caso[] = [
  {
    slug: "lima-sushi",
    marca: "Lima Sushi",
    tagline: {
      es: "+30% en ventas y +8 puntos de rentabilidad en 3 meses",
      en: "+30% in sales and +8 points of profitability in 3 months",
    },
    logo: null,
    categoria: { es: "Sushi", en: "Sushi" },
    pais: { es: "Perú", en: "Peru" },
    bandera: "🇵🇪",
    // TODO: imagen real pendiente (placeholder por categoría: sushi)
    heroImage: "/assets/casos/lima-sushi/hero.jpg",
    contexto: {
      es: "Producto excelente y operación sólida, pero con un crecimiento estancado. Necesitaban generar más tráfico, captar nuevos usuarios y mejorar la rentabilidad del canal digital.",
      en: "An excellent product and solid operations, but stalled growth. They needed to drive more traffic, attract new users, and improve the profitability of the digital channel.",
    },
    metricas: [
      { valor: { es: "+30%", en: "+30%" }, label: { es: "en ventas", en: "in sales" } },
      {
        valor: { es: "+8 pts", en: "+8 pts" },
        label: { es: "de rentabilidad (63% → 71%)", en: "in profitability (63% → 71%)" },
      },
      {
        valor: { es: "3 meses", en: "3 months" },
        label: { es: "para lograrlo", en: "to achieve it" },
      },
    ],
    approach: [
      {
        descripcion: {
          es: "Optimizamos la estrategia de promociones.",
          en: "We optimized the promotions strategy.",
        },
      },
      {
        descripcion: {
          es: "Pusimos foco en la adquisición de nuevos usuarios.",
          en: "We focused on acquiring new users.",
        },
      },
      {
        descripcion: {
          es: "Negociamos directamente con Uber Eats para co-financiar campañas y reducir comisiones.",
          en: "We negotiated directly with Uber Eats to co-fund campaigns and reduce commissions.",
        },
      },
    ],
    conclusion: {
      es: "Cuando el producto es bueno, el crecimiento a escala depende de la estrategia. Ordenando las promociones y negociando con las plataformas, el impacto es inmediato.",
      en: "When the product is good, scaling growth comes down to strategy. By organizing promotions and negotiating with the platforms, the impact is immediate.",
    },
  },
  {
    slug: "roma-del-abasto",
    marca: "Roma del Abasto",
    tagline: {
      es: "De tráfico estancado a un +200% de crecimiento en ventas digitales",
      en: "From stalled traffic to +200% growth in digital sales",
    },
    logo: null,
    categoria: { es: "Pizza y cocina porteña", en: "Pizza and Buenos Aires cuisine" },
    pais: { es: "Argentina", en: "Argentina" },
    bandera: "🇦🇷",
    // TODO: imagen real pendiente (placeholder por categoría: pizza)
    heroImage: "/assets/casos/roma-del-abasto/hero.jpg",
    contexto: {
      es: "Clientela fiel pero incapacidad de atraer nuevos consumidores debido a la falta total de estrategias de ads y promociones dentro de las aplicaciones, lo que reducía drásticamente su visibilidad diaria.",
      en: "A loyal customer base but an inability to attract new consumers, due to a total lack of ad and promotion strategies within the apps — which drastically reduced their daily visibility.",
    },
    metricas: [
      {
        valor: { es: "+200%", en: "+200%" },
        label: { es: "crecimiento en ventas (YoY)", en: "sales growth (YoY)" },
      },
      {
        valor: { es: "4 meses", en: "4 months" },
        label: { es: "de trabajo", en: "of work" },
      },
      {
        valor: { es: "0 → full", en: "0 → full" },
        label: {
          es: "de cero a estrategia completa de ads",
          en: "from zero to a full ads strategy",
        },
      },
    ],
    approach: [
      {
        descripcion: {
          es: "Implementamos campañas publicitarias estratégicas en cada aplicación de delivery.",
          en: "We rolled out strategic ad campaigns on every delivery app.",
        },
      },
      {
        descripcion: {
          es: "Diseñamos promociones quirúrgicas orientadas exclusivamente a nuevos clientes.",
          en: "We designed surgical promotions aimed exclusively at new customers.",
        },
      },
    ],
    conclusion: {
      es: "Las campañas de descuentos y ads bien optimizados generan un incremento exponencial en las visitas de la tienda virtual. El impacto en ventas es directo y, si se ejecuta bien, afecta mínimamente a la rentabilidad.",
      en: "Well-optimized discount and ad campaigns drive an exponential increase in virtual storefront visits. The impact on sales is direct and, when executed well, barely affects profitability.",
    },
  },
  {
    slug: "tienda-de-empanadas",
    // TODO: confirmar si es nombre real o anonimizado (Santiago)
    marca: "Tienda de Empanadas",
    tagline: {
      es: "+60% de crecimiento reduciendo la dependencia de descuentos masivos",
      en: "+60% growth while reducing dependence on mass discounts",
    },
    logo: "/assets/clientes/argentina/TIENDA_DE_EMPANADAS_ARG.webp",
    categoria: { es: "Empanadas", en: "Empanadas" },
    pais: { es: "Argentina", en: "Argentina" },
    bandera: "🇦🇷",
    // TODO: imagen real pendiente (placeholder por categoría: empanadas)
    heroImage: "/assets/casos/tienda-de-empanadas/hero.jpg",
    contexto: {
      es: "Con más de 70 locales en Buenos Aires, la marca sufría de baja rentabilidad y poca fidelización debido a una dependencia excesiva de los descuentos agresivos para poder vender de manera constante.",
      en: "With more than 70 locations across Buenos Aires, the brand suffered from low profitability and weak loyalty due to an over-reliance on aggressive discounts just to sell consistently.",
    },
    metricas: [
      {
        valor: { es: "+60%", en: "+60%" },
        label: { es: "de crecimiento (YoY)", en: "growth (YoY)" },
      },
      {
        valor: { es: "70+", en: "70+" },
        label: { es: "locales en Buenos Aires", en: "locations in Buenos Aires" },
      },
      {
        valor: { es: "7 meses", en: "7 months" },
        label: { es: "de trabajo", en: "of work" },
      },
    ],
    approach: [
      {
        descripcion: {
          es: "Redujimos la inversión en descuentos masivos generales.",
          en: "We reduced spend on broad mass discounts.",
        },
      },
      {
        descripcion: {
          es: "Redirigimos el presupuesto hacia ads más eficientes.",
          en: "We redirected the budget toward more efficient ads.",
        },
      },
      {
        descripcion: {
          es: "Creamos combos estratégicos para aumentar el ticket promedio.",
          en: "We created strategic combos to raise the average ticket.",
        },
      },
      {
        descripcion: {
          es: "Mejoramos la ingeniería del menú.",
          en: "We improved the menu engineering.",
        },
      },
    ],
    conclusion: {
      es: "No todo el crecimiento debe venir de los descuentos masivos. Con una correcta ejecución en anuncios y optimización de menú, se puede crecer más gastando mejor.",
      en: "Not all growth has to come from mass discounts. With proper ad execution and menu optimization, you can grow more while spending smarter.",
    },
  },
  {
    slug: "la-piccola-italia",
    marca: "La Piccola Italia",
    tagline: {
      es: "Escala y expansión multimarket: +83% de crecimiento en órdenes",
      en: "Scale and multi-market expansion: +83% growth in orders",
    },
    logo: "/assets/clientes/chile/LA_PICCOLA_ITALIANA_CHILE.webp",
    categoria: { es: "Italiana / Pastas", en: "Italian / Pasta" },
    pais: { es: "Chile", en: "Chile" },
    bandera: "🇨🇱",
    // TODO: imagen real pendiente (placeholder por categoría: pastas)
    heroImage: "/assets/casos/la-piccola-italia/hero.jpg",
    contexto: {
      es: "Producto sólido y alta recurrencia de clientes, pero crecimiento estancado. Operaban únicamente con Uber Eats manteniendo un flujo plano de entre 5.000 y 6.000 órdenes mensuales. El reto era lograr escala sin perder calidad operativa.",
      en: "A solid product and a high customer repeat rate, but stalled growth. They operated solely on Uber Eats, holding a flat flow of 5,000 to 6,000 monthly orders. The challenge was to reach scale without losing operational quality.",
    },
    metricas: [
      {
        valor: { es: "+83%", en: "+83%" },
        label: { es: "en órdenes", en: "in orders" },
      },
      {
        valor: { es: "6.000 → 11.000", en: "6,000 → 11,000" },
        label: { es: "órdenes mensuales", en: "monthly orders" },
      },
      {
        valor: { es: "4 meses", en: "4 months" },
        label: { es: "de noviembre a marzo", en: "from November to March" },
      },
    ],
    approach: [
      {
        descripcion: {
          es: "Diseñamos una estrategia agresiva de captación de nuevos usuarios con promociones de prueba.",
          en: "We designed an aggressive new-user acquisition strategy with trial promotions.",
        },
      },
      {
        descripcion: {
          es: "Implementamos seguimiento de recompra para validar la fidelización.",
          en: "We implemented repeat-order tracking to validate loyalty.",
        },
      },
      {
        descripcion: {
          es: "Aperturamos PedidosYa como nuevo canal.",
          en: "We launched PedidosYa as a new channel.",
        },
      },
      {
        descripcion: {
          es: "Cerramos una estrategia de lanzamiento con alta visibilidad dentro de la plataforma.",
          en: "We closed a launch strategy with high visibility inside the platform.",
        },
      },
    ],
    conclusion: {
      es: "Para productos validados, el desafío no es el producto, sino la escala. A través de una estrategia agresiva de adquisición y diversificación de canales, se maximiza el flujo. Aunque se sacrifique temporalmente una fracción de contribución marginal, el incremento en volumen genera un negocio mucho más grande y sólido.",
      en: "For validated products, the challenge isn't the product — it's scale. Through an aggressive acquisition strategy and channel diversification, you maximize flow. Even if you temporarily sacrifice a fraction of marginal contribution, the increase in volume builds a far bigger, stronger business.",
    },
  },
  {
    slug: "la-birra-bar",
    marca: "La Birra Bar",
    tagline: {
      es: "Incremento de hasta +77% en ganancia neta en EE.UU.",
      en: "Up to +77% increase in net profit in the U.S.",
    },
    logo: "/assets/clientes/usa/LA_BIRRA_BAR_USA.webp",
    categoria: { es: "Burgers", en: "Burgers" },
    pais: { es: "Estados Unidos", en: "United States" },
    bandera: "🇺🇸",
    // TODO: imagen real pendiente (placeholder por categoría: burgers)
    heroImage: "/assets/casos/la-birra-bar/hero.jpg",
    contexto: {
      es: "Tras desembarcar en Estados Unidos, la marca necesitaba consolidar su operación digital antes de acelerar. El reto inicial fue sanear los indicadores operativos clave (reducción de tasas de error, resolución de problemas de conectividad, control estricto de cancelaciones y mejora del NPS) para luego escalar agresivamente el volumen de ventas y los márgenes de ganancia.",
      en: "After landing in the United States, the brand needed to consolidate its digital operation before accelerating. The initial challenge was to clean up the key operational indicators (lowering error rates, fixing connectivity issues, tightly controlling cancellations, and improving NPS) and then aggressively scale sales volume and profit margins.",
    },
    metricas: [
      {
        valor: { es: "+77%", en: "+77%" },
        label: { es: "en ganancia neta (Weston)", en: "in net profit (Weston)" },
      },
      {
        valor: { es: "+88%", en: "+88%" },
        label: { es: "en ventas brutas (Wynwood)", en: "in gross sales (Wynwood)" },
      },
      {
        valor: { es: "4 sucursales", en: "4 locations" },
        label: { es: "optimizadas en Florida", en: "optimized in Florida" },
      },
    ],
    approach: [
      {
        titulo: { es: "Ingeniería de menú", en: "Menu engineering" },
        descripcion: {
          es: "Re-estructuración de la oferta digital para priorizar los productos de mayor margen de contribución.",
          en: "Restructuring the digital offering to prioritize the products with the highest contribution margin.",
        },
      },
      {
        titulo: {
          es: "Pruebas de promociones basadas en datos",
          en: "Data-driven promotion testing",
        },
        descripcion: {
          es: "Testeo iterativo de promociones para hallar el punto exacto de conversión sin erosionar el valor de marca.",
          en: "Iterative promotion testing to find the exact conversion sweet spot without eroding brand value.",
        },
      },
      {
        titulo: { es: "Acuerdos de co-financiamiento", en: "Co-funding agreements" },
        descripcion: {
          es: "Negociación directa con Uber Eats para co-financiar campañas promocionales, reduciendo el costo de adquisición.",
          en: "Direct negotiation with Uber Eats to co-fund promotional campaigns, reducing acquisition cost.",
        },
      },
    ],
    resultadosDetalle: [
      {
        es: "Weston: +53% en ventas brutas / +77% en ganancia neta",
        en: "Weston: +53% in gross sales / +77% in net profit",
      },
      {
        es: "Wynwood: +88% en ventas brutas / +61% en ganancia neta",
        en: "Wynwood: +88% in gross sales / +61% in net profit",
      },
      {
        es: "Fort Lauderdale: +23% en ventas brutas / +41% en ganancia neta",
        en: "Fort Lauderdale: +23% in gross sales / +41% in net profit",
      },
      {
        es: "North Miami: +52% en ventas brutas / +31% en ganancia neta",
        en: "North Miami: +52% in gross sales / +31% in net profit",
      },
    ],
    conclusion: {
      es: "Un delivery saludable no solo vende más, vende mejor. Al corregir primero las ineficiencias de la operación y luego aplicar promociones inteligentes co-financiadas por la plataforma, demostramos que es posible incrementar la facturación bruta y, al mismo tiempo, disparar la rentabilidad neta real en un mercado de alta competencia.",
      en: "A healthy delivery operation doesn't just sell more — it sells better. By first fixing operational inefficiencies and then applying smart, platform-co-funded promotions, we proved it's possible to increase gross revenue and, at the same time, drive up real net profitability in a highly competitive market.",
    },
  },
  {
    slug: "grupo-pekin",
    // TODO: confirmar nombre real y país (Santiago) — venía sin confirmar
    marca: "Grupo Gastronómico Pekín",
    tagline: {
      es: "Máxima rentabilidad gestionando 3 marcas y 9 puntos de venta",
      en: "Maximum profitability managing 3 brands and 9 points of sale",
    },
    logo: null,
    categoria: {
      es: "Grupo multimarca (3 marcas, 9 puntos de venta)",
      en: "Multi-brand group (3 brands, 9 points of sale)",
    },
    // TODO: confirmar país
    pais: { es: "", en: "" },
    bandera: "",
    // TODO: imagen real pendiente (placeholder por categoría: restaurante)
    heroImage: "/assets/casos/grupo-pekin/hero.jpg",
    contexto: {
      es: "Tomamos la operación de un holding gastronómico con un portafolio de marcas muy diversas y desafíos opuestos en sus canales digitales: una marca de sushi premium (con restricción de promociones para proteger su posicionamiento), un bistró latinoamericano (nicho hiper-competitivo con historial de promociones mal ejecutadas) y un restaurante de cocina peruana (ticket alto pero volumen plano).",
      en: "We took over the operation of a restaurant holding with a very diverse brand portfolio and opposing challenges across its digital channels: a premium sushi brand (with promotion restrictions to protect its positioning), a Latin American bistro (a hyper-competitive niche with a history of poorly executed promotions), and a Peruvian cuisine restaurant (high ticket but flat volume).",
    },
    metricas: [
      {
        valor: { es: "3 marcas", en: "3 brands" },
        label: { es: "gestionadas en simultáneo", en: "managed simultaneously" },
      },
      {
        valor: { es: "9", en: "9" },
        label: { es: "puntos de venta", en: "points of sale" },
      },
      {
        valor: { es: "+90%", en: "+90%" },
        label: {
          es: "en órdenes (bistró latinoamericano)",
          en: "in orders (Latin American bistro)",
        },
      },
    ],
    approach: [
      {
        titulo: {
          es: "Ingeniería de menú basada en datos",
          en: "Data-driven menu engineering",
        },
        descripcion: {
          es: "Análisis profundo para potenciar la venta de los productos más rentables, combos estratégicos y upselling digital.",
          en: "Deep analysis to boost sales of the most profitable products, plus strategic combos and digital upselling.",
        },
      },
      {
        titulo: { es: "Iteración rápida de campañas", en: "Rapid campaign iteration" },
        descripcion: {
          es: "Ciclos ágiles de prueba y optimización en tiempo real.",
          en: "Agile cycles of testing and real-time optimization.",
        },
      },
      {
        titulo: { es: "Segmentación avanzada de ads", en: "Advanced ad targeting" },
        descripcion: {
          es: "Para el sushi premium, eliminamos las rebajas de platos y enfocamos el presupuesto en segmentación quirúrgica de anuncios en Uber Eats.",
          en: "For the premium sushi brand, we eliminated dish discounts and focused the budget on surgical ad targeting in Uber Eats.",
        },
      },
      {
        titulo: { es: "Alianzas con la plataforma", en: "Platform partnerships" },
        descripcion: {
          es: "Negociamos esquemas de co-financiamiento para el bistró y la marca peruana.",
          en: "We negotiated co-funding schemes for the bistro and the Peruvian brand.",
        },
      },
    ],
    resultadosDetalle: [
      {
        es: "Bistró Latinoamericano: +68% ventas / +90% órdenes / +41% ganancia neta",
        en: "Latin American Bistro: +68% sales / +90% orders / +41% net profit",
      },
      {
        es: "Cocina Peruana: +31% ventas / +31% órdenes / +32% ganancia neta",
        en: "Peruvian Cuisine: +31% sales / +31% orders / +32% net profit",
      },
      {
        es: "Sushi Premium: +9% ventas / +2% órdenes / +17% ganancia neta (sin un solo descuento)",
        en: "Premium Sushi: +9% sales / +2% orders / +17% net profit (without a single discount)",
      },
    ],
    conclusion: {
      es: "Los grupos multi-marca no pueden usar una estrategia de delivery genérica. La clave está en entender la identidad de cada marca: mientras un formato masivo se beneficia de promociones dinámicas y co-financiamientos, una marca premium incrementa su rentabilidad neta optimizando la visibilidad de sus anuncios y la arquitectura de su menú digital.",
      en: "Multi-brand groups can't use a generic delivery strategy. The key is understanding each brand's identity: while a mass-market format benefits from dynamic promotions and co-funding, a premium brand increases its net profitability by optimizing ad visibility and the architecture of its digital menu.",
    },
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
