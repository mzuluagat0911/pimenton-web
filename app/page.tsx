import { ControlRoom } from "@/components/sections/ControlRoom";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <ControlRoom />
      {/* Wall de clientes va acá cuando lo construyamos */}
    </main>
  );
}
