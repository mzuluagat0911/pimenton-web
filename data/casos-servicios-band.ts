/**
 * Casos para la mini-banda de resultados de /servicios.
 *
 * TODO: reemplazar con métricas reales cuando Pimentón mande números por
 * cliente. Los valores actuales son PROVISORIOS — están dentro del rango
 * que Pimentón comunica públicamente (+30 a +50% en ventas, +18 a +25% en
 * rentabilidad) pero NO son métricas verificadas por cliente. No publicar
 * como dato cerrado hasta confirmar con el equipo.
 *
 * Los logos sí son reales (clientes existentes en /public/assets/clientes).
 */

export type Caso = {
  name: string;
  logo: string;
  country: string;
  /** Bandera nativa emoji */
  flag: string;
  /** Métrica destacada (gigante, coral) */
  metric: string;
  metricLabel: string;
  context: string;
};

export const casos: Caso[] = [
  {
    name: "Antiche",
    logo: "/assets/clientes/argentina/ANTICHE_ARG.webp",
    country: "Argentina",
    flag: "🇦🇷",
    metric: "+42%",
    metricLabel: "en ventas mensuales",
    context: "Optimización integral de Foodapps en 3 sucursales · Buenos Aires.",
  },
  {
    name: "Almíbar",
    logo: "/assets/clientes/españa/ALMIBAR_ESPAÑA.webp",
    country: "España",
    flag: "🇪🇸",
    metric: "+23%",
    metricLabel: "en rentabilidad",
    context: "Estrategia de precios y promos basada en datos · Madrid.",
  },
  {
    name: "Baldoria",
    logo: "/assets/clientes/mexico/BALDORIA_MEXICO.webp",
    country: "México",
    flag: "🇲🇽",
    metric: "+38%",
    metricLabel: "en pedidos mensuales",
    context: "Mejora de visibilidad y ranking en Foodapps · CDMX.",
  },
  {
    name: "Barbazul",
    logo: "/assets/clientes/chile/BARBAZUL_CHILE.webp",
    country: "Chile",
    flag: "🇨🇱",
    metric: "+19%",
    metricLabel: "en ticket promedio",
    context: "Trabajo en combos, menú y recompra · Santiago.",
  },
];
