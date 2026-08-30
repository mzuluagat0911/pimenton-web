# Plantilla de estructura del blog (SEO + GEO)

Optimizada para SEO y para GEO (ser citado por ChatGPT / Perplexity / AI Overviews).

## Formato
- Longitud objetivo: 1.100–1.500 palabras.
- `body_html`: solo `<h2>`, `<h3>`, `<p>`, `<ul>/<ol>` con `<li>`, `<strong>`,
  `<em>` y, opcionalmente, un `<div class="callout"><p>…</p></div>` para el
  bloque de producto/marca. NADA de `<h1>` (ese va aparte en headline), ni
  `<html>`, `<head>`, `<style>` ni scripts. HTML limpio y bien formado.
  No insertes imágenes ni gráficos: el renderizador adjunta portada, cifras
  y un gráfico según el tema del artículo.

## Estructura (en este orden dentro de body_html)
1. Introducción breve (1 párrafo): por qué importa el tema.
2. 3–5 secciones `<h2>` que cubran: el qué/por qué, el cómo (accionable),
   errores comunes, y cómo encaja el producto/servicio (en un `callout`).
3. NO incluyas el H1, la respuesta-primero ni las FAQ dentro de body_html:
   esos van en campos aparte (headline, answer_html, faq).

## Campos aparte
- `headline`: el H1, con la keyword de forma natural.
- `answer_html`: 2–3 frases que responden la pregunta central de una (esto es
  lo que la IA cita). Sin "en este artículo veremos".
- `faq`: 3–4 pares {q, a} basados en las preguntas relacionadas; respuestas de
  2–3 frases, autónomas y citables.
- `meta_description`: ≤155 caracteres, resume la respuesta directa.
- `slug`: corto, minúsculas, con guiones, basado en la keyword (en el idioma
  del artículo: es para español, en para inglés).

## GEO (obligatorio)
Respuesta-primero, definiciones explícitas ("X es …"), datos concretos, cada
sección legible como respuesta autónoma.

## Tono con food apps (obligatorio)
- Neutro: ni contra las apps ni a favor de una en particular.
- Está bien decir que sin medir P&L/comisiones/margen se puede perder dinero.
- No culpes a la plataforma; enfócate en decisión y gestión del restaurante.
- Evita lenguaje beligerante o clickbait anti-marketplace.
