/**
 * Imágenes para la 3D Gallery (GallerySpecialists). El componente
 * cicla infinitamente, así que con 6 alcanza — cuando Pimentón sume
 * más, se agregan acá.
 *
 * Orden interleaveado comida → cocina → operación para que el ciclo
 * se sienta variado y no agrupe tres platos seguidos.
 *
 * NOTA: el filename real del veggie es `preparacion-pedido-veggie.webp`
 * (no `preparacion-veggie.webp`).
 */

export type GalleryImage = { src: string; alt: string };

export const galleryImages: GalleryImage[] = [
  { src: "/assets/gallery/plato-burguer.webp", alt: "Plato de burger gourmet" },
  {
    src: "/assets/gallery/preparacion-burguer.webp",
    alt: "Preparación de burger en cocina",
  },
  {
    src: "/assets/gallery/dashboard-analisis.webp",
    alt: "Dashboard de análisis Pimentón",
  },
  { src: "/assets/gallery/plato-sushi.webp", alt: "Plato de sushi premium" },
  {
    src: "/assets/gallery/preparacion-pedido-veggie.webp",
    alt: "Preparación de plato veggie",
  },
  {
    src: "/assets/gallery/repartidor-rappi.webp",
    alt: "Repartidor Rappi entregando pedido",
  },
];
