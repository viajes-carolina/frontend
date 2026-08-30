import Link from "next/link";
import { StatusDot } from "./DashboardStatus";
import type { DashboardActivityItem } from "../../lib/dashboardActivity";

export interface RecentActivityPanelProps {
  items: DashboardActivityItem[];
  /** `false` cuando la bitácora no respondió: no es lo mismo que no haber actividad. */
  available: boolean;
}

/**
 * Panel "Actividad reciente": los últimos cambios hechos en el sitio, leídos
 * de la bitácora de auditoría. Los accesos al panel se quedan fuera (llenan la
 * lista sin decir qué cambió) y siguen consultables en `/auditoria`.
 */
export function RecentActivityPanel({ items, available }: RecentActivityPanelProps) {
  return (
    <section
      aria-labelledby="actividad-reciente"
      className="rounded-[8px] border border-neutral-border bg-white p-[18px] shadow-[0_2px_8px_rgba(13,20,28,0.06)]"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="actividad-reciente" className="font-inter text-[16px] font-semibold text-neutral-ink">
          Actividad reciente
        </h2>
        <Link
          href="/auditoria"
          className="inline-flex items-center gap-1 font-inter text-[11px] font-semibold text-brand-navy transition-colors hover:text-brand-accent"
        >
          Ver auditoría
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {items.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-2.5">
              <StatusDot tone={item.tone} className="mt-[3px] h-2 w-2" />
              <div className="min-w-0 flex-1">
                <p className="font-inter text-[11px] font-semibold leading-[1.4] text-neutral-ink">
                  {item.title}
                </p>
                <p className="mt-0.5 font-inter text-[10px] leading-[1.5] text-neutral-muted">
                  {item.detail}
                </p>
              </div>
              <span className="shrink-0 font-inter text-[10px] font-medium text-neutral-muted">
                {item.time}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        // El diseño no dibuja el caso vacío, pero un panel en blanco parece un
        // fallo de carga. Se distingue "no hay nada que contar" de "no se pudo
        // consultar", que son dos situaciones distintas para quien administra.
        <div className="mt-4 rounded-[6px] border border-dashed border-neutral-border px-4 py-6 text-center">
          <p className="font-inter text-[11px] font-semibold text-neutral-ink">
            {available ? "Todavía no hay cambios registrados" : "No se pudo cargar la actividad"}
          </p>
          <p className="mt-1 font-inter text-[10px] leading-[1.5] text-neutral-muted">
            {available
              ? "Cuando edites o publiques contenido, los cambios aparecerán aquí."
              : "Vuelve a intentarlo o consulta la bitácora completa en Auditoría."}
          </p>
        </div>
      )}
    </section>
  );
}
