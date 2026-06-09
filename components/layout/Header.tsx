"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const NAV_LINKS = [
  { label: "Inicio", href: "#" },
  { label: "¿Cómo lo hacemos?", href: "/como-lo-hacemos" },
  { label: "Nuestros Servicios", href: "/servicios" },
  { label: "Casos de éxito", href: "#testimonios" },
  { label: "Insights", href: "#" },
  { label: "Nuestro equipo", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "Contacto", href: "#contacto" },
];

const CONTACTS = {
  phones: [
    { region: "LatAm", phone: "+54 9 11 5703 5170", phoneRaw: "5491157035170" },
    { region: "Europe", phone: "+34 683 632 437", phoneRaw: "34683632437" },
    { region: "USA", phone: "+54 9 11 4042 5909", phoneRaw: "5491140425909" },
  ],
  email: "juanchi@pimenton.io",
};

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduced = useReducedMotion() ?? false;
  const router = useRouter();
  const pathname = usePathname();

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
      router.push(href);
      return;
    }

    if (pathname !== "/") {
      router.push(href === "#" ? "/" : `/${href}`);
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
          !open && scrolled ? "bg-pimenton-dark" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 items-center justify-between px-[5%] sm:h-20 md:w-[90%] md:max-w-[1500px] md:px-0">
          <a
            href="#"
            onClick={handleLinkClick("#")}
            aria-label="Pimentón — Inicio"
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

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="primary-nav"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="group inline-flex cursor-pointer items-center gap-3 text-pimenton-bg transition-opacity hover:opacity-80"
          >
            {/* Two-line hamburger that morphs into an X. Position-only
                animation, transform-origin centered. */}
            <span aria-hidden className="relative block h-4 w-6">
              <motion.span
                animate={
                  reduced
                    ? { rotate: open ? 45 : 0, y: open ? 0 : -3 }
                    : { rotate: open ? 45 : 0, y: open ? 0 : -3 }
                }
                transition={{ duration: 0.3, ease: EASE }}
                style={{ transformOrigin: "center" }}
                className="absolute left-0 right-0 top-1/2 -translate-y-px block h-px bg-current"
              />
              <motion.span
                animate={
                  reduced
                    ? { rotate: open ? -45 : 0, y: open ? 0 : 3 }
                    : { rotate: open ? -45 : 0, y: open ? 0 : 3 }
                }
                transition={{ duration: 0.3, ease: EASE }}
                style={{ transformOrigin: "center" }}
                className="absolute left-0 right-0 top-1/2 -translate-y-px block h-px bg-current"
              />
            </span>
            <span className="text-base font-semibold tracking-tight sm:text-lg">
              {open ? "Cerrar" : "Menu"}
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="primary-nav"
            key="overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Menú principal"
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
            className="fixed inset-0 z-40 overflow-hidden bg-pimenton-accent"
          >
            <div className="mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-[5%] pb-12 pt-24 sm:px-16 sm:pb-16 sm:pt-28 md:w-[90%] md:max-w-[1500px] md:px-0">
              <nav className="flex flex-1 flex-col items-end justify-center gap-2 text-right sm:gap-3">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={handleLinkClick(link.href)}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      reduced ? { opacity: 0 } : { opacity: 0, y: -8 }
                    }
                    transition={{
                      delay: reduced ? 0 : 0.32 + i * 0.05,
                      duration: 0.45,
                      ease: EASE,
                    }}
                    className="font-sans text-3xl font-semibold tracking-tight text-pimenton-bg transition-opacity duration-200 hover:opacity-80 sm:text-4xl lg:text-5xl"
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
                  delay: reduced ? 0 : 0.32 + NAV_LINKS.length * 0.05,
                  duration: 0.45,
                  ease: EASE,
                }}
                className="flex flex-col gap-1 text-pimenton-bg"
              >
                <ul className="space-y-1">
                  {CONTACTS.phones.map((p) => (
                    <li
                      key={p.region}
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
                  href={`mailto:${CONTACTS.email}`}
                  className="mt-3 font-sans text-xl font-semibold transition-opacity hover:opacity-80 sm:text-2xl"
                >
                  {CONTACTS.email}
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
