import type { DashboardTone } from "../../lib/dashboardActivity";

/**
 * Señales de estado del dashboard: el punto de color y la píldora.
 *
 * Los dos comparten la misma familia de tonos (`state-*` en el tema del
 * panel), por eso viven en el mismo archivo: un solo sitio donde leer qué
 * color significa publicado, borrador o pendiente.
 */

const DOT_CLASSES: Record<DashboardTone, string> = {
  published: "bg-state-published",
  draft: "bg-state-draft",
  pending: "bg-state-pending",
  neutral: "bg-neutral-muted",
};

const PILL_CLASSES: Record<DashboardTone, string> = {
  published: "bg-state-published-surface text-state-published",
  draft: "bg-state-draft-surface text-state-draft",
  pending: "bg-state-pending-surface text-state-pending",
  neutral: "bg-neutral-soft text-neutral-muted",
};

export interface StatusDotProps {
  tone: DashboardTone;
  /** Tamaño y posición: el diseño usa 9px en los KPI y 8px en las listas. */
  className?: string;
}

export function StatusDot({ tone, className = "h-2 w-2" }: StatusDotProps) {
  // Decorativo: el estado siempre va escrito al lado en texto.
  return <span aria-hidden="true" className={`shrink-0 rounded-full ${DOT_CLASSES[tone]} ${className}`} />;
}

export interface StatusPillProps {
  tone: DashboardTone;
  label: string;
  /** El badge del topbar lleva punto; el del panel, solo texto. */
  withDot?: boolean;
  /** Tipografía de la píldora: 11px medium en el topbar, 10px semibold en el panel. */
  textClassName?: string;
}

export function StatusPill({
  tone,
  label,
  withDot = false,
  textClassName = "text-[11px] font-medium",
}: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[99px] px-2.5 py-1 font-inter ${textClassName} ${PILL_CLASSES[tone]}`}
    >
      {withDot && <StatusDot tone={tone} className="h-2 w-2" />}
      {label}
    </span>
  );
}
