import { ClientWall } from "@/components/sections/ClientWall";
import { Comparison } from "@/components/sections/Comparison";
import { ControlRoom } from "@/components/sections/ControlRoom";
import { Hero } from "@/components/sections/Hero";
import { MarketStats } from "@/components/sections/MarketStats";
import { Services } from "@/components/sections/Services";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhereWeOperate } from "@/components/sections/WhereWeOperate";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <WhereWeOperate />
      <ClientWall />
      <ControlRoom />
      <MarketStats />
      <Comparison />
      <Services />
      <Testimonials />
    </main>
  );
}
