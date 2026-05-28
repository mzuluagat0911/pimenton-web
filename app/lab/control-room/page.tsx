import type { Metadata } from "next";
import { ControlRoomAutonomous } from "@/components/sections/control-room/Autonomous";
import { ControlRoomScroll } from "@/components/sections/control-room/Scroll";
import { ControlRoomMobile } from "@/components/sections/control-room/Mobile";

export const metadata: Metadata = {
  title: "Lab · Control Room — Pimentón",
  robots: { index: false, follow: false },
};

function LabBanner({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="border-y border-pimenton-dark-border bg-pimenton-dark-soft px-8 py-4 sm:px-16 lg:px-24">
      <div className="mx-auto flex max-w-7xl flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-pimenton-accent">
          {tag}
        </span>
        <span className="text-sm text-pimenton-text-on-dark-muted">
          {title}
        </span>
      </div>
    </div>
  );
}

export default function ControlRoomLabPage() {
  return (
    <main>
      <div className="md:hidden">
        <LabBanner
          tag="Mobile"
          title="Layout vertical agrupado por tier"
        />
        <ControlRoomMobile />
      </div>

      <div className="hidden md:block">
        <LabBanner
          tag="Versión A — Autónoma"
          title="Los anillos rotan solos a velocidad lenta, latido + paquetes + descarga en loop"
        />
        <ControlRoomAutonomous />
        <LabBanner
          tag="Versión B — Scroll-driven"
          title="Pin + scrub: el scroll del usuario controla la rotación; al terminar se despinnea"
        />
        <ControlRoomScroll />
      </div>
    </main>
  );
}
