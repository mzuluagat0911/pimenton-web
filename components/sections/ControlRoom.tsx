import { copy } from "@/data/copy";
import { platforms, type Platform, type PlatformRing } from "@/data/platforms";

const RING_RADII: Record<PlatformRing, number> = {
  inner: 0.28,
  middle: 0.4,
  outer: 0.48,
};

const RING_ORDER: PlatformRing[] = ["inner", "middle", "outer"];

type PositionedPlatform = Platform & {
  angleDeg: number;
  xPct: number;
  yPct: number;
  radiusPct: number;
};

function buildPositions(): PositionedPlatform[] {
  const out: PositionedPlatform[] = [];
  for (const ring of RING_ORDER) {
    const list = platforms.filter((p) => p.ring === ring);
    const radius = RING_RADII[ring];
    list.forEach((p, i) => {
      const angleDeg = (360 / list.length) * i;
      const rad = (angleDeg - 90) * (Math.PI / 180);
      const x = Math.cos(rad) * radius;
      const y = Math.sin(rad) * radius;
      out.push({
        ...p,
        angleDeg,
        xPct: x * 100,
        yPct: y * 100,
        radiusPct: radius,
      });
    });
  }
  return out;
}

export function ControlRoom() {
  const { eyebrow, heading, subheading } = copy.controlRoom;
  const positioned = buildPositions();

  return (
    <section className="relative flex min-h-screen items-center bg-pimenton-dark px-8 sm:px-16 lg:px-24 py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <p className="flex items-center text-pimenton-accent text-xs sm:text-sm uppercase tracking-[0.22em] font-medium">
          <span aria-hidden className="mr-3 inline-block h-px w-8 bg-pimenton-accent" />
          {eyebrow}
        </p>
        <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight text-pimenton-text-on-dark">
          {heading}
        </h2>
        <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-pimenton-text-on-dark-muted">
          {subheading}
        </p>

        <div className="relative mx-auto mt-16 aspect-square w-full max-w-[640px] sm:mt-20">
          {RING_ORDER.map((ring) => (
            <div
              key={ring}
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-pimenton-dark-border/40"
              style={{
                width: `${RING_RADII[ring] * 200}%`,
                height: `${RING_RADII[ring] * 200}%`,
              }}
            />
          ))}

          <svg
            aria-hidden
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {positioned.map((p) => (
              <line
                key={p.id}
                x1="50"
                y1="50"
                x2={50 + p.xPct}
                y2={50 + p.yPct}
                stroke="var(--color-pimenton-accent)"
                strokeOpacity="0.18"
                strokeWidth="0.2"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div
                aria-hidden
                className="absolute inset-[-45%] rounded-full bg-pimenton-accent/30 blur-3xl"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/logos/isologo/isologo-crema.webp"
                alt="Pimentón"
                width={128}
                height={128}
                className="relative size-24 sm:size-28 lg:size-32 object-contain"
              />
            </div>
          </div>

          <ul aria-label="Plataformas integradas" className="contents">
            {positioned.map((p) => (
              <li
                key={p.id}
                className="absolute z-10 flex size-12 items-center justify-center rounded-full border border-pimenton-dark-border bg-pimenton-dark-surface sm:size-14"
                style={{
                  left: `${50 + p.xPct}%`,
                  top: `${50 + p.yPct}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.logo}
                  alt={p.name}
                  className="size-6 object-contain sm:size-7"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
