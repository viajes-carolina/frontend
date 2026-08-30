import { ArrowUpRightIcon } from "@vc/ui";
import { StatusPill } from "./DashboardStatus";
import type { DashboardTone } from "../../lib/dashboardActivity";

export interface DashboardTopbarProps {
  /** Estado real de publicación, ya redactado ("Sitio publicado"). */
  statusLabel: string;
  statusTone: DashboardTone;
  siteUrl: string;
}

/**
 * Barra superior del dashboard: nombre del entorno a la izquierda, estado del
 * sitio y salida a la web pública a la derecha.
 *
 * Se monta desde la propia pantalla y no desde `AdminShell` porque el estado
 * de publicación es un dato del dashboard; llevarla al shell obligaría a
 * consultarlo en las ~36 pantallas del panel.
 */
export function DashboardTopbar({ statusLabel, statusTone, siteUrl }: DashboardTopbarProps) {
  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between gap-4 border-b border-neutral-border bg-white px-5 lg:px-10">
      <p className="font-inter text-[13px] font-medium text-neutral-muted">Panel administrativo</p>

      <div className="flex items-center gap-3">
        <StatusPill tone={statusTone} label={statusLabel} withDot />

        {/* Enlace, no botón: abre otro sitio en una pestaña nueva. */}
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-[6px] border border-neutral-border bg-white px-3.5 py-2.5 font-inter text-[12px] font-semibold text-neutral-ink transition-colors hover:border-brand-navy/40 hover:bg-neutral-soft"
        >
          Ver web pública
          <ArrowUpRightIcon size={13} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
