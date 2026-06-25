/**
 * Labels de un caso: categoría (pill coral) + país (pill menta) — mismo
 * lenguaje que los labels del hub de insights. `onDark` ajusta los colores
 * para fondos oscuros (hero del caso); por defecto, para superficies claras
 * (cards del hub).
 */
export function MetaPills({
  categoria,
  pais,
  bandera,
  onDark = false,
  className = "",
}: {
  categoria: string;
  pais?: string;
  bandera?: string;
  onDark?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.12em]";
  const coral = onDark
    ? "bg-pimenton-accent/15 text-pimenton-accent"
    : "bg-pimenton-accent/10 text-pimenton-accent";
  const mint = onDark
    ? "bg-pimenton-mint/20 text-pimenton-mint"
    : "bg-pimenton-mint/55 text-pimenton-text";

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className={`${base} ${coral}`}>{categoria}</span>
      {pais && (
        <span className={`${base} ${mint}`}>
          {bandera ? `${bandera} ${pais}` : pais}
        </span>
      )}
    </div>
  );
}
