import { StatusPill } from "../dashboard/DashboardStatus";
import type { DashboardTone } from "../../lib/dashboardActivity";

export interface EditorHeaderPill {
  label: string;
  tone: DashboardTone;
}

export interface ContentEditorHeaderProps {
  /** Migaja de pan del editor: "Inicio / Hero principal". */
  breadcrumb: string;
  title: string;
  description: string;
  /** Distintivos de la derecha (estado de publicación, cambios sin guardar). */
  pills: EditorHeaderPill[];
}

/**
 * Encabezado de un editor de contenidos (Figma 930:4).
 *
 * No usa `AdminPageHeader` porque la jerarquía es distinta: el editor abre con
 * la ruta (migaja de 11px) en vez del antetítulo naranja de sección, y cierra
 * sin divisoria — la tarjeta del formulario ya marca el corte.
 *
 * Las píldoras reutilizan `StatusPill` del dashboard: misma familia de tonos
 * `state-*`, un solo sitio donde vive qué color significa cada estado.
 */
export function ContentEditorHeader({
  breadcrumb,
  title,
  description,
  pills,
}: ContentEditorHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="font-inter text-[11px] font-medium text-neutral-muted">{breadcrumb}</p>
        <h1 className="mt-1.5 font-inter text-[26px] font-bold leading-[1.15] text-neutral-ink">
          {title}
        </h1>
        <p className="mt-1.5 max-w-[640px] font-inter text-[12px] leading-[1.55] text-neutral-muted">
          {description}
        </p>
      </div>

      {pills.length > 0 && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {pills.map((pill) => (
            <StatusPill
              key={pill.label}
              tone={pill.tone}
              label={pill.label}
              textClassName="text-[10px] font-semibold"
            />
          ))}
        </div>
      )}
    </header>
  );
}
