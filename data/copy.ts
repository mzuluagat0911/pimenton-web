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
    },
    headline: {
      es: "Potenciamos tu Delivery y optimizamos tus Canales Digitales.",
      en: "We supercharge your delivery, empowering your sales channels.",
    },
    headlineAccent: {
      es: "Potenciamos tu Delivery",
      en: "We supercharge your delivery,",
    },
    subhead: {
      es: "Somos la agencia número #1 del mundo en Restaurantes",
      en: "We are the #1 Restaurant Agency",
    },
    ctaPrimary: {
      label: { es: "Consultoría gratuita", en: "Free discovery call" },
      href: "#contacto",
    },
    ctaSecondary: {
      label: {
        es: "Hablar con un especialista",
        en: "Speak with a specialist",
      },
      href: "#contacto",
    },
    scrollLabel: { es: "Scroll", en: "Scroll" },
  },
  whereWeOperate: {
    eyebrow: { es: "Presencia global", en: "Global presence" },
    heading: {
      es: "Operamos delivery en +20 países.",
      en: "We run delivery in +20 countries.",
    },
    subheading: {
      es: "De LATAM a Europa, gestionamos el canal digital de restaurantes en todo el mundo.",
      en: "From LATAM to Europe, we manage restaurants' digital channel all over the world.",
    },
  },
  wall: {
    eyebrow: { es: "Quiénes confían en nosotros", en: "Who trusts us" },
    heading: {
      es: "Más de 500 restaurantes ya operan su delivery con Pimentón.",
      en: "Over 500 restaurants already run their delivery with Pimentón.",
    },
    headingAccent: { es: "500 restaurantes", en: "500 restaurants" },
  },
  stats: {
    items: [
      {
        label: { es: "Crecimiento Ventas", en: "Sales Growth" },
        caption: {
          es: "en los primeros tres meses",
          en: "in the first three months",
        },
        value: 30,
        prefix: "+",
        suffix: "%",
        bg: "coral",
        size: "large",
      },
      {
        label: { es: "Restaurantes", en: "Restaurants" },
        caption: { es: "confían en nosotros", en: "trust us" },
        value: 500,
        prefix: "+",
        suffix: "",
        bg: "mint",
        size: "small",
      },
      {
        label: { es: "Países", en: "Countries" },
        caption: {
          es: "Presencia en USA, LatAm y Europa",
          en: "Presence across the US, LatAm and Europe",
        },
        value: 20,
        prefix: "+",
        suffix: "",
        bg: "soft",
        size: "small",
      },
      {
        label: { es: "Rentabilidad", en: "Profitability" },
        caption: {
          es: "aumento promedio trimestral",
          en: "average quarterly increase",
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
    eyebrow: { es: "Nuestra tecnología", en: "Our technology" },
    heading: { es: "Control Room ®", en: "Control Room ®" },
    subheading: {
      es: "Tu delivery operado desde una sola pantalla.",
      en: "Your delivery, run from a single screen.",
    },
    watchLabel: { es: "Ver en acción", en: "Watch in action" },
    watchAria: {
      es: "Ver Control Room en acción",
      en: "Watch Control Room in action",
    },
    modalAria: { es: "Control Room en acción", en: "Control Room in action" },
    closeAria: { es: "Cerrar", en: "Close" },
    closeModalAria: { es: "Cerrar modal", en: "Close modal" },
  },
  marketStats: {
    heading: {
      es: "¿Por qué profesionalizar tu delivery?",
      en: "Key reasons to upgrade your delivery service.",
    },
    items: [
      {
        stat: { es: "1 pedido por semana", en: "1 order per week" },
        label: {
          es: "Gen Z y Millennials piden al menos una vez por semana.",
          en: "Gen Z and Millennials order at least once a week.",
        },
        icon: "pedido-semana",
      },
      {
        stat: { es: "+40%", en: "+40%" },
        label: {
          es: "Crecimiento interanual del delivery.",
          en: "Year-over-year delivery growth.",
        },
        icon: "facturacion",
      },
      {
        stat: { es: "8 de cada 10", en: "8 out of 10" },
        label: {
          es: "Personas leen reseñas antes de pedir.",
          en: "People read reviews before ordering.",
        },
        icon: "personas",
      },
      {
        stat: { es: "Nuevos Usuarios", en: "New Users" },
        label: {
          es: "Si no captamos clientes, la competencia lo hace.",
          en: "If we don't capture customers, the competition will.",
        },
        icon: "impresiones",
      },
    ],
  },
  comparison: {
    heading: {
      es: "Tu delivery cambia cuando alguien lo opera en serio.",
      en: "Your delivery changes when someone runs it for real.",
    },
    off: {
      title: { es: "Sin Pimentón", en: "Without Pimentón" },
      footer: { es: "A ciegas", en: "Flying blind" },
      toggleKicker: { es: "Prueba la diferencia", en: "See the difference" },
      toggleLabel: { es: "Activa Pimentón", en: "Turn on Pimentón" },
    },
    on: {
      title: { es: "Con Pimentón", en: "With Pimentón" },
      footer: { es: "Con datos reales", en: "With real data" },
      toggleKicker: { es: "Pimentón activo", en: "Pimentón on" },
      toggleLabel: { es: "Toca para desactivar", en: "Tap to turn off" },
    },
    footerLabel: { es: "Decisiones de canal", en: "Channel decisions" },
    toggleAria: {
      es: "Activar Pimentón en mi delivery",
      en: "Turn on Pimentón for my delivery",
    },
    items: [
      {
        off: {
          es: "Solo frente a las apps: la operación, las negociaciones y los problemas recaen en tu equipo.",
          en: "Alone against the apps: operations, negotiations and problems all land on your team.",
        },
        on: {
          es: "Gestión del día a día del Delivery y relación con las aplicaciones: un equipo de especialistas a cargo de tu negocio.",
          en: "Day-to-day delivery management and app relationships: a team of specialists running your business.",
        },
      },
      {
        off: {
          es: "Datos dispersos entre apps, planillas y pantallas: imposible tomar decisiones en tiempo real.",
          en: "Data scattered across apps, spreadsheets and screens: impossible to decide in real time.",
        },
        on: {
          es: "Dashboards en tiempo real con ventas, operaciones, funnel y principales métricas económicas.",
          en: "Real-time dashboards with sales, operations, funnel and key economic metrics.",
        },
      },
      {
        off: {
          es: "Precios desactualizados, stock fuera de control y caídas de conectividad que descubres cuando el cliente reclama.",
          en: "Outdated prices, stock out of control and connectivity outages you only catch when a customer complains.",
        },
        on: {
          es: "Estrategia de precios, control de stocks y monitoreo de conectividad.",
          en: "Pricing strategy, stock control and connectivity monitoring.",
        },
      },
      {
        off: {
          es: "Reseñas negativas sin respuesta y reclamos sin gestionar: cada incidencia te baja el ranking y la facturación.",
          en: "Negative reviews left unanswered and complaints unmanaged: every incident drops your ranking and revenue.",
        },
        on: {
          es: "Moderación de reseñas, reclamos e incidencias.",
          en: "Review, complaint and incident management.",
        },
      },
      {
        off: {
          es: "Promos improvisadas sin estrategia: cada mes se reinventa el plan y el crecimiento nunca llega.",
          en: "Improvised promos with no strategy: every month the plan resets and growth never comes.",
        },
        on: {
          es: "Planificación de campañas y estrategias de crecimiento.",
          en: "Campaign planning and growth strategies.",
        },
      },
    ],
  },
  servicesTeaser: {},
  services: {
    eyebrow: { es: "Nuestros servicios", en: "Our services" },
    heading: {
      es: "Una unidad de negocio completa, no un servicio más.",
      en: "A complete business unit, not just another service.",
    },
    cta: {
      label: { es: "Contáctanos", en: "Contact us" },
      href: "#contacto",
    },
    items: [
      {
        num: "01",
        name: { es: "Gestión Integral", en: "End-to-End Management" },
        description: {
          es: "Nos hacemos cargo del Delivery de punta a punta: equipo, análisis, estrategia, ejecución y seguimiento diario. Con foco en crecimiento y rentabilidad.",
          en: "We take over your Delivery end to end: team, analytics, strategy, execution and daily follow-up. Focused on growth and profitability.",
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
        name: { es: "Consultoría", en: "Consulting" },
        description: {
          es: "Trabajamos proyectos a medida en base a las necesidades de tu Restaurante, definiendo objetivos claros y metodologías ágiles.",
          en: "We build tailored projects around your restaurant's needs, with clear goals and agile methodologies.",
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
        name: { es: "Performance", en: "Performance" },
        description: {
          es: "Optimizamos lo que más impacta en tus ventas: visibilidad, conversión, ticket promedio y recompra. Ajustes constantes, decisiones rápidas.",
          en: "We optimize what moves your sales most: visibility, conversion, average ticket and repeat orders. Constant tuning, fast decisions.",
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
        name: { es: "Estrategia", en: "Strategy" },
        description: {
          es: "Definimos en conjunto la combinación perfecta entre operaciones, marketing, procesos y rentabilidad que se ajuste a tu negocio.",
          en: "Together we define the right mix of operations, marketing, processes and profitability for your business.",
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
        name: { es: "Tecnología", en: "Technology" },
        description: {
          es: "Utilizamos data de las Food Apps y canales digitales para disponer en tiempo real de toda la información que tu Restaurante necesita para la toma de decisiones.",
          en: "We use data from Foodapps and digital channels to surface, in real time, all the information your restaurant needs to make decisions.",
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
    starsAria: { es: "5 estrellas", en: "5 stars" },
    intro: {
      brand: "Pimentón",
      heading: { es: "Lo que dicen de nosotros", en: "What they say about us" },
      subheading: {
        es: "No prometemos crecimiento. Lo demostramos en números.",
        en: "We don't promise growth. We prove it in numbers.",
      },
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
            },
          },
          {
            value: 3000,
            prefix: "+",
            suffix: "",
            label: { es: "Pedidos recuperados", en: "Recovered orders" },
          },
        ],
        name: "Valeyr Turjeman",
        brand: "Mr. Noodles",
        role: { es: "Directora General", en: "General Manager" },
      },
      {
        quote:
          "Las herramientas y paneles nos ayudaron a consolidar todo el negocio digital en un solo lugar, agilizando nuestra toma de decisiones.",
        metrics: [
          {
            value: 4,
            prefix: "",
            suffix: "",
            label: { es: "Canales integrados", en: "Integrated channels" },
          },
          {
            value: 10,
            prefix: "+",
            suffix: "%",
            label: { es: "Aumento facturación", en: "Revenue increase" },
          },
        ],
        name: "Bruno González Calvo",
        brand: "Grosso Napoletano",
        role: {
          es: "Partner & Managing Director",
          en: "Partner & Managing Director",
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
            label: { es: "Crecimiento YoY", en: "YoY growth" },
          },
          {
            value: 2,
            prefix: "+",
            suffix: "",
            label: { es: "Franquicias", en: "Franchises" },
          },
        ],
        name: "Carlos Estevez Rozas",
        brand: "Jekes Kebabs",
        role: { es: "Partner & CEO", en: "Partner & CEO" },
      },
    ],
  },
  ctaFinal: {},
  consultancy: {
    eyebrow: { es: "Empecemos", en: "Let's start" },
    heading: {
      es: "Consultoría gratuita en 4 pasos.",
      en: "Free Consultancy in 4 steps.",
    },
    subheading: {
      es: "Cuéntanos sobre tu restaurante y un especialista de tu región te escribe por WhatsApp.",
      en: "Tell us about your restaurant and a specialist from your region will reach out on WhatsApp.",
    },
    socialProof: {
      es: "+500 restaurantes confían en Pimentón",
      en: "+500 restaurants trust Pimentón",
    },
    bullets: [
      {
        es: "Consultoría sin cargo y sin compromiso",
        en: "Free Consultancy, no strings attached",
      },
      {
        es: "Hablas con un especialista de tu región",
        en: "Talk to a specialist from your region",
      },
      { es: "Respuesta directa por WhatsApp", en: "Direct reply on WhatsApp" },
    ],
  },
  consultationForm: {
    intro: {
      eyebrow: { es: "Empecemos", en: "Let's start" },
      heading: {
        es: "Consultoría gratuita en 4 pasos.",
        en: "Free Consultancy in 4 steps.",
      },
      headingAccent: { es: "en 4 pasos.", en: "in 4 steps." },
      description: {
        es: "Cuéntanos sobre tu Restaurante y un especialista te contactará por WhatsApp.",
        en: "Tell us about your Restaurant and a specialist will contact you on WhatsApp.",
      },
      socialProof: {
        es: "+500 restaurantes confían en Pimentón",
        en: "+500 restaurants trust Pimentón",
      },
      bullets: [
        {
          es: "Consultoría sin cargo y sin compromiso",
          en: "Free Consultancy, no strings attached",
        },
        {
          es: "Hablas con un especialista de tu región",
          en: "Talk to a specialist from your region",
        },
        {
          es: "Respuesta directa por WhatsApp",
          en: "Direct reply on WhatsApp",
        },
      ],
    },
    aria: {
      categories: { es: "Categorías", en: "Categories" },
      searchCountry: { es: "Buscar país", en: "Search country" },
      countryList: { es: "Lista de países", en: "Country list" },
      sizeGroup: {
        es: "Tamaño de la operación",
        en: "Operation size",
      },
    },
    step1: {
      label: { es: "Paso 1 de 4", en: "Step 1 of 4" },
      title: { es: "Elige tu categoría", en: "Choose your category" },
      titleAccent: { es: "tu categoría", en: "your category" },
      helper: {
        es: "Puedes seleccionar más de una.",
        en: "You can select more than one.",
      },
    },
    step2: {
      label: { es: "Paso 2 de 4", en: "Step 2 of 4" },
      title: {
        es: "¿Dónde está tu negocio?",
        en: "Where is your business?",
      },
      titleAccent: { es: "tu negocio?", en: "your business?" },
      otherLabel: { es: "Otro país", en: "Other country" },
      searchPlaceholder: { es: "Buscar país…", en: "Search country…" },
      emptyState: {
        es: "No encontramos ese país.",
        en: "We couldn't find that country.",
      },
    },
    step3: {
      label: { es: "Paso 3 de 4", en: "Step 3 of 4" },
      title: {
        es: "¿Cuántos locales tienes?",
        en: "How many locations do you have?",
      },
      titleAccent: { es: "locales", en: "locations" },
    },
    step4: {
      label: { es: "Paso 4 de 4", en: "Step 4 of 4" },
      title: { es: "Déjanos tus datos", en: "Leave us your details" },
      titleAccent: { es: "tus datos", en: "your details" },
      restaurantLabel: {
        es: "Nombre del restaurante",
        en: "Restaurant name",
      },
      restaurantPlaceholder: { es: "Brasa & Fuego", en: "Brasa & Fuego" },
      phoneLabel: { es: "Número de móvil", en: "Mobile number" },
      phonePlaceholder: {
        es: "+54 9 11 1234 5678",
        en: "+54 9 11 1234 5678",
      },
      phoneHint: {
        es: "Te escribimos por WhatsApp en las próximas horas. Nada de spam.",
        en: "We'll message you on WhatsApp within hours. No spam.",
      },
      instagramLabel: { es: "Instagram", en: "Instagram" },
      instagramPlaceholder: { es: "turestaurante", en: "yourrestaurant" },
      instagramOptional: { es: "opcional", en: "optional" },
      submitLabel: {
        es: "Enviar y abrir WhatsApp",
        en: "Send and open WhatsApp",
      },
    },
    nav: {
      back: { es: "Atrás", en: "Back" },
      next: { es: "Siguiente", en: "Next" },
    },
    validation: {
      category: {
        es: "Elige al menos una categoría.",
        en: "Choose at least one category.",
      },
      country: { es: "Elige tu país.", en: "Choose your country." },
      size: {
        es: "Elige el tamaño de tu operación.",
        en: "Choose your operation size.",
      },
      restaurant: {
        es: "Ingresa el nombre de tu restaurante.",
        en: "Enter your restaurant name.",
      },
      phone: {
        es: "Ingresa un número de teléfono válido.",
        en: "Enter a valid phone number.",
      },
    },
    success: {
      // "{restaurant}" se reemplaza en render con el nombre cargado.
      title: { es: "¡Listo, {restaurant}!", en: "You're all set, {restaurant}!" },
      titleFallback: { es: "¡Listo!", en: "All set!" },
      description: {
        es: "Te llevamos a WhatsApp con tu mensaje listo. Un especialista de tu región te responde en las próximas horas.",
        en: "We're taking you to WhatsApp with your message ready. A specialist from your region will reply within hours.",
      },
      cta: { es: "Abrir WhatsApp", en: "Open WhatsApp" },
    },
  },
  gallery: {
    images: [
      {
        src: null,
        alt: {
          es: "Cocina de restaurante en plena operación",
          en: "Restaurant kitchen in full operation",
        },
      },
      {
        src: null,
        alt: {
          es: "Repartidor saliendo a delivery",
          en: "Courier heading out for delivery",
        },
      },
      {
        src: null,
        alt: {
          es: "Plato emplatado, foto cenital",
          en: "Plated dish, overhead shot",
        },
      },
      {
        src: null,
        alt: {
          es: "Hamburguesa gourmet, primer plano",
          en: "Gourmet burger, close-up",
        },
      },
      {
        src: null,
        alt: {
          es: "Repartidor entregando el pedido",
          en: "Courier handing over the order",
        },
      },
      {
        src: null,
        alt: {
          es: "Equipo trabajando en cocina",
          en: "Team working in the kitchen",
        },
      },
    ],
  },
  specialists: {
    galleryHeading: {
      es: "Especialistas en delivery,",
      en: "Delivery specialists,",
    },
    phrase1: {
      text: {
        es: "No necesitas más pedidos. Necesitas mejores decisiones.",
        en: "You don't need more orders. You need better decisions.",
      },
      highlight: { es: "mejores decisiones", en: "better decisions" },
    },
    phrase2: {
      text: {
        es: "Somos especialistas en convertir tu delivery en una unidad de negocio rentable.",
        en: "We're specialists at turning your delivery into a profitable business unit.",
      },
      highlight: {
        es: "unidad de negocio rentable",
        en: "profitable business unit",
      },
    },
  },
  // Página /equipo (Cultura Pimentón). Sólo .es por ahora; el .en se suma
  // en la próxima tanda de traducción (el fallback ya muestra .es en EN).
  equipo: {
    hero: {
      eyebrow: { es: "Cultura Pimentón", en: "Pimentón Culture" },
    },
    manifesto: {
      // \n = quiebre de línea forzado en desktop (ver FraseManifiesto);
      // en pantallas chicas el texto fluye con text-balance (sin huérfanos).
      text: {
        es: "Crecer implica\naprender todo el tiempo.",
        en: "Growing means\nlearning all the time.",
      },
      accent: { es: "aprender", en: "learning" },
    },
    valores: {
      rows: [
        {
          heading: { es: "Nos movemos con adaptabilidad", en: "We move with adaptability" },
          accent: { es: "adaptabilidad", en: "adaptability" },
          paragraph: {
            es: "Entregamos con calidad, priorizando lo que importa y orientando cada acción a resultados concretos. Leemos el contexto, ajustamos rápido y seguimos.",
            en: "We deliver with quality, prioritizing what matters and steering every action toward concrete results. We read the context, adjust fast, and keep going.",
          },
          image: "/assets/equipo/equipo-valor-1-v2.webp",
          alt: { es: "Equipo Pimentón colaborando", en: "Pimentón team collaborating" },
        },
        {
          heading: { es: "Somos protagonistas", en: "We take ownership" },
          accent: { es: "protagonistas", en: "ownership" },
          paragraph: {
            es: "Hacemos que las cosas pasen, nos involucramos y resolvemos en equipo. El compromiso se nota en la acción y en la responsabilidad compartida.",
            en: "We make things happen, we get involved, and we solve as a team. Commitment shows in the action and in shared responsibility.",
          },
          image: "/assets/equipo/equipo-valor-2-v2.webp",
          alt: { es: "Equipo Pimentón en plena operación", en: "Pimentón team in full operation" },
        },
        {
          heading: { es: "El respeto atraviesa todo", en: "Respect runs through everything" },
          accent: { es: "respeto", en: "Respect" },
          paragraph: {
            es: "Nos comunicamos con honestidad, escuchamos activamente y valoramos las ideas por sobre las jerarquías. Debatimos con intención y construimos una cultura directa, humana y adulta.",
            en: "We communicate honestly, listen actively, and value ideas over hierarchy. We debate with intention and build a direct, human, grown-up culture.",
          },
          image: "/assets/equipo/equipo-valor-3-v2.webp",
          alt: { es: "Cultura de respeto en Pimentón", en: "A culture of respect at Pimentón" },
        },
      ],
    },
    modelo: {
      heading: { es: "Cómo acompañamos este modelo", en: "How we support this model" },
      headingAccent: { es: "acompañamos", en: "support" },
      cards: [
        { title: { es: "Trabajo distribuido y flexible", en: "Distributed, flexible work" }, icon: "laptop" },
        {
          title: { es: "Compensación alineada a impacto y resultados", en: "Compensation tied to impact and results" },
          icon: "trending-up",
        },
        {
          title: {
            es: "Reconocimiento por contribuir al crecimiento del negocio",
            en: "Recognition for contributing to business growth",
          },
          icon: "award",
        },
        {
          title: { es: "Descanso coordinado en función del equipo", en: "Time off coordinated around the team" },
          icon: "calendar",
        },
      ],
    },
    partners: {
      eyebrow: { es: "Operamos con todo el ecosistema", en: "We operate across the whole ecosystem" },
    },
    cta: {
      heading: { es: "¿Quieres sumarte a Pimentón?", en: "Want to join Pimentón?" },
      headingAccent: { es: "sumarte", en: "join" },
      description: {
        es: "Siempre queremos conocer personas con mentalidad emprendedora y ganas de construir. Si sientes que este modelo de trabajo va contigo, completa el formulario.",
        en: "We are always looking to meet people with an entrepreneurial mindset and a drive to build. If this way of working feels like you, fill out the form.",
      },
      button: { es: "Quiero sumarme", en: "I want to join" },
      href: "https://forms.gle/zYUFuXkNG5dsS9z17",
      image: "/assets/equipo/equipo-completo-v2.webp",
      imageAlt: { es: "Equipo completo de Pimentón", en: "The full Pimentón team" },
    },
  },
  // Casos de Éxito (/casos hub + /casos/[slug] template). Chrome reutilizable
  // de la UI; el contenido de cada caso vive en data/casos.ts. Sólo .es por
  // ahora (el fallback ya muestra .es en EN).
  casos: {
    hub: {
      eyebrow: { es: "Casos de éxito", en: "Success stories" },
      heading: { es: "Resultados reales, no promesas.", en: "Real results, not promises." },
      headingAccent: { es: "Resultados", en: "Real results" },
      subtitle: {
        es: "Restaurantes que decidieron profesionalizar su delivery y lo convirtieron en un canal rentable. Estos son algunos de ellos.",
        en: "Restaurants that decided to professionalize their delivery and turned it into a profitable channel. Here are a few of them.",
      },
      // Banda de prueba social — datos sobrios y verificables de los casos.
      proof: [
        { value: "+200%", label: { es: "el mayor crecimiento", en: "the biggest growth" } },
        { value: "6", label: { es: "casos comprobables", en: "verifiable cases" } },
        { value: "4", label: { es: "países", en: "countries" } },
      ],
      cardCta: { es: "Ver caso", en: "View case" },
    },
    caso: {
      metricasEyebrow: { es: "Los números", en: "The numbers" },
      desafioHeading: { es: "El desafío", en: "The challenge" },
      desafioAccent: { es: "desafío", en: "challenge" },
      approachHeading: { es: "Qué hicimos", en: "What we did" },
      approachAccent: { es: "hicimos", en: "did" },
      resultadosHeading: { es: "Resultados en detalle", en: "Results in detail" },
      resultadosAccent: { es: "detalle", en: "detail" },
      conclusionHeading: { es: "Conclusión estratégica", en: "Strategic takeaway" },
      conclusionAccent: { es: "estratégica", en: "Strategic" },
      otrosHeading: { es: "Ver otros casos", en: "See other cases" },
      otrosAccent: { es: "otros", en: "other" },
      backToHub: { es: "Ver todos los casos", en: "See all cases" },
    },
    // CTA de cierre reutilizable (hub + cada caso). Fondo coral, sin
    // resaltado en el heading, pill crema.
    cta: {
      heading: { es: "¿Quieres potenciar tu delivery?", en: "Want to boost your delivery?" },
      headingAccent: { es: "" },
      description: {
        es: "Cada uno de estos casos empezó con una conversación.\nEl tuyo también puede empezar hoy.",
        en: "Every one of these cases started with a conversation.\nYours can start today, too.",
      },
      button: { es: "Hablemos", en: "Let's talk" },
      href: "/contacto",
    },
  },
  // Blog /insights (hub editorial + template /insights/[slug]). Chrome
  // reutilizable; el contenido de los artículos vive en data/insights.ts.
  // Sólo .es por ahora (el fallback ya muestra .es en EN).
  insights: {
    hub: {
      eyebrow: { es: "Insights", en: "Insights" },
      heading: { es: "Insights para un delivery más rentable.", en: "Insights for a more profitable delivery." },
      headingAccent: { es: "rentable", en: "profitable" },
      subtitle: {
        es: "Estrategia, datos y operación real de delivery. Lo que aprendemos gestionando cientos de restaurantes, sin vueltas y al grano.",
        en: "Strategy, data, and real delivery operations. What we learn managing hundreds of restaurants — straight to the point.",
      },
    },
    readCta: { es: "Leer artículo", en: "Read article" },
    backToHub: { es: "Volver a Insights", en: "Back to Insights" },
    masArticulos: { es: "Más artículos", en: "More articles" },
    masArticulosAccent: { es: "Más", en: "More" },
    // CTA custom para /insights (reusa CtaPotenciar). "aplicar" en dark.
    cta: {
      heading: { es: "¿Listo para aplicar esto en tu delivery?", en: "Ready to apply this to your delivery?" },
      headingAccent: { es: "aplicar", en: "apply" },
      description: {
        es: "Cada artículo nace de trabajo real con restaurantes.\nHablemos del tuyo.",
        en: "Every article comes from real work with restaurants.\nLet's talk about yours.",
      },
      button: { es: "Hablemos", en: "Let's talk" },
    },
  },
  nav: {
    menu: { es: "Menu", en: "Menu" },
    close: { es: "Cerrar", en: "Close" },
    ariaOpen: { es: "Abrir menú", en: "Open menu" },
    ariaClose: { es: "Cerrar menú", en: "Close menu" },
    ariaHome: { es: "Pimentón — Inicio", en: "Pimentón — Home" },
    ariaPrimaryNav: { es: "Menú principal", en: "Main menu" },
    links: [
      { label: { es: "Inicio", en: "Home" }, href: "#" },
      {
        label: { es: "¿Cómo lo hacemos?", en: "How we do it" },
        href: "/como-lo-hacemos",
      },
      {
        label: { es: "Nuestros Servicios", en: "Our Services" },
        href: "/servicios",
      },
      {
        label: { es: "Casos de éxito", en: "Success stories" },
        href: "/casos",
      },
      { label: { es: "Insights", en: "Insights" }, href: "/insights" },
      { label: { es: "Nuestro equipo", en: "Our team" }, href: "/equipo" },
      { label: { es: "FAQ", en: "FAQ" }, href: "/faq" },
      { label: { es: "Contacto", en: "Contact" }, href: "/contacto" },
    ],
  },
  whatsapp: {
    fabOpen: {
      es: "Contactar por WhatsApp",
      en: "Contact us on WhatsApp",
    },
    fabClose: {
      es: "Cerrar selector de WhatsApp",
      en: "Close WhatsApp selector",
    },
    panelKicker: {
      es: "Escríbenos por WhatsApp",
      en: "Message us on WhatsApp",
    },
    panelTitle: { es: "Elige tu región", en: "Choose your region" },
    optionAria: {
      es: "Escribir por WhatsApp a",
      en: "Message on WhatsApp:",
    },
  },
  footer: {
    tagline: {
      es: "Transformamos el delivery en un canal rentable, predecible y profesional para restaurantes en LATAM y Europa.",
      en: "We transform delivery into a profitable, predictable and professional channel for restaurants in LATAM and Europe.",
    },
    navHeading: { es: "Navegación", en: "Navigation" },
    contactHeading: { es: "Contacto", en: "Contact" },
    // Phones regionales (WhatsApp). phoneRaw sin "+" ni espacios (tel:/wa.me).
    phones: [
      {
        region: { es: "LatAm", en: "LatAm" },
        phone: "+54 9 11 5703 5170",
        phoneRaw: "5491157035170",
      },
      {
        region: { es: "Europa", en: "Europe" },
        phone: "+34 683 632 437",
        phoneRaw: "34683632437",
      },
      {
        region: { es: "USA", en: "USA" },
        phone: "+54 9 11 4042 5909",
        phoneRaw: "5491140425909",
      },
    ],
    email: "juanchi@pimenton.io",
    copyright: {
      es: "© 2026 Pimentón. Todos los derechos reservados.",
      en: "© 2026 Pimentón. All rights reserved.",
    },
    credit: {
      label: { es: "Created by Deache.io", en: "Created by Deache.io" },
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
        label: { es: "¿Cómo lo hacemos?", en: "How we do it" },
        href: "/como-lo-hacemos",
      },
      {
        label: { es: "Nuestros Servicios", en: "Our Services" },
        href: "/servicios",
      },
      {
        label: { es: "Casos de éxito", en: "Success stories" },
        href: "/casos",
      },
      { label: { es: "Insights", en: "Insights" }, href: "/insights" },
      { label: { es: "Equipo", en: "Team" }, href: "/equipo" },
      { label: { es: "FAQ", en: "FAQ" }, href: "/faq" },
      { label: { es: "Contacto", en: "Contact" }, href: "/contacto" },
    ],
  },
} as const;

export type Copy = typeof copy;
