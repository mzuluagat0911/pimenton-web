import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_LOCALE,
  isLocale,
  type Locale,
  withLocale,
} from "@/lib/i18n";

function detectLocale(request: NextRequest): Locale {
  const acceptLang = request.headers.get("accept-language") ?? "";
  if (acceptLang && !acceptLang.toLowerCase().startsWith("es")) return "en";
  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const segment = pathname.split("/")[1];
  if (isLocale(segment)) {
    const pathnameWithoutLocale =
      pathname.slice(segment.length + 1) || "/";
    const url = request.nextUrl.clone();
    url.pathname = pathnameWithoutLocale;
    // El rewrite oculta /es|/en de usePathname(); la cookie + el pathname
    // del browser son la fuente de verdad del idioma en el cliente.
    const response = NextResponse.rewrite(url);
    response.cookies.set("pimenton-lang", segment, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }

  const locale = pathname === "/" ? detectLocale(request) : DEFAULT_LOCALE;
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = withLocale(pathname, locale);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto:
     * - _next (build/static)
     * - archivos estáticos con extensión (favicon, imágenes, fuentes, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
