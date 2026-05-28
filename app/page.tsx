import { ControlRoom } from "@/components/sections/ControlRoom";
import { Hero } from "@/components/sections/Hero";
import { MarketStats } from "@/components/sections/MarketStats";
import { Stats } from "@/components/sections/Stats";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <ControlRoom />
      <MarketStats />
      {/* Wall de clientes va acá cuando lo construyamos */}
    </main>
  );
}
