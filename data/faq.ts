/**
 * Preguntas frecuentes (página /faq). Bilingüe {es,en}. El acordeón resuelve
 * el idioma activo con useT(); el JSON-LD FAQPage usa el idioma de la URL.
 * Editá / reordená acá.
 */

type Localized = { es: string; en: string; it: string };

export type Faq = {
  pregunta: Localized;
  respuesta: Localized;
};

export const faqs: Faq[] = [
  {
    pregunta: {
      es: "¿Trabajan solo con grandes cadenas o también con restaurantes independientes?",
      en: "Do you only work with large chains, or also with independent restaurants?",
      it: "Lavorate solo con grandi catene o anche con ristoranti indipendenti?",
    },
    respuesta: {
      es: "Trabajamos con restaurantes independientes, grupos gastronómicos y marcas en expansión. Lo importante no es el tamaño, sino la decisión de profesionalizar el canal de delivery y hacerlo rentable.",
      en: "We work with independent restaurants, restaurant groups, and growing brands. What matters isn't the size — it's the decision to professionalize the delivery channel and make it profitable.",
      it: "Lavoriamo con ristoranti indipendenti, gruppi della ristorazione e brand in espansione. Non conta la dimensione, ma la decisione di professionalizzare il canale delivery e renderlo redditizio.",
    },
  },
  {
    pregunta: {
      es: "¿En qué se diferencian de una agencia de marketing tradicional?",
      en: "How are you different from a traditional marketing agency?",
      it: "In cosa siete diversi da un'agenzia di marketing tradizionale?",
    },
    respuesta: {
      es: "No gestionamos redes sociales ni hacemos publicidad genérica. Operamos el canal de delivery: precios, promos, posicionamiento en apps, visibilidad, margen, ticket promedio y performance diaria. Nuestro foco es la rentabilidad, no los likes.",
      en: "We don't manage social media or run generic ads. We operate the delivery channel: pricing, promos, app positioning, visibility, margin, average ticket, and daily performance. Our focus is profitability, not likes.",
      it: "Non gestiamo social né facciamo pubblicità generica. Operiamo il canale delivery: prezzi, promo, posizionamento nelle app, visibilità, margine, ticket medio e performance quotidiana. Il nostro focus è la redditività, non i like.",
    },
  },
  {
    pregunta: {
      es: "¿Cuánto tiempo tarda en verse impacto en los resultados?",
      en: "How long does it take to see an impact on results?",
      it: "Quanto tempo serve per vedere un impatto sui risultati?",
    },
    respuesta: {
      es: "En la mayoría de los casos, los primeros ajustes impactan dentro de las primeras semanas. Sin embargo, el crecimiento sostenible se construye en los primeros 60–90 días, cuando ya tenemos datos suficientes para optimizar con precisión.",
      en: "In most cases, the first adjustments make an impact within the first few weeks. That said, sustainable growth is built over the first 60–90 days, once we have enough data to optimize with precision.",
      it: "Nella maggior parte dei casi, i primi interventi hanno effetto già nelle prime settimane. La crescita sostenibile, però, si costruisce nei primi 60–90 giorni, quando abbiamo dati sufficienti per ottimizzare con precisione.",
    },
  },
  {
    pregunta: {
      es: "¿Trabajan con todas las apps de delivery?",
      en: "Do you work with every delivery app?",
      it: "Lavorate con tutte le app di delivery?",
    },
    respuesta: {
      es: "Sí. Operamos marketplaces (3rd party) y también e-commerce propio (1st party). Nos adaptamos al ecosistema digital de cada restaurante y coordinamos la estrategia completa.",
      en: "Yes. We operate marketplaces (3rd party) and your own e-commerce (1st party). We adapt to each restaurant's digital ecosystem and coordinate the entire strategy.",
      it: "Sì. Operiamo sui marketplace (3rd party) e anche sull'e-commerce proprietario (1st party). Ci adattiamo all'ecosistema digitale di ogni ristorante e coordiniamo l'intera strategia.",
    },
  },
  {
    pregunta: {
      es: "¿Qué pasa si ya tengo a alguien gestionando el delivery internamente?",
      en: "What if I already have someone managing delivery in-house?",
      it: "E se ho già qualcuno che gestisce il delivery internamente?",
    },
    respuesta: {
      es: "Podemos complementar al equipo como partners estratégicos o trabajar bajo modalidad de consultoría. Muchas veces el problema no es la falta de esfuerzo, sino la falta de estructura y análisis.",
      en: "We can complement your team as strategic partners or work in a consulting capacity. Often the problem isn't a lack of effort, but a lack of structure and analysis.",
      it: "Possiamo affiancare il tuo team come partner strategici o lavorare in modalità consulenza. Spesso il problema non è la mancanza di impegno, ma di struttura e analisi.",
    },
  },
];
