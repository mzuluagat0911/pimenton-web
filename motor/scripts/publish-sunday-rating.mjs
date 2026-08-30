process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "sk-local-publish";
process.env.SITE_URL = process.env.SITE_URL || "https://pimenton.io";

const { publishDrafts, rebuildIndex } = await import("../src/agents/publisher.js");
const { loadState, saveState, markPublished } = await import("../src/lib/state.js");

const idea = {
  keyword_primary: "cómo recuperar rating delivery multi-sucursal",
  keywords_secondary: [
    "recuperar puntuación apps delivery",
    "rating Rappi Uber Eats sucursal",
    "quejas delivery multi-sucursal",
  ],
  search_intent: "informacional",
  angle:
    "Playbook operativo de 48 horas para frenar y recuperar el rating de una sucursal en apps, sin pedir estrellas: causa, umbral, dueño de turno.",
  title_es: "Cómo recuperar el rating en apps de delivery cuando se cae una sucursal",
  title_en: "How to recover a delivery app rating when one location drops",
  related_questions: [
    "¿En cuánto tiempo se recupera el rating de una sucursal?",
    "¿Hay que pedir reseñas de 5 estrellas para subir el rating?",
    "¿Qué quejas bajan más el rating en delivery?",
    "¿Cuándo abrir un war room por rating?",
  ],
  difficulty: "media",
  rationale: "Post del domingo 30 ago 2026 — carril Control Room, estructura visual nueva.",
};

const es = {
  title: "Cómo recuperar el rating en apps de delivery cuando se cae una sucursal",
  headline: "Cómo recuperar el rating en apps de delivery cuando se cae una sucursal",
  slug: "como-recuperar-rating-delivery-multi-sucursal",
  meta_description:
    "Recuperá el rating de una sucursal en 48 h: etiquetá quejas, umbral por local y playbook de tiempos, packing y pedido correcto. Sin pedir estrellas.",
  keywords: [
    "cómo recuperar rating delivery",
    "rating apps delivery multi-sucursal",
    "recuperar puntuación Rappi Uber Eats",
    "quejas delivery sucursal",
    "Control Room Pimentón",
  ],
  answer_html:
    "El rating de una sucursal no se recupera pidiendo 5 estrellas. Se recupera <strong>cerrando la causa operativa en 48 horas</strong> — tiempos, packing, pedido errado o 86 — con un umbral por local y un dueño de turno. El promedio de la cadena es maquillaje: el cliente puntúa un local.",
  body_html: `<p>Cuando el rating de una sucursal se cae en Rappi, Uber Eats, PedidosYa o DoorDash, el reflejo habitual es pedir reseñas o culpar a “la app”. Las dos cosas llegan tarde. El cliente ya comió frío, recibió el pedido incompleto o esperó de más. <strong>Recuperar el rating en apps de delivery</strong> es un problema de operación, no de reputación.</p>
<h2>Qué es una caída de rating (y qué no es)</h2>
<p>Una <strong>caída de rating</strong> es cuando el puntaje de un local —no el de la marca— baja de forma sostenida en unos pocos días, no un comentario aislado de 1 estrella. El número que importa es el de esa sucursal en esa app, en la ventana corta (7 y 30 días), no el promedio histórico de la cadena.</p>
<p>El rating es un <strong>indicador rezagado</strong>: refleja lo que ya pasó en cocina, packing y despacho. Si lo mirás una vez al mes, llegás cuando el local ya está en riesgo de bajar visibilidad. Si lo mirás cada mañana junto a tiempos y cancelaciones, todavía hay tiempo de frenar la hemorragia.</p>
<h2>Nunca promediés la cadena</h2>
<p>El error más caro en multi-sucursal es consolarse con el promedio. Una cadena en 4,6 puede tener un local en 4,1 que está empujando hacia abajo el ranking de ese punto y, a veces, el de los vecinos si comparten zona.</p>
<ul>
<li>Mirá <strong>rating por sucursal y por app</strong>, no un KPI único.</li>
<li>Compará 7 días vs 30 días: si el corto está peor que el largo, la caída es ahora.</li>
<li>Cruza el rating con <strong>volumen</strong>: 12 reseñas malas en un local de 80 pedidos/día no es lo mismo que 12 en uno de 15.</li>
</ul>
<p>Si no podés decir en 10 segundos qué local está en rojo y desde cuándo, no tenés control. Tenés un promedio.</p>
<h2>Las 4 causas que sí mueven estrellas</h2>
<p>Antes del playbook, etiquetá. Pedí las últimas 20 reseñas bajas de esa sucursal y clasificalas. Sin causa, el equipo “mejora el servicio” en abstracto y el número no se mueve.</p>
<ul>
<li><strong>Tiempo / frío.</strong> Prep largo, ticket acumulado, rider esperando, comida que viaja mal. Es la causa más frecuente y la más medible.</li>
<li><strong>Pedido errado o incompleto.</strong> Item de más, de menos, salsa que no iba. Es un error de pase, no de “la app”.</li>
<li><strong>Packing.</strong> Derrame, bolsa abierta, sin cubiertos, postre aplastado. El cliente no ve tu cocina: ve el paquete.</li>
<li><strong>86 / ítem faltante.</strong> Se aceptó un pedido que no se podía completar. El 86 tiene que ser un dato, no un rumor del turno.</li>
</ul>
<p>Las quejas de “el rider” existen, pero en ops el primer movimiento es lo que controlás adentro. Si el 70% de las bajas son tiempo o packing, el war room no es contra la flota: es contra el pase.</p>
<h2>Playbook de 48 horas</h2>
<p>El objetivo de las primeras 48 horas no es “volver a 4,7”. Es <strong>frenar reseñas nuevas del mismo tipo</strong>. Si seguís produciendo el mismo error, pedir estrellas es ruido.</p>
<h3>Hora 0–2: aislar el local</h3>
<ul>
<li>Confirmá que el rojo es de <em>esa</em> sucursal, no de un promedio mal leído.</li>
<li>Bajá el ranking de causas de las reseñas de los últimos 7 días.</li>
<li>Nombrá un <strong>dueño de turno</strong> (no un comité). Uno. Con teléfono.</li>
</ul>
<h3>Hora 2–24: una palanca, no diez</h3>
<p>Elegí la causa #1 y mové solo eso:</p>
<ul>
<li>Si es tiempo: recortá menú del pico, 86 preventivo de lo lento, un runner de packing.</li>
<li>Si es pedido errado: ticket impreso + check de 5 segundos en el pase (ítems, salsas, cubiertos).</li>
<li>Si es packing: cambiar el empaque que falla y no despachar sin foto de bolsa cerrada en el pico.</li>
<li>Si es 86: pausar el SKU en la app en el momento, no “avisar a cocina”.</li>
</ul>
<h3>Hora 24–48: verificar con pedidos, no con esperanza</h3>
<p>El rating tarda en moverse. Lo que sí se mueve en 24–48 h es la <strong>materia prima del rating</strong>: tiempo de prep, % de pedidos incompletos, cancelaciones por stock. Si esos tres no mejoran, el rating no va a mejorar la semana que viene.</p>
<h2>Umbral: cuándo abrir war room</h2>
<p>Definí el umbral <em>antes</em> de la crisis. Ejemplos que funcionan en ops (ajustalos a tu red):</p>
<ul>
<li>Rating 7 días de un local cae <strong>0,2 puntos</strong> vs su propio 30 días.</li>
<li>O cruza un piso duro (el número a partir del cual esa app te empieza a esconder).</li>
<li>Y hay <strong>más de N reseñas bajas</strong> en 72 h, para no disparar por un outlier.</li>
</ul>
<p>El war room dura hasta que la causa #1 deja de aparecer en pedidos nuevos, no hasta que el promedio histórico sube. El promedio histórico es lento a propósito.</p>
<h2>Errores que alargan la caída</h2>
<ul>
<li><strong>Pedir 5 estrellas</strong> mientras seguís despachando tarde. El cliente puntualiza lo que acaba de vivir.</li>
<li><strong>Promediar locales</strong> y declarar que “la marca está bien”.</li>
<li><strong>Abrir 8 frentes</strong> el mismo día: menú, packing, staffing, ads. Nada cierra.</li>
<li><strong>Mirar el rating una vez a la semana</strong> y los tiempos nunca. El rating es el último en enterarse.</li>
<li><strong>Tratar al rider como villano por defecto</strong> sin mirar minutos de espera en puerta.</li>
</ul>
<div class="callout"><p><strong>Control Room</strong> es la mesa de control operativa de Pimentón: rating por sucursal (no el promedio), quejas etiquetadas y umbral para abrir war room antes de que el local desaparezca del ranking. ¿Se te cayó una sucursal esta semana? <a href="https://wa.me/5491140425909">Escribinos por WhatsApp</a> y vemos qué número mover primero.</p></div>`,
  faq: [
    {
      q: "¿En cuánto tiempo se recupera el rating de una sucursal?",
      a: "El puntaje publicado tarda días o semanas porque es un promedio. Lo que sí se recupera en 48 horas es la causa: tiempos, packing, pedido correcto y 86. Si esos indicadores no mejoran en dos días, el rating no va a mejorar la semana siguiente.",
    },
    {
      q: "¿Hay que pedir reseñas de 5 estrellas para subir el rating?",
      a: "No como primer movimiento. Pedir estrellas encima de una operación rota genera más reseñas del mismo problema. Primero frená la causa; las reseñas nuevas neutrales o buenas llegan solas cuando el pedido sale bien.",
    },
    {
      q: "¿Qué quejas bajan más el rating en delivery?",
      a: "En la mayoría de las redes, tiempo/comida fría, pedido errado o incompleto, packing (derrame, bolsa abierta) y 86/ítem faltante. Etiquetá las últimas 20 reseñas bajas del local en rojo: ese ranking es tu playbook, no una intuición.",
    },
    {
      q: "¿Cuándo abrir un war room por rating?",
      a: "Cuando el rating a 7 días de un local cae de forma sostenida contra su propio 30 días, o cruza un piso que define la app, y hay un volumen mínimo de reseñas bajas en 72 horas. Un outlier de 1 estrella no es war room; un patrón de la misma causa sí.",
    },
  ],
};

const en = {
  title: "How to recover a delivery app rating when one location drops",
  headline: "How to recover a delivery app rating when one location drops",
  slug: "recover-delivery-app-rating-multi-location",
  meta_description:
    "Recover a location's delivery-app rating in 48 hours: tag complaints, set a per-store threshold, and fix times, packing, and wrong orders — don't beg for stars.",
  keywords: [
    "recover delivery app rating",
    "multi-location delivery rating",
    "Uber Eats Rappi rating drop",
    "delivery complaints playbook",
    "Control Room Pimentón",
  ],
  answer_html:
    "A location's rating is not recovered by asking for 5 stars. It is recovered by <strong>closing the operational cause in 48 hours</strong> — times, packing, wrong orders, or 86s — with a per-store threshold and one shift owner. The chain average is makeup: the customer scores a store.",
  body_html: `<p>When one location's rating drops on Rappi, Uber Eats, PedidosYa, or DoorDash, the usual reflex is to ask for reviews or blame “the app.” Both arrive late. The customer already ate cold food, got an incomplete bag, or waited too long. <strong>Recovering a delivery app rating</strong> is an operations problem, not a reputation campaign.</p>
<h2>What a rating drop is (and what it isn't)</h2>
<p>A <strong>rating drop</strong> is when one store's score — not the brand's — falls in a short window, not a single 1-star review. The number that matters is that location, on that app, on a 7-day and 30-day window, not the chain's historic average.</p>
<p>Rating is a <strong>lagging indicator</strong>: it reflects what already happened in the kitchen, at packing, and at handoff. If you look at it once a month, you arrive when the store is already losing visibility. If you look at it every morning next to prep times and cancellations, you can still stop the bleed.</p>
<h2>Never average the chain</h2>
<p>The most expensive multi-location mistake is comforting yourself with the average. A 4.6 chain can hide a 4.1 store that is dragging that point's ranking — and sometimes neighbors that share a zone.</p>
<ul>
<li>Watch <strong>rating by location and by app</strong>, not one KPI.</li>
<li>Compare 7 days vs 30 days: if the short window is worse, the drop is now.</li>
<li>Cross rating with <strong>volume</strong>: 12 bad reviews on an 80-order store is not the same as 12 on a 15-order store.</li>
</ul>
<p>If you cannot say in 10 seconds which store is red and since when, you do not have control. You have an average.</p>
<h2>The 4 causes that actually move stars</h2>
<p>Before the playbook, tag. Pull the last 20 low reviews for that store and classify them. Without a cause, the team “improves service” in the abstract and the number does not move.</p>
<ul>
<li><strong>Time / cold food.</strong> Long prep, stacked tickets, rider waiting, food that travels badly. Most frequent, most measurable.</li>
<li><strong>Wrong or incomplete order.</strong> Extra item, missing item, the wrong sauce. That is a pass error, not “the app.”</li>
<li><strong>Packing.</strong> Spills, open bags, no utensils, crushed dessert. The customer never sees your kitchen: they see the bag.</li>
<li><strong>86 / missing item.</strong> The order was accepted when it could not be fulfilled. The 86 has to be a data point, not a shift rumor.</li>
</ul>
<p>Rider complaints exist, but ops moves first on what you control inside. If 70% of the lows are time or packing, the war room is not against the fleet: it is against the pass.</p>
<h2>The 48-hour playbook</h2>
<p>The goal of the first 48 hours is not “get back to 4.7.” It is <strong>stop new reviews of the same type</strong>. If you keep producing the same error, asking for stars is noise.</p>
<h3>Hour 0–2: isolate the store</h3>
<ul>
<li>Confirm the red is <em>that</em> location, not a misread average.</li>
<li>Rank causes from the last 7 days of reviews.</li>
<li>Name one <strong>shift owner</strong> (not a committee). One. With a phone.</li>
</ul>
<h3>Hour 2–24: one lever, not ten</h3>
<p>Pick cause #1 and move only that:</p>
<ul>
<li>If time: cut the peak menu, preventive 86 on the slow items, one packing runner.</li>
<li>If wrong order: printed ticket + a 5-second pass check (items, sauces, utensils).</li>
<li>If packing: change the failing package and do not dispatch in the peak without a closed-bag check.</li>
<li>If 86: pause the SKU in the app in the moment — do not “tell the kitchen.”</li>
</ul>
<h3>Hour 24–48: verify with orders, not hope</h3>
<p>Published rating is slow. What does move in 24–48 hours is the <strong>raw material of rating</strong>: prep time, % incomplete orders, stock cancellations. If those three do not improve, rating will not improve next week.</p>
<h2>Threshold: when to open a war room</h2>
<p>Set the threshold <em>before</em> the crisis. Examples that work in ops (tune them to your network):</p>
<ul>
<li>A store's 7-day rating drops <strong>0.2 points</strong> vs its own 30-day.</li>
<li>Or it crosses a hard floor (the number where that app starts hiding you).</li>
<li>And there are <strong>more than N low reviews</strong> in 72 hours, so one outlier does not page everyone.</li>
</ul>
<p>The war room runs until cause #1 stops showing up in new orders, not until the historic average ticks up. The historic average is slow on purpose.</p>
<h2>Mistakes that stretch the drop</h2>
<ul>
<li><strong>Asking for 5 stars</strong> while you still dispatch late. The customer rates what just happened.</li>
<li><strong>Averaging locations</strong> and declaring “the brand is fine.”</li>
<li><strong>Opening 8 fronts</strong> the same day: menu, packing, staffing, ads. Nothing closes.</li>
<li><strong>Watching rating weekly</strong> and times never. Rating is the last to find out.</li>
<li><strong>Defaulting to “the rider”</strong> without looking at door wait minutes.</li>
</ul>
<div class="callout"><p><strong>Control Room</strong> is Pimentón's ops control desk: rating by location (not the average), tagged complaints, and a threshold to open a war room before the store disappears from the ranking. Did a location drop this week? <a href="https://wa.me/5491140425909">Message us on WhatsApp</a> and we will pick the first number to move.</p></div>`,
  faq: [
    {
      q: "How long does it take to recover a store's delivery app rating?",
      a: "The published score takes days or weeks because it is an average. What you can recover in 48 hours is the cause: times, packing, correct orders, and 86s. If those metrics do not improve in two days, rating will not improve next week.",
    },
    {
      q: "Should we ask for 5-star reviews to lift the rating?",
      a: "Not as the first move. Asking for stars on top of a broken operation produces more reviews of the same problem. Stop the cause first; newer neutral or good reviews show up when the order leaves correctly.",
    },
    {
      q: "Which complaints drop delivery ratings the most?",
      a: "Across most networks: time/cold food, wrong or incomplete orders, packing (spills, open bags), and 86/missing items. Tag the last 20 low reviews from the red store: that ranking is your playbook, not a hunch.",
    },
    {
      q: "When should we open a war room for rating?",
      a: "When one store's 7-day rating falls steadily against its own 30-day, or crosses a floor the app cares about, and there is a minimum volume of low reviews in 72 hours. A single 1-star outlier is not a war room; a pattern of the same cause is.",
    },
  ],
};

const state = loadState();
if (state.covered["control-room"].includes(idea.keyword_primary)) {
  console.log("Skip: keyword already covered");
  process.exit(0);
}

const post = publishDrafts("control-room", idea, es, en, "2026-08-30");
markPublished(state, post);
rebuildIndex(state.published);
saveState(state);
console.log("OK", post.path, post.pathEn);
