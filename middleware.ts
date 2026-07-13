import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_HEADER,
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

    // Inject locale into the rewritten request so layout/generateMetadata
    // can read it via headers(). usePathname() alone loses /es|/en.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_HEADER, segment);

    const response = NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
