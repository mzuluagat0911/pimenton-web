import { ControlRoom } from "@/components/sections/ControlRoom";
import { Hero } from "@/components/sections/Hero";
import { MarketStats } from "@/components/sections/MarketStats";
import { Stats } from "@/components/sections/Stats";
import { WhereWeOperate } from "@/components/sections/WhereWeOperate";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <WhereWeOperate />
      {/* Wall de logos clientes va acá (parte 2 de esta sección) */}
      <ControlRoom />
      <MarketStats />
    </main>
  );
}
