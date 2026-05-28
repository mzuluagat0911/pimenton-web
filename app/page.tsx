import { ClientWall } from "@/components/sections/ClientWall";
import { Comparison } from "@/components/sections/Comparison";
import { ControlRoom } from "@/components/sections/ControlRoom";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { MarketStats } from "@/components/sections/MarketStats";
import { Services } from "@/components/sections/Services";
import { Specialists } from "@/components/sections/Specialists";
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
      <MarketStats />
      <Comparison />
      <ControlRoom />
      <Services />
      <Testimonials />
      <Specialists />
      <Gallery />
    </main>
  );
}
