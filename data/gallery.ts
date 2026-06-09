/**
 * Imágenes para la 3D Gallery (GallerySpecialists). El componente
 * cicla infinitamente, así que con 6 alcanza — cuando Pimentón sume
 * más, se agregan acá.
 *
 * Orden interleaveado comida → cocina → operación para que el ciclo
 * se sienta variado y no agrupe tres platos seguidos.
 *
 * `alt` es bilingüe {es,en} (se resuelve con useT en el componente).
 */

export type GalleryImage = { src: string; alt: { es: string; en: string } };

export const galleryImages: GalleryImage[] = [
  {
    src: "/assets/gallery/plato-burguer.webp",
    alt: { es: "Plato de burger gourmet", en: "Gourmet burger plate" },
  },
  {
    src: "/assets/gallery/preparacion-burguer.webp",
    alt: {
      es: "Preparación de burger en cocina",
      en: "Burger being prepared in the kitchen",
    },
  },
  {
    src: "/assets/gallery/dashboard-analisis.webp",
    alt: {
      es: "Dashboard de análisis Pimentón",
      en: "Pimentón analytics dashboard",
    },
  },
  {
    src: "/assets/gallery/plato-sushi.webp",
    alt: { es: "Plato de sushi premium", en: "Premium sushi plate" },
  },
  {
    src: "/assets/gallery/preparacion-pedido-veggie.webp",
    alt: {
      es: "Preparación de plato veggie",
      en: "Veggie dish being prepared",
    },
  },
  {
    src: "/assets/gallery/repartidor-rappi.webp",
    alt: {
      es: "Repartidor Rappi entregando pedido",
      en: "Rappi courier delivering an order",
    },
  },
];
