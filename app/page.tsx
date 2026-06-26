import { Comparison } from "@/components/sections/Comparison";
import { Consultancy } from "@/components/sections/Consultancy";
import { ControlRoom } from "@/components/sections/ControlRoom";
import { GallerySpecialists } from "@/components/sections/GallerySpecialists";
import { Hero } from "@/components/sections/Hero";
import { MarketStats } from "@/components/sections/MarketStats";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";

// El JSON-LD de Organization + WebSite ahora es GLOBAL (app/layout.tsx), así
// que la home no declara structured data propio: hereda el del layout. Tampoco
// lleva BreadcrumbList (es la raíz, no una página interna).
export default function Home() {
  return (
    <main>
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
