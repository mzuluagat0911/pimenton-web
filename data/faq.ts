/**
 * Preguntas frecuentes (página /faq). Copy en español neutro (sin voseo).
 * Editá / reordená acá: el acordeón y el JSON-LD FAQPage se generan desde
 * este array.
 */

export type Faq = {
  pregunta: string;
  respuesta: string;
};

export const faqs: Faq[] = [
  {
    pregunta:
      "¿Trabajan solo con grandes cadenas o también con restaurantes independientes?",
    respuesta:
      "Trabajamos con restaurantes independientes, grupos gastronómicos y marcas en expansión. Lo importante no es el tamaño, sino la decisión de profesionalizar el canal de delivery y hacerlo rentable.",
  },
  {
    pregunta: "¿En qué se diferencian de una agencia de marketing tradicional?",
    respuesta:
      "No gestionamos redes sociales ni hacemos publicidad genérica. Operamos el canal de delivery: precios, promos, posicionamiento en apps, visibilidad, margen, ticket promedio y performance diaria. Nuestro foco es la rentabilidad, no los likes.",
  },
  {
    pregunta: "¿Cuánto tiempo tarda en verse impacto en los resultados?",
    respuesta:
      "En la mayoría de los casos, los primeros ajustes impactan dentro de las primeras semanas. Sin embargo, el crecimiento sostenible se construye en los primeros 60–90 días, cuando ya tenemos datos suficientes para optimizar con precisión.",
  },
  {
    pregunta: "¿Trabajan con todas las apps de delivery?",
    respuesta:
      "Sí. Operamos marketplaces (3rd party) y también e-commerce propio (1st party). Nos adaptamos al ecosistema digital de cada restaurante y coordinamos la estrategia completa.",
  },
  {
    pregunta:
      "¿Qué pasa si ya tengo a alguien gestionando el delivery internamente?",
    respuesta:
      "Podemos complementar al equipo como partners estratégicos o trabajar bajo modalidad de consultoría. Muchas veces el problema no es la falta de esfuerzo, sino la falta de estructura y análisis.",
  },
];
