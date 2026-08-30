import { StatusDot } from "./DashboardStatus";
import type { DashboardTone } from "../../lib/dashboardActivity";

export interface DashboardKpiCardProps {
  label: string;
  /** Cifra o estado, ya formateado ("6", "Publicado", "—"). */
  value: string;
  detail: string;
  tone: DashboardTone;
}

/**
 * Tarjeta del bloque "Estado general": etiqueta y punto de estado arriba,
 * cifra grande abajo y una línea que explica qué se está contando.
 */
export function DashboardKpiCard({ label, value, detail, tone }: DashboardKpiCardProps) {
  return (
    <article className="flex min-h-[132px] min-w-0 flex-col justify-between rounded-[8px] border border-neutral-border bg-white p-[18px] shadow-[0_2px_8px_rgba(13,20,28,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-inter text-[11px] font-semibold leading-[1.4] text-neutral-muted">
          {label}
        </h3>
        <StatusDot tone={tone} className="mt-[3px] h-[9px] w-[9px]" />
      </div>

      <div>
        <p className="font-inter text-[26px] font-bold leading-[1.15] text-neutral-ink">{value}</p>
        <p className="mt-1.5 font-inter text-[11px] leading-[1.45] text-neutral-muted">{detail}</p>
      </div>
    </article>
  );
}
