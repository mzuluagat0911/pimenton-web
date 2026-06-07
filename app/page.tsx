import { Comparison } from "@/components/sections/Comparison";
import { Consultancy } from "@/components/sections/Consultancy";
import { ControlRoom } from "@/components/sections/ControlRoom";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { MarketStats } from "@/components/sections/MarketStats";
import { Services } from "@/components/sections/Services";
import { Specialists } from "@/components/sections/Specialists";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <MarketStats />
      <ControlRoom />
      <Comparison />
      <Testimonials />
      <Gallery />
      <Consultancy />
    </main>
  );
}
