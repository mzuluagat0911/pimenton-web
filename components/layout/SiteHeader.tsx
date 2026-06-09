"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";

/**
 * Rutas que arrancan con el header SÓLIDO oscuro desde el initial state
 * (no tienen hero detrás, así que un header transparente quedaría ilegible
 * sobre el fondo crema). Reusable: para sumar una ruta, agregala acá.
 */
const SOLID_HEADER_ROUTES = ["/contacto"];

/**
 * Wrapper del header global. Mantiene la lógica de variante FUERA del
 * componente Header (que sólo conoce la prop `forceSolid`): acá mapeamos
 * la ruta actual a la variante. El comportamiento por defecto (transparente
 * sobre hero → sólido al scrollear) queda intacto para el resto del sitio.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const forceSolid = SOLID_HEADER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  return <Header forceSolid={forceSolid} />;
}
