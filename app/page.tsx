import { Comparison } from "@/components/sections/Comparison";
import { Consultancy } from "@/components/sections/Consultancy";
import { ControlRoom } from "@/components/sections/ControlRoom";
import { GallerySpecialists } from "@/components/sections/GallerySpecialists";
import { Hero } from "@/components/sections/Hero";
import { MarketStats } from "@/components/sections/MarketStats";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { copy } from "@/data/copy";

const SITE = "https://pimenton.io";

// Structured data (JSON-LD): Organization + WebSite. Ayuda a Google/AI a
// entender la marca, su logo y sus perfiles sociales (knowledge panel).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "Pimentón",
      url: SITE,
      logo: `${SITE}/assets/logos/principal/logo-coral.webp`,
      description:
        "Growth Partner especializado en delivery para restaurantes. Operamos tus canales digitales en LATAM y Europa.",
      sameAs: copy.footer.social
        .filter((s) => s.name === "LinkedIn" || s.name === "Instagram")
        .map((s) => s.href),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      name: "Pimentón",
      url: SITE,
      inLanguage: "es",
      publisher: { "@id": `${SITE}/#organization` },
    },
  ],
};

export default function Home() {
  return (
    <main>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      {/* El Wall de clientes (marquee) vive al final de <Stats />, así que
          queda entre Stats y MarketStats sin sección aparte. */}
      <Stats />
      <MarketStats />
      <ControlRoom />
      <Comparison />
      <Testimonials />
      {/* Form de consultoría justo después de la prueba social. */}
      <Consultancy />
      {/* Cierre cinemático: 3D gallery WebGL. */}
      <GallerySpecialists />
    </main>
  );
}
