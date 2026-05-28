import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
            <section className="bg-pimenton-bg px-8 py-24">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-4">
            <p className="text-pimenton-text-muted text-xs uppercase tracking-[0.18em]">
              test · paleta pimentón
            </p>
            <h1 className="text-pimenton-text text-6xl font-semibold leading-[1.05] tracking-tight">
              Escalamos tu Delivery y optimizamos tus{" "}
              <span className="text-pimenton-accent">Canales Digitales</span>.
            </h1>
            <p className="text-pimenton-text-soft text-lg max-w-2xl">
              Convertimos tu Restaurante en una unidad de negocio rentable.
            </p>
          </div>

          <div className="flex gap-4">
            <button className="bg-pimenton-accent hover:bg-pimenton-accent-hover text-pimenton-bg px-6 py-3 rounded-md font-medium transition-colors">
              Servicios
            </button>
            <button className="border border-pimenton-border-strong hover:border-pimenton-text text-pimenton-text px-6 py-3 rounded-md font-medium transition-colors">
              Contáctanos
            </button>
          </div>

          {/* Swatches light */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { name: "bg", color: "bg-pimenton-bg", border: true },
              { name: "bg-soft", color: "bg-pimenton-bg-soft" },
              { name: "surface", color: "bg-pimenton-surface", border: true },
              { name: "border", color: "bg-pimenton-border" },
              { name: "accent", color: "bg-pimenton-accent" },
              { name: "accent-soft", color: "bg-pimenton-accent-soft" },
              { name: "mint", color: "bg-pimenton-mint" },
              { name: "yellow", color: "bg-pimenton-yellow" },
            ].map((s) => (
              <div key={s.name} className="space-y-2">
                <div className={`${s.color} h-20 rounded-lg ${s.border ? "border border-pimenton-border-strong" : ""}`} />
                <p className="text-pimenton-text-muted text-xs font-mono">{s.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
