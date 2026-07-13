"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCopy, useLocalizedHref } from "@/components/i18n/LanguageContext";
import { isHomePath } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Header({ forceSolid = false }: { forceSolid?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduced = useReducedMotion() ?? false;
  const router = useRouter();
  const pathname = usePathname();
  const localizedHref = useLocalizedHref();
  const c = useCopy();
  const navLinks = c.nav.links;

  // Track scroll for backdrop + auto-hide. Hide when scrolling down past
  // the Hero, show when scrolling up — resolves the Control Room
  // ring being clipped by the fixed header (and reads as a clean
  // scrolling pattern site-wide).
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        const delta = y - lastY;
        if (Math.abs(delta) > 4) {
          if (delta > 0 && y > 160) setHidden(true);
          else setHidden(false);
          lastY = y;
        }
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Lock body scroll while the overlay is up
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ESC closes the overlay
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Click de link del menú. Maneja 3 casos:
  //  1. Ruta interna ("/servicios") → navegación client-side.
  //  2. Anchor ("#...") estando FUERA del Home → el ancla vive en el
  //     Home, así que navegamos al Home con el hash.
  //  3. Anchor estando EN el Home → smooth-scroll (Lenis o nativo).
  // setTimeout 50ms deja que React libere el overflow del body antes
  // de scrollear.
  const handleLinkClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);

    if (href.startsWith("/")) {
      router.push(localizedHref(href));
      return;
    }

    if (!isHomePath(pathname)) {
      router.push(href === "#" ? localizedHref("/") : localizedHref(href));
      return;
    }

    setTimeout(() => {
      const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
      if (lenis) {
        if (href === "#") lenis.scrollTo(0);
        else lenis.scrollTo(href, { offset: -64 });
        return;
      }
      if (href === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      document
        .querySelector(href)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          !open && hidden ? "-translate-y-full" : "translate-y-0"
        } ${
          !open && (scrolled || forceSolid)
            ? "bg-pimenton-dark"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 items-center justify-between px-[5%] sm:h-20 md:w-[90%] md:max-w-[1500px] md:px-0">
          <a
            href="#"
            onClick={handleLinkClick("#")}
            aria-label={c.nav.ariaHome}
            className="block transition-opacity hover:opacity-90"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logos/principal/logo-blanco.webp"
              alt="Pimentón"
              className="h-7 w-auto sm:h-8"
              draggable={false}
            />
          </a>

          <div className="flex items-center gap-4 sm:gap-6">
            <LanguageToggle />

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="primary-nav"
              aria-label={open ? c.nav.ariaClose : c.nav.ariaOpen}
              className="group inline-flex cursor-pointer items-center gap-3 text-pimenton-bg transition-opacity hover:opacity-80"
            >
              {/* Two-line hamburger that morphs into an X. Position-only
                  animation, transform-origin centered. */}
              <span aria-hidden className="relative block h-4 w-6">
                <motion.span
                  animate={{ rotate: open ? 45 : 0, y: open ? 0 : -3 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{ transformOrigin: "center" }}
                  className="absolute left-0 right-0 top-1/2 -translate-y-px block h-px bg-current"
                />
                <motion.span
                  animate={{ rotate: open ? -45 : 0, y: open ? 0 : 3 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{ transformOrigin: "center" }}
                  className="absolute left-0 right-0 top-1/2 -translate-y-px block h-px bg-current"
                />
              </span>
              <span className="text-base font-semibold tracking-tight sm:text-lg">
                {open ? c.nav.close : c.nav.menu}
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="primary-nav"
            key="overlay"
            role="dialog"
            aria-modal="true"
            aria-label={c.nav.ariaPrimaryNav}
            initial={
              reduced
                ? { opacity: 0 }
                : { clipPath: "circle(0% at calc(100% - 5rem) 2.5rem)" }
            }
            animate={
              reduced
                ? { opacity: 1 }
                : { clipPath: "circle(150% at calc(100% - 5rem) 2.5rem)" }
            }
            exit={
              reduced
                ? { opacity: 0 }
                : { clipPath: "circle(0% at calc(100% - 5rem) 2.5rem)" }
            }
            transition={{ duration: reduced ? 0.2 : 0.7, ease: EASE }}
            className="fixed inset-0 z-40 overflow-y-auto overflow-x-hidden overscroll-contain bg-pimenton-accent"
          >
            {/* min-h-full + overflow-y-auto: en pantallas muy bajas el menú
                scrollea en vez de cortar el contenido (p. ej. el mail). */}
            <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col justify-between gap-[clamp(1rem,3vh,2rem)] px-[5%] pb-8 pt-20 sm:px-16 sm:pb-10 sm:pt-24 md:w-[90%] md:max-w-[1500px] md:px-0">
              <nav className="flex flex-1 flex-col items-end justify-center gap-[clamp(0.25rem,1.5vh,0.75rem)] text-right">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={i}
                    href={localizedHref(link.href)}
                    onClick={handleLinkClick(link.href)}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{
                      delay: reduced ? 0 : 0.32 + i * 0.05,
                      duration: 0.45,
                      ease: EASE,
                    }}
                    className="font-sans text-[clamp(1.875rem,min(4.5vw,5.2vh),3rem)] font-semibold leading-[1.1] tracking-tight text-pimenton-bg transition-opacity duration-200 hover:opacity-80"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              <motion.div
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{
                  delay: reduced ? 0 : 0.32 + navLinks.length * 0.05,
                  duration: 0.45,
                  ease: EASE,
                }}
                className="flex flex-col gap-1 text-pimenton-bg"
              >
                <ul className="space-y-1">
                  {c.footer.phones.map((p) => (
                    <li
                      key={p.phoneRaw}
                      className="flex items-baseline gap-3 sm:gap-4"
                    >
                      <span className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] opacity-70 sm:text-xs">
                        {p.region}
                      </span>
                      <a
                        href={`tel:${p.phoneRaw}`}
                        className="text-sm transition-opacity hover:opacity-80 sm:text-base"
                      >
                        {p.phone}
                      </a>
                    </li>
                  ))}
                </ul>
                <a
                  href={`mailto:${c.footer.email}`}
                  className="mt-3 font-sans text-xl font-semibold transition-opacity hover:opacity-80 sm:text-2xl"
                >
                  {c.footer.email}
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
