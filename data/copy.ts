// Copy bilingüe del sitio. Cada string mostrado es un campo { es, en }.
// El .es está en español NEUTRO (sin voseo); el .en en inglés natural de
// marketing. Datos estructurales (paths, números, hrefs, enums, nombres
// propios) quedan como valores planos. Se resuelve al idioma activo con
// useCopy() (components/i18n/LanguageContext).
export const copy = {
  hero: {
    eyebrow: {
      es: "Growth Partner · LATAM & Europa",
      en: "Growth Partner · LATAM & Europe",
      it: "Growth Partner · LATAM & Europa",
    },
    headline: {
      es: "Potenciamos tu Delivery y optimizamos tus Canales Digitales.",
      en: "We supercharge your delivery, empowering your sales channels.",
      it: "Potenziamo il tuo delivery e ottimizziamo i tuoi canali digitali.",
    },
    headlineAccent: {
      es: "Potenciamos tu Delivery",
      en: "We supercharge your delivery,",
      it: "Potenziamo il tuo delivery",
    },
    subhead: {
      es: "Somos la agencia número #1 del mundo en Restaurantes",
      en: "We are the #1 Restaurant Agency",
      it: "Siamo l'agenzia #1 al mondo per i ristoranti",
    },
    ctaPrimary: {
      label: { es: "Consultoría gratuita", en: "Free discovery call", it: "Consulenza gratuita" },
      href: "#contacto",
    },
    ctaSecondary: {
      label: {
        es: "Hablar con un especialista",
        en: "Speak with a specialist",
        it: "Parla con uno specialista",
      },
      href: "#contacto",
    },
    scrollLabel: { es: "Scroll", en: "Scroll", it: "Scroll" },
  },
  whereWeOperate: {
    eyebrow: { es: "Presencia global", en: "Global presence", it: "Presenza globale" },
    heading: {
      es: "Operamos delivery en +20 países.",
      en: "We run delivery in +20 countries.",
      it: "Gestiamo il delivery in +20 paesi.",
    },
    subheading: {
      es: "De LATAM a Europa, gestionamos el canal digital de restaurantes en todo el mundo.",
      en: "From LATAM to Europe, we manage restaurants' digital channel all over the world.",
      it: "Dall'America Latina all'Europa, gestiamo il canale digitale dei ristoranti in tutto il mondo.",
    },
  },
  wall: {
    eyebrow: { es: "Quiénes confían en nosotros", en: "Who trusts us", it: "Chi si fida di noi" },
    heading: {
      es: "Más de 500 restaurantes ya operan su delivery con Pimentón.",
      en: "Over 500 restaurants already run their delivery with Pimentón.",
      it: "Oltre 500 ristoranti gestiscono già il loro delivery con Pimentón.",
    },
    headingAccent: { es: "500 restaurantes", en: "500 restaurants", it: "500 ristoranti" },
  },
  stats: {
    items: [
      {
        label: { es: "Crecimiento Ventas", en: "Sales Growth", it: "Crescita vendite" },
        caption: {
          es: "en los primeros tres meses",
          en: "in the first three months",
          it: "nei primi tre mesi",
        },
        value: 30,
        prefix: "+",
        suffix: "%",
        bg: "coral",
        size: "large",
      },
      {
        label: { es: "Restaurantes", en: "Restaurants", it: "Ristoranti" },
        caption: { es: "confían en nosotros", en: "trust us", it: "si fidano di noi" },
        value: 500,
        prefix: "+",
        suffix: "",
        bg: "mint",
        size: "small",
      },
      {
        label: { es: "Países", en: "Countries", it: "Paesi" },
        caption: {
          es: "Presencia en USA, LatAm y Europa",
          en: "Presence across the US, LatAm and Europe",
          it: "Presenza in USA, LatAm ed Europa",
        },
        value: 20,
        prefix: "+",
        suffix: "",
        bg: "soft",
        size: "small",
      },
      {
        label: { es: "Rentabilidad", en: "Profitability", it: "Redditività" },
        caption: {
          es: "aumento promedio trimestral",
          en: "average quarterly increase",
          it: "aumento medio trimestrale",
        },
        value: 18,
        prefix: "+",
        suffix: "%",
        bg: "yellow",
        size: "large",
      },
    ],
  },
  controlRoom: {
    eyebrow: { es: "Nuestra tecnología", en: "Our technology", it: "La nostra tecnologia" },
    heading: { es: "Control Room ®", en: "Control Room ®", it: "Control Room ®" },
    subheading: {
      es: "Tu delivery operado desde una sola pantalla.",
      en: "Your delivery, run from a single screen.",
      it: "Il tuo delivery gestito da un solo schermo.",
    },
    watchLabel: { es: "Ver en acción", en: "Watch in action", it: "Guarda in azione" },
    watchAria: {
      es: "Ver Control Room en acción",
      en: "Watch Control Room in action",
      it: "Guarda Control Room in azione",
    },
    modalAria: { es: "Control Room en acción", en: "Control Room in action", it: "Control Room in azione" },
    closeAria: { es: "Cerrar", en: "Close", it: "Chiudi" },
    closeModalAria: { es: "Cerrar modal", en: "Close modal", it: "Chiudi finestra" },
  },
  marketStats: {
    heading: {
      es: "¿Por qué profesionalizar tu delivery?",
      en: "Key reasons to upgrade your delivery service.",
      it: "Perché professionalizzare il tuo delivery?",
    },
    items: [
      {
        stat: { es: "1 pedido por semana", en: "1 order per week", it: "1 ordine a settimana" },
        label: {
          es: "Gen Z y Millennials piden al menos una vez por semana.",
          en: "Gen Z and Millennials order at least once a week.",
          it: "Gen Z e Millennial ordinano almeno una volta a settimana.",
        },
        icon: "pedido-semana",
      },
      {
        stat: { es: "+40%", en: "+40%", it: "+40%" },
        label: {
          es: "Crecimiento interanual del delivery.",
          en: "Year-over-year delivery growth.",
          it: "Crescita annua del delivery.",
        },
        icon: "facturacion",
      },
      {
        stat: { es: "8 de cada 10", en: "8 out of 10", it: "8 su 10" },
        label: {
          es: "Personas leen reseñas antes de pedir.",
          en: "People read reviews before ordering.",
          it: "Persone leggono le recensioni prima di ordinare.",
        },
        icon: "personas",
      },
      {
        stat: { es: "Nuevos Usuarios", en: "New Users", it: "Nuovi utenti" },
        label: {
          es: "Si no captamos clientes, la competencia lo hace.",
          en: "If we don't capture customers, the competition will.",
          it: "Se non conquistiamo noi i clienti, lo fa la concorrenza.",
        },
        icon: "impresiones",
      },
    ],
  },
  comparison: {
    heading: {
      es: "Tu delivery cambia cuando alguien lo opera en serio.",
      en: "Your delivery changes when someone runs it for real.",
      it: "Il tuo delivery cambia quando qualcuno lo gestisce sul serio.",
    },
    off: {
      title: { es: "Sin Pimentón", en: "Without Pimentón", it: "Senza Pimentón" },
      footer: { es: "A ciegas", en: "Flying blind", it: "Alla cieca" },
      toggleKicker: { es: "Prueba la diferencia", en: "See the difference", it: "Prova la differenza" },
      toggleLabel: { es: "Activa Pimentón", en: "Turn on Pimentón", it: "Attiva Pimentón" },
    },
    on: {
      title: { es: "Con Pimentón", en: "With Pimentón", it: "Con Pimentón" },
      footer: { es: "Con datos reales", en: "With real data", it: "Con dati reali" },
      toggleKicker: { es: "Pimentón activo", en: "Pimentón on", it: "Pimentón attivo" },
      toggleLabel: { es: "Toca para desactivar", en: "Tap to turn off", it: "Tocca per disattivare" },
    },
    footerLabel: { es: "Decisiones de canal", en: "Channel decisions", it: "Decisioni di canale" },
    toggleAria: {
      es: "Activar Pimentón en mi delivery",
      en: "Turn on Pimentón for my delivery",
      it: "Attiva Pimentón sul mio delivery",
    },
    items: [
      {
        off: {
          es: "Solo frente a las apps: la operación, las negociaciones y los problemas recaen en tu equipo.",
          en: "Alone against the apps: operations, negotiations and problems all land on your team.",
          it: "Da solo contro le app: operatività, negoziazioni e problemi ricadono sul tuo team.",
        },
        on: {
          es: "Gestión del día a día del Delivery y relación con las aplicaciones: un equipo de especialistas a cargo de tu negocio.",
          en: "Day-to-day delivery management and app relationships: a team of specialists running your business.",
          it: "Gestione quotidiana del delivery e rapporto con le app: un team di specialisti alla guida della tua attività.",
        },
      },
      {
        off: {
          es: "Datos dispersos entre apps, planillas y pantallas: imposible tomar decisiones en tiempo real.",
          en: "Data scattered across apps, spreadsheets and screens: impossible to decide in real time.",
          it: "Dati sparsi tra app, fogli di calcolo e schermi: impossibile decidere in tempo reale.",
        },
        on: {
          es: "Dashboards en tiempo real con ventas, operaciones, funnel y principales métricas económicas.",
          en: "Real-time dashboards with sales, operations, funnel and key economic metrics.",
          it: "Dashboard in tempo reale con vendite, operatività, funnel e principali metriche economiche.",
        },
      },
      {
        off: {
          es: "Precios desactualizados, stock fuera de control y caídas de conectividad que descubres cuando el cliente reclama.",
          en: "Outdated prices, stock out of control and connectivity outages you only catch when a customer complains.",
          it: "Prezzi non aggiornati, stock fuori controllo e cadute di connessione che scopri quando il cliente si lamenta.",
        },
        on: {
          es: "Estrategia de precios, control de stocks y monitoreo de conectividad.",
          en: "Pricing strategy, stock control and connectivity monitoring.",
          it: "Strategia di prezzo, controllo dello stock e monitoraggio della connettività.",
        },
      },
      {
        off: {
          es: "Reseñas negativas sin respuesta y reclamos sin gestionar: cada incidencia te baja el ranking y la facturación.",
          en: "Negative reviews left unanswered and complaints unmanaged: every incident drops your ranking and revenue.",
          it: "Recensioni negative senza risposta e reclami non gestiti: ogni problema ti fa perdere ranking e fatturato.",
        },
        on: {
          es: "Moderación de reseñas, reclamos e incidencias.",
          en: "Review, complaint and incident management.",
          it: "Moderazione di recensioni, reclami e problemi.",
        },
      },
      {
        off: {
          es: "Promos improvisadas sin estrategia: cada mes se reinventa el plan y el crecimiento nunca llega.",
          en: "Improvised promos with no strategy: every month the plan resets and growth never comes.",
          it: "Promo improvvisate senza strategia: ogni mese si riparte da zero e la crescita non arriva mai.",
        },
        on: {
          es: "Planificación de campañas y estrategias de crecimiento.",
          en: "Campaign planning and growth strategies.",
          it: "Pianificazione delle campagne e strategie di crescita.",
        },
      },
    ],
  },
  servicesTeaser: {},
  services: {
    eyebrow: { es: "Nuestros servicios", en: "Our services", it: "I nostri servizi" },
    heading: {
      es: "Una unidad de negocio completa, no un servicio más.",
      en: "A complete business unit, not just another service.",
      it: "Un'unità di business completa, non un servizio in più.",
    },
    cta: {
      label: { es: "Contáctanos", en: "Contact us", it: "Contattaci" },
      href: "#contacto",
    },
    items: [
      {
        num: "01",
        name: { es: "Gestión Integral", en: "End-to-End Management", it: "Gestione integrale" },
        description: {
          es: "Nos hacemos cargo del Delivery de punta a punta: equipo, análisis, estrategia, ejecución y seguimiento diario. Con foco en crecimiento y rentabilidad.",
          en: "We take over your Delivery end to end: team, analytics, strategy, execution and daily follow-up. Focused on growth and profitability.",
          it: "Ci occupiamo del tuo delivery dall'inizio alla fine: team, analisi, strategia, esecuzione e monitoraggio quotidiano. Con focus su crescita e redditività.",
        },
        image: "/assets/services/service_gestion-integral.webp",
        platforms: [
          "/assets/logos-platforms/foodapp_rappi.svg",
          "/assets/logos-platforms/foodapp_pedidos-ya.svg",
          "/assets/logos-platforms/foodapp_uber-eats.svg",
          "/assets/logos-platforms/foodapp_glovo.svg",
          "/assets/logos-platforms/foodapp_deliveroo.svg",
        ],
      },
      {
        num: "02",
        name: { es: "Consultoría", en: "Consulting", it: "Consulenza" },
        description: {
          es: "Trabajamos proyectos a medida en base a las necesidades de tu Restaurante, definiendo objetivos claros y metodologías ágiles.",
          en: "We build tailored projects around your restaurant's needs, with clear goals and agile methodologies.",
          it: "Sviluppiamo progetti su misura in base alle esigenze del tuo ristorante, con obiettivi chiari e metodologie agili.",
        },
        image: "/assets/services/service_consultoria.webp",
        platforms: [
          "/assets/logos-platforms/tool_deliverect.svg",
          "/assets/logos-platforms/tool_toast.svg",
          "/assets/logos-platforms/tool_delivery-hero.svg",
        ],
      },
      {
        num: "03",
        name: { es: "Performance", en: "Performance", it: "Performance" },
        description: {
          es: "Optimizamos lo que más impacta en tus ventas: visibilidad, conversión, ticket promedio y recompra. Ajustes constantes, decisiones rápidas.",
          en: "We optimize what moves your sales most: visibility, conversion, average ticket and repeat orders. Constant tuning, fast decisions.",
          it: "Ottimizziamo ciò che incide di più sulle tue vendite: visibilità, conversione, ticket medio e riacquisto. Aggiustamenti continui, decisioni rapide.",
        },
        image: "/assets/services/service_performance.webp",
        platforms: [
          "/assets/logos-platforms/foodapp_rappi.svg",
          "/assets/logos-platforms/foodapp_pedidos-ya.svg",
          "/assets/logos-platforms/foodapp_uber-eats.svg",
          "/assets/logos-platforms/tech_meta.svg",
        ],
      },
      {
        num: "04",
        name: { es: "Estrategia", en: "Strategy", it: "Strategia" },
        description: {
          es: "Definimos en conjunto la combinación perfecta entre operaciones, marketing, procesos y rentabilidad que se ajuste a tu negocio.",
          en: "Together we define the right mix of operations, marketing, processes and profitability for your business.",
          it: "Definiamo insieme il mix perfetto tra operatività, marketing, processi e redditività, su misura per la tua attività.",
        },
        image: "/assets/services/service_estrategia.webp",
        platforms: [
          "/assets/logos-platforms/tech_google.svg",
          "/assets/logos-platforms/tech_meta.svg",
          "/assets/logos-platforms/tool_delivery-hero.svg",
        ],
      },
      {
        num: "05",
        name: { es: "Tecnología", en: "Technology", it: "Tecnologia" },
        description: {
          es: "Utilizamos data de las Food Apps y canales digitales para disponer en tiempo real de toda la información que tu Restaurante necesita para la toma de decisiones.",
          en: "We use data from Foodapps and digital channels to surface, in real time, all the information your restaurant needs to make decisions.",
          it: "Usiamo i dati delle Foodapps e dei canali digitali per avere in tempo reale tutte le informazioni di cui il tuo ristorante ha bisogno per decidere.",
        },
        image: "/assets/services/service_tecnologia.webp",
        platforms: [
          "/assets/logos-platforms/tech_claude.svg",
          "/assets/logos-platforms/tech_chat-gpt.svg",
          "/assets/logos-platforms/tech_google.svg",
          "/assets/logos-platforms/tech_meta.svg",
        ],
      },
    ],
  },
  successStories: {},
  testimonials: {
    starsAria: { es: "5 estrellas", en: "5 stars", it: "5 stelle" },
    intro: {
      brand: "Pimentón",
      heading: { es: "Lo que dicen de nosotros", en: "What they say about us", it: "Cosa dicono di noi" },
    },
    items: [
      {
        // Cita real del cliente — queda en su idioma original (no se traduce).
        quote:
          "El equipo nos ayuda con la coordinación general del Delivery, desde la rentabilidad del negocio hasta la gestión operativa de reclamos e incidencias.",
        metrics: [
          {
            value: 12,
            prefix: "+",
            suffix: "%",
            label: {
              es: "Contribución marginal",
              en: "Marginal contribution",
              it: "Margine di contribuzione",
            },
          },
          {
            value: 3000,
            prefix: "+",
            suffix: "",
            label: { es: "Pedidos recuperados", en: "Recovered orders", it: "Ordini recuperati" },
          },
        ],
        name: "Valeyr Turjeman",
        brand: "Mr. Noodles",
        role: { es: "Directora General", en: "General Manager", it: "Direttrice generale" },
      },
      {
        quote:
          "Las herramientas y paneles nos ayudaron a consolidar todo el negocio digital en un solo lugar, agilizando nuestra toma de decisiones.",
        metrics: [
          {
            value: 4,
            prefix: "",
            suffix: "",
            label: { es: "Canales integrados", en: "Integrated channels", it: "Canali integrati" },
          },
          {
            value: 10,
            prefix: "+",
            suffix: "%",
            label: { es: "Aumento facturación", en: "Revenue increase", it: "Aumento fatturato" },
          },
        ],
        name: "Bruno González Calvo",
        brand: "Grosso Napoletano",
        role: {
          es: "Partner & Managing Director",
          en: "Partner & Managing Director",
          it: "Partner & Managing Director",
        },
      },
      {
        quote:
          "El seguimiento semanal y el apoyo en el día a día son fundamentales para nuestro plan de expansión y apoyo a los franquiciados.",
        metrics: [
          {
            value: 8,
            prefix: "+",
            suffix: "%",
            label: { es: "Crecimiento YoY", en: "YoY growth", it: "Crescita YoY" },
          },
          {
            value: 2,
            prefix: "+",
            suffix: "",
            label: { es: "Franquicias", en: "Franchises", it: "Franchising" },
          },
        ],
        name: "Carlos Estevez Rozas",
        brand: "Jekes Kebabs",
        role: { es: "Partner & CEO", en: "Partner & CEO", it: "Partner & CEO" },
      },
    ],
  },
  ctaFinal: {},
  consultancy: {
    eyebrow: { es: "Empecemos", en: "Let's start", it: "Iniziamo" },
    heading: {
      es: "Consultoría gratuita en 4 pasos.",
      en: "Free Consultancy in 4 steps.",
      it: "Consulenza gratuita in 4 passi.",
    },
    subheading: {
      es: "Cuéntanos sobre tu restaurante y un especialista de tu región te escribe por WhatsApp.",
      en: "Tell us about your restaurant and a specialist from your region will reach out on WhatsApp.",
      it: "Raccontaci del tuo ristorante e uno specialista della tua zona ti scrive su WhatsApp.",
    },
    socialProof: {
      es: "+500 restaurantes confían en Pimentón",
      en: "+500 restaurants trust Pimentón",
      it: "+500 ristoranti si fidano di Pimentón",
    },
    bullets: [
      {
        es: "Consultoría sin cargo y sin compromiso",
        en: "Free Consultancy, no strings attached",
        it: "Consulenza gratuita e senza impegno",
      },
      {
        es: "Hablas con un especialista de tu región",
        en: "Talk to a specialist from your region",
        it: "Parli con uno specialista della tua zona",
      },
      { es: "Respuesta directa por WhatsApp", en: "Direct reply on WhatsApp", it: "Risposta diretta su WhatsApp" },
    ],
  },
  consultationForm: {
    intro: {
      eyebrow: { es: "Empecemos", en: "Let's start", it: "Iniziamo" },
      heading: {
        es: "Consultoría gratuita en 4 pasos.",
        en: "Free Consultancy in 4 steps.",
        it: "Consulenza gratuita in 4 passi.",
      },
      headingAccent: { es: "en 4 pasos.", en: "in 4 steps.", it: "in 4 passi." },
      description: {
        es: "Cuéntanos sobre tu Restaurante y un especialista te contactará por WhatsApp.",
        en: "Tell us about your Restaurant and a specialist will contact you on WhatsApp.",
        it: "Raccontaci del tuo ristorante e uno specialista ti contatterà su WhatsApp.",
      },
      socialProof: {
        es: "+500 restaurantes confían en Pimentón",
        en: "+500 restaurants trust Pimentón",
        it: "+500 ristoranti si fidano di Pimentón",
      },
      bullets: [
        {
          es: "Consultoría sin cargo y sin compromiso",
          en: "Free Consultancy, no strings attached",
          it: "Consulenza gratuita e senza impegno",
        },
        {
          es: "Hablas con un especialista de tu región",
          en: "Talk to a specialist from your region",
          it: "Parli con uno specialista della tua zona",
        },
        {
          es: "Respuesta directa por WhatsApp",
          en: "Direct reply on WhatsApp",
          it: "Risposta diretta su WhatsApp",
        },
      ],
    },
    aria: {
      categories: { es: "Categorías", en: "Categories", it: "Categorie" },
      searchCountry: { es: "Buscar país", en: "Search country", it: "Cerca paese" },
      countryList: { es: "Lista de países", en: "Country list", it: "Elenco dei paesi" },
      sizeGroup: {
        es: "Tamaño de la operación",
        en: "Operation size",
        it: "Dimensione dell'attività",
      },
    },
    step1: {
      label: { es: "Paso 1 de 4", en: "Step 1 of 4", it: "Passo 1 di 4" },
      title: { es: "Elige tu categoría", en: "Choose your category", it: "Scegli la tua categoria" },
      titleAccent: { es: "tu categoría", en: "your category", it: "la tua categoria" },
      helper: {
        es: "Puedes seleccionar más de una.",
        en: "You can select more than one.",
        it: "Puoi selezionarne più di una.",
      },
    },
    step2: {
      label: { es: "Paso 2 de 4", en: "Step 2 of 4", it: "Passo 2 di 4" },
      title: {
        es: "¿Dónde está tu negocio?",
        en: "Where is your business?",
        it: "Dove si trova la tua attività?",
      },
      titleAccent: { es: "tu negocio?", en: "your business?", it: "la tua attività?" },
      otherLabel: { es: "Otro país", en: "Other country", it: "Altro paese" },
      searchPlaceholder: { es: "Buscar país…", en: "Search country…", it: "Cerca paese…" },
      emptyState: {
        es: "No encontramos ese país.",
        en: "We couldn't find that country.",
        it: "Non abbiamo trovato questo paese.",
      },
    },
    step3: {
      label: { es: "Paso 3 de 4", en: "Step 3 of 4", it: "Passo 3 di 4" },
      title: {
        es: "¿Cuántos locales tienes?",
        en: "How many locations do you have?",
        it: "Quanti locali hai?",
      },
      titleAccent: { es: "locales", en: "locations", it: "locali" },
    },
    step4: {
      label: { es: "Paso 4 de 4", en: "Step 4 of 4", it: "Passo 4 di 4" },
      title: { es: "Déjanos tus datos", en: "Leave us your details", it: "Lasciaci i tuoi dati" },
      titleAccent: { es: "tus datos", en: "your details", it: "i tuoi dati" },
      restaurantLabel: {
        es: "Nombre del restaurante",
        en: "Restaurant name",
        it: "Nome del ristorante",
      },
      restaurantPlaceholder: { es: "Brasa & Fuego", en: "Brasa & Fuego", it: "Brasa & Fuego" },
      phoneLabel: { es: "Número de móvil", en: "Mobile number", it: "Numero di cellulare" },
      phonePlaceholder: {
        es: "+54 9 11 1234 5678",
        en: "+54 9 11 1234 5678",
        it: "+54 9 11 1234 5678",
      },
      phoneHint: {
        es: "Te escribimos por WhatsApp en las próximas horas. Nada de spam.",
        en: "We'll message you on WhatsApp within hours. No spam.",
        it: "Ti scriviamo su WhatsApp nelle prossime ore. Niente spam.",
      },
      instagramLabel: { es: "Instagram", en: "Instagram", it: "Instagram" },
      instagramPlaceholder: { es: "turestaurante", en: "yourrestaurant", it: "iltuoristorante" },
      instagramOptional: { es: "opcional", en: "optional", it: "facoltativo" },
      submitLabel: {
        es: "Enviar y abrir WhatsApp",
        en: "Send and open WhatsApp",
        it: "Invia e apri WhatsApp",
      },
      sendingLabel: { es: "Enviando…", en: "Sending…", it: "Invio in corso…" },
      errorInvalid: {
        es: "Revisa los datos e inténtalo de nuevo.",
        en: "Check the details and try again.",
        it: "Controlla i dati e riprova.",
      },
      errorUnavailable: {
        es: "No pudimos registrar tu consulta. Inténtalo de nuevo en un momento.",
        en: "We couldn't register your request. Please try again in a moment.",
        it: "Non siamo riusciti a registrare la tua richiesta. Riprova tra un momento.",
      },
    },
    nav: {
      back: { es: "Atrás", en: "Back", it: "Indietro" },
      next: { es: "Siguiente", en: "Next", it: "Avanti" },
    },
    validation: {
      category: {
        es: "Elige al menos una categoría.",
        en: "Choose at least one category.",
        it: "Scegli almeno una categoria.",
      },
      country: { es: "Elige tu país.", en: "Choose your country.", it: "Scegli il tuo paese." },
      size: {
        es: "Elige el tamaño de tu operación.",
        en: "Choose your operation size.",
        it: "Scegli la dimensione della tua attività.",
      },
      restaurant: {
        es: "Ingresa el nombre de tu restaurante.",
        en: "Enter your restaurant name.",
        it: "Inserisci il nome del tuo ristorante.",
      },
      phone: {
        es: "Ingresa un número de teléfono válido.",
        en: "Enter a valid phone number.",
        it: "Inserisci un numero di telefono valido.",
      },
    },
    success: {
      // "{restaurant}" se reemplaza en render con el nombre cargado.
      title: { es: "¡Listo, {restaurant}!", en: "You're all set, {restaurant}!", it: "Fatto, {restaurant}!" },
      titleFallback: { es: "¡Listo!", en: "All set!", it: "Fatto!" },
      description: {
        es: "Te llevamos a WhatsApp con tu mensaje listo. Un especialista de tu región te responde en las próximas horas.",
        en: "We're taking you to WhatsApp with your message ready. A specialist from your region will reply within hours.",
        it: "Ti portiamo su WhatsApp con il messaggio già pronto. Uno specialista della tua zona ti risponde nelle prossime ore.",
      },
      cta: { es: "Abrir WhatsApp", en: "Open WhatsApp", it: "Apri WhatsApp" },
    },
  },
  gallery: {
    images: [
      {
        src: null,
        alt: {
          es: "Cocina de restaurante en plena operación",
          en: "Restaurant kitchen in full operation",
          it: "Cucina di un ristorante in piena attività",
        },
      },
      {
        src: null,
        alt: {
          es: "Repartidor saliendo a delivery",
          en: "Courier heading out for delivery",
          it: "Rider in partenza per una consegna",
        },
      },
      {
        src: null,
        alt: {
          es: "Plato emplatado, foto cenital",
          en: "Plated dish, overhead shot",
          it: "Piatto impiattato, foto dall'alto",
        },
      },
      {
        src: null,
        alt: {
          es: "Hamburguesa gourmet, primer plano",
          en: "Gourmet burger, close-up",
          it: "Hamburger gourmet, primo piano",
        },
      },
      {
        src: null,
        alt: {
          es: "Repartidor entregando el pedido",
          en: "Courier handing over the order",
          it: "Rider che consegna l'ordine",
        },
      },
      {
        src: null,
        alt: {
          es: "Equipo trabajando en cocina",
          en: "Team working in the kitchen",
          it: "Team al lavoro in cucina",
        },
      },
    ],
  },
  specialists: {
    galleryHeading: {
      es: "Especialistas en delivery,",
      en: "Delivery specialists,",
      it: "Specialisti in delivery,",
    },
    phrase1: {
      text: {
        es: "No necesitas más pedidos. Necesitas mejores decisiones.",
        en: "You don't need more orders. You need better decisions.",
        it: "Non ti servono più ordini. Ti servono decisioni migliori.",
      },
      highlight: { es: "mejores decisiones", en: "better decisions", it: "decisioni migliori" },
    },
    phrase2: {
      text: {
        es: "Somos especialistas en convertir tu delivery en una unidad de negocio rentable.",
        en: "We're specialists at turning your delivery into a profitable business unit.",
        it: "Siamo specialisti nel trasformare il tuo delivery in un'unità di business redditizia.",
      },
      highlight: {
        es: "unidad de negocio rentable",
        en: "profitable business unit",
        it: "unità di business redditizia",
      },
    },
  },
  // Página /equipo (Cultura Pimentón). Sólo .es por ahora; el .en se suma
  // en la próxima tanda de traducción (el fallback ya muestra .es en EN).
  equipo: {
    hero: {
      eyebrow: { es: "Cultura Pimentón", en: "Pimentón Culture", it: "Cultura Pimentón" },
    },
    manifesto: {
      // \n = quiebre de línea forzado en desktop (ver FraseManifiesto);
      // en pantallas chicas el texto fluye con text-balance (sin huérfanos).
      text: {
        es: "Crecer implica\naprender todo el tiempo.",
        en: "Growing means\nlearning all the time.",
        it: "Crescere significa\nimparare sempre.",
      },
      accent: { es: "aprender", en: "learning", it: "imparare" },
    },
    valores: {
      rows: [
        {
          heading: { es: "Nos movemos con adaptabilidad", en: "We move with adaptability", it: "Ci muoviamo con adattabilità" },
          accent: { es: "adaptabilidad", en: "adaptability", it: "adattabilità" },
          paragraph: {
            es: "Entregamos con calidad, priorizando lo que importa y orientando cada acción a resultados concretos. Leemos el contexto, ajustamos rápido y seguimos.",
            en: "We deliver with quality, prioritizing what matters and steering every action toward concrete results. We read the context, adjust fast, and keep going.",
            it: "Lavoriamo con qualità, dando priorità a ciò che conta e orientando ogni azione a risultati concreti. Leggiamo il contesto, ci adattiamo in fretta e andiamo avanti.",
          },
          image: "/assets/equipo/equipo-valor-1-v2.webp",
          alt: { es: "Equipo Pimentón colaborando", en: "Pimentón team collaborating", it: "Team Pimentón che collabora" },
        },
        {
          heading: { es: "Somos protagonistas", en: "We take ownership", it: "Siamo protagonisti" },
          accent: { es: "protagonistas", en: "ownership", it: "protagonisti" },
          paragraph: {
            es: "Hacemos que las cosas pasen, nos involucramos y resolvemos en equipo. El compromiso se nota en la acción y en la responsabilidad compartida.",
            en: "We make things happen, we get involved, and we solve as a team. Commitment shows in the action and in shared responsibility.",
            it: "Facciamo succedere le cose, ci mettiamo in gioco e risolviamo in team. L'impegno si vede nell'azione e nella responsabilità condivisa.",
          },
          image: "/assets/equipo/equipo-valor-2-v2.webp",
          alt: { es: "Equipo Pimentón en plena operación", en: "Pimentón team in full operation", it: "Team Pimentón in piena attività" },
        },
        {
          heading: { es: "El respeto atraviesa todo", en: "Respect runs through everything", it: "Il rispetto attraversa tutto" },
          accent: { es: "respeto", en: "Respect", it: "rispetto" },
          paragraph: {
            es: "Nos comunicamos con honestidad, escuchamos activamente y valoramos las ideas por sobre las jerarquías. Debatimos con intención y construimos una cultura directa, humana y adulta.",
            en: "We communicate honestly, listen actively, and value ideas over hierarchy. We debate with intention and build a direct, human, grown-up culture.",
            it: "Comunichiamo con onestà, ascoltiamo attivamente e mettiamo le idee davanti alle gerarchie. Discutiamo con intenzione e costruiamo una cultura diretta, umana e matura.",
          },
          image: "/assets/equipo/equipo-valor-3-v2.webp",
          alt: { es: "Cultura de respeto en Pimentón", en: "A culture of respect at Pimentón", it: "Cultura del rispetto in Pimentón" },
        },
      ],
    },
    modelo: {
      heading: { es: "Cómo acompañamos este modelo", en: "How we support this model", it: "Come sosteniamo questo modello" },
      headingAccent: { es: "acompañamos", en: "support", it: "sosteniamo" },
      cards: [
        { title: { es: "Trabajo distribuido y flexible", en: "Distributed, flexible work", it: "Lavoro distribuito e flessibile" }, icon: "laptop" },
        {
          title: { es: "Compensación alineada a impacto y resultados", en: "Compensation tied to impact and results", it: "Compenso legato a impatto e risultati" },
          icon: "trending-up",
        },
        {
          title: {
            es: "Reconocimiento por contribuir al crecimiento del negocio",
            en: "Recognition for contributing to business growth",
            it: "Riconoscimento per il contributo alla crescita del business",
          },
          icon: "award",
        },
        {
          title: { es: "Descanso coordinado en función del equipo", en: "Time off coordinated around the team", it: "Ferie coordinate in funzione del team" },
          icon: "calendar",
        },
      ],
    },
    partners: {
      eyebrow: { es: "Operamos con todo el ecosistema", en: "We operate across the whole ecosystem", it: "Operiamo con tutto l'ecosistema" },
    },
    cta: {
      heading: { es: "¿Quieres sumarte a Pimentón?", en: "Want to join Pimentón?", it: "Vuoi unirti a Pimentón?" },
      headingAccent: { es: "sumarte", en: "join", it: "unirti" },
      description: {
        es: "Siempre queremos conocer personas con mentalidad emprendedora y ganas de construir. Si sientes que este modelo de trabajo va contigo, completa el formulario.",
        en: "We are always looking to meet people with an entrepreneurial mindset and a drive to build. If this way of working feels like you, fill out the form.",
        it: "Vogliamo sempre conoscere persone con mentalità imprenditoriale e voglia di costruire. Se senti che questo modo di lavorare fa per te, compila il modulo.",
      },
      button: { es: "Quiero sumarme", en: "I want to join", it: "Voglio unirmi" },
      href: "https://forms.gle/zYUFuXkNG5dsS9z17",
      image: "/assets/equipo/equipo-completo-v2.webp",
      imageAlt: { es: "Equipo completo de Pimentón", en: "The full Pimentón team", it: "Il team Pimentón al completo" },
    },
  },
  // Casos de Éxito (/casos hub + /casos/[slug] template). Chrome reutilizable
  // de la UI; el contenido de cada caso vive en data/casos.ts. Sólo .es por
  // ahora (el fallback ya muestra .es en EN).
  casos: {
    hub: {
      eyebrow: { es: "Casos de éxito", en: "Success stories", it: "Casi di successo" },
      heading: { es: "Resultados reales, no promesas.", en: "Real results, not promises.", it: "Risultati reali, non promesse." },
      headingAccent: { es: "Resultados", en: "Real results", it: "Risultati" },
      subtitle: {
        es: "Restaurantes que decidieron profesionalizar su delivery y lo convirtieron en un canal rentable. Estos son algunos de ellos.",
        en: "Restaurants that decided to professionalize their delivery and turned it into a profitable channel. Here are a few of them.",
        it: "Ristoranti che hanno deciso di professionalizzare il loro delivery e l'hanno trasformato in un canale redditizio. Eccone alcuni.",
      },
      // Banda de prueba social — datos sobrios y verificables de los casos.
      proof: [
        { value: "+200%", label: { es: "el mayor crecimiento", en: "the biggest growth", it: "la crescita maggiore" } },
        { value: "6", label: { es: "casos comprobables", en: "verifiable cases", it: "casi verificabili" } },
        { value: "4", label: { es: "países", en: "countries", it: "paesi" } },
      ],
      cardCta: { es: "Ver caso", en: "View case", it: "Vedi il caso" },
    },
    caso: {
      metricasEyebrow: { es: "Los números", en: "The numbers", it: "I numeri" },
      desafioHeading: { es: "El desafío", en: "The challenge", it: "La sfida" },
      desafioAccent: { es: "desafío", en: "challenge", it: "sfida" },
      approachHeading: { es: "Qué hicimos", en: "What we did", it: "Cosa abbiamo fatto" },
      approachAccent: { es: "hicimos", en: "did", it: "fatto" },
      resultadosHeading: { es: "Resultados en detalle", en: "Results in detail", it: "Risultati nel dettaglio" },
      resultadosAccent: { es: "detalle", en: "detail", it: "dettaglio" },
      conclusionHeading: { es: "Conclusión estratégica", en: "Strategic takeaway", it: "Conclusione strategica" },
      conclusionAccent: { es: "estratégica", en: "Strategic", it: "strategica" },
      otrosHeading: { es: "Ver otros casos", en: "See other cases", it: "Vedi altri casi" },
      otrosAccent: { es: "otros", en: "other", it: "altri" },
      backToHub: { es: "Ver todos los casos", en: "See all cases", it: "Vedi tutti i casi" },
    },
    // CTA de cierre reutilizable (hub + cada caso). Fondo coral, sin
    // resaltado en el heading, pill crema.
    cta: {
      heading: { es: "¿Quieres potenciar tu delivery?", en: "Want to boost your delivery?", it: "Vuoi potenziare il tuo delivery?" },
      headingAccent: { es: "" },
      description: {
        es: "Cada uno de estos casos empezó con una conversación.\nEl tuyo también puede empezar hoy.",
        en: "Every one of these cases started with a conversation.\nYours can start today, too.",
        it: "Ognuno di questi casi è iniziato con una conversazione.\nAnche il tuo può iniziare oggi.",
      },
      button: { es: "Hablemos", en: "Let's talk", it: "Parliamone" },
      href: "/contacto",
    },
  },
  // Blog /insights (hub editorial + template /insights/[slug]). Chrome
  // reutilizable; el contenido de los artículos vive en data/insights.ts.
  // Sólo .es por ahora (el fallback ya muestra .es en EN).
  insights: {
    hub: {
      eyebrow: { es: "Insights", en: "Insights", it: "Insights" },
      heading: { es: "Insights para un delivery más rentable.", en: "Insights for a more profitable delivery.", it: "Insights per un delivery più redditizio." },
      headingAccent: { es: "rentable", en: "profitable", it: "redditizio" },
      subtitle: {
        es: "Estrategia, datos y operación real de delivery. Lo que aprendemos gestionando cientos de restaurantes, sin vueltas y al grano.",
        en: "Strategy, data, and real delivery operations. What we learn managing hundreds of restaurants — straight to the point.",
        it: "Strategia, dati e operatività reale del delivery. Quello che impariamo gestendo centinaia di ristoranti, senza giri di parole.",
      },
    },
    readCta: { es: "Leer artículo", en: "Read article", it: "Leggi l'articolo" },
    backToHub: { es: "Volver a Insights", en: "Back to Insights", it: "Torna a Insights" },
    masArticulos: { es: "Más artículos", en: "More articles", it: "Altri articoli" },
    masArticulosAccent: { es: "Más", en: "More", it: "Altri" },
    // CTA custom para /insights (reusa CtaPotenciar). "aplicar" en dark.
    cta: {
      heading: { es: "¿Listo para aplicar esto en tu delivery?", en: "Ready to apply this to your delivery?", it: "Pronto ad applicarlo al tuo delivery?" },
      headingAccent: { es: "aplicar", en: "apply", it: "applicarlo" },
      description: {
        es: "Cada artículo nace de trabajo real con restaurantes.\nHablemos del tuyo.",
        en: "Every article comes from real work with restaurants.\nLet's talk about yours.",
        it: "Ogni articolo nasce dal lavoro reale con i ristoranti.\nParliamo del tuo.",
      },
      button: { es: "Hablemos", en: "Let's talk", it: "Parliamone" },
    },
  },
  nav: {
    menu: { es: "Menu", en: "Menu", it: "Menu" },
    close: { es: "Cerrar", en: "Close", it: "Chiudi" },
    ariaOpen: { es: "Abrir menú", en: "Open menu", it: "Apri menu" },
    ariaClose: { es: "Cerrar menú", en: "Close menu", it: "Chiudi menu" },
    ariaHome: { es: "Pimentón — Inicio", en: "Pimentón — Home", it: "Pimentón — Home" },
    ariaPrimaryNav: { es: "Menú principal", en: "Main menu", it: "Menu principale" },
    links: [
      { label: { es: "Inicio", en: "Home", it: "Home" }, href: "#" },
      {
        label: { es: "¿Cómo lo hacemos?", en: "How we do it", it: "Come lo facciamo?" },
        href: "/como-lo-hacemos",
      },
      {
        label: { es: "Nuestros Servicios", en: "Our Services", it: "I nostri servizi" },
        href: "/servicios",
      },
      {
        label: { es: "Casos de éxito", en: "Success stories", it: "Casi di successo" },
        href: "/casos",
      },
      { label: { es: "Insights", en: "Insights", it: "Insights" }, href: "/insights" },
      { label: { es: "Blog", en: "Blog", it: "Blog" }, href: "/blog" },
      { label: { es: "Nuestro equipo", en: "Our team", it: "Il nostro team" }, href: "/equipo" },
      { label: { es: "FAQ", en: "FAQ", it: "FAQ" }, href: "/faq" },
      { label: { es: "Contacto", en: "Contact", it: "Contatti" }, href: "/contacto" },
    ],
  },
  whatsapp: {
    fabOpen: {
      es: "Contactar por WhatsApp",
      en: "Contact us on WhatsApp",
      it: "Contattaci su WhatsApp",
    },
    fabClose: {
      es: "Cerrar selector de WhatsApp",
      en: "Close WhatsApp selector",
      it: "Chiudi selettore WhatsApp",
    },
    panelKicker: {
      es: "Escríbenos por WhatsApp",
      en: "Message us on WhatsApp",
      it: "Scrivici su WhatsApp",
    },
    panelTitle: { es: "Elige tu región", en: "Choose your region", it: "Scegli la tua regione" },
    optionAria: {
      es: "Escribir por WhatsApp a",
      en: "Message on WhatsApp:",
      it: "Scrivi su WhatsApp a",
    },
  },
  footer: {
    tagline: {
      es: "Transformamos el delivery en un canal rentable, predecible y profesional para restaurantes en LATAM y Europa.",
      en: "We transform delivery into a profitable, predictable and professional channel for restaurants in LATAM and Europe.",
      it: "Trasformiamo il delivery in un canale redditizio, prevedibile e professionale per i ristoranti in LATAM ed Europa.",
    },
    navHeading: { es: "Navegación", en: "Navigation", it: "Navigazione" },
    contactHeading: { es: "Contacto", en: "Contact", it: "Contatti" },
    // Phones regionales (WhatsApp). phoneRaw sin "+" ni espacios (tel:/wa.me).
    phones: [
      {
        region: { es: "LatAm", en: "LatAm", it: "LatAm" },
        phone: "+54 9 11 5703 5170",
        phoneRaw: "5491157035170",
      },
      {
        region: { es: "Europa", en: "Europe", it: "Europa" },
        phone: "+34 683 632 437",
        phoneRaw: "34683632437",
      },
      {
        region: { es: "USA", en: "USA", it: "USA" },
        phone: "+54 9 11 5703 5170",
        phoneRaw: "5491157035170",
      },
    ],
    email: "juanchi@pimenton.io",
    copyright: {
      es: "© 2026 Pimentón. Todos los derechos reservados.",
      en: "© 2026 Pimentón. All rights reserved.",
      it: "© 2026 Pimentón. Tutti i diritti riservati.",
    },
    credit: {
      label: { es: "Created by Deache.io", en: "Created by Deache.io", it: "Created by Deache.io" },
      href: "https://deache.io",
    },
    social: [
      {
        name: "LinkedIn",
        href: "https://www.linkedin.com/company/pimentóngrowth/",
      },
      { name: "Instagram", href: "https://www.instagram.com/pimenton.io/" },
      { name: "TikTok", href: "https://www.tiktok.com/@juanchihaun" },
      {
        name: "WhatsApp",
        href: "https://api.whatsapp.com/send/?phone=5491157035170",
      },
    ],
    links: [
      {
        label: { es: "¿Cómo lo hacemos?", en: "How we do it", it: "Come lo facciamo?" },
        href: "/como-lo-hacemos",
      },
      {
        label: { es: "Nuestros Servicios", en: "Our Services", it: "I nostri servizi" },
        href: "/servicios",
      },
      {
        label: { es: "Casos de éxito", en: "Success stories", it: "Casi di successo" },
        href: "/casos",
      },
      { label: { es: "Insights", en: "Insights", it: "Insights" }, href: "/insights" },
      { label: { es: "Blog", en: "Blog", it: "Blog" }, href: "/blog" },
      { label: { es: "Equipo", en: "Team", it: "Team" }, href: "/equipo" },
      { label: { es: "FAQ", en: "FAQ", it: "FAQ" }, href: "/faq" },
      { label: { es: "Contacto", en: "Contact", it: "Contatti" }, href: "/contacto" },
    ],
  },
} as const;

export type Copy = typeof copy;
