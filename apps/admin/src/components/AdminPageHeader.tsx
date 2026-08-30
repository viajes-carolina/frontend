import type { ReactNode } from "react";

export interface AdminPageHeaderProps {
  /** Categoría a la que pertenece la pantalla, en mayúsculas (opcional). */
  eyebrow?: string;
  title: string;
  description: string;
  /** Acción principal alineada a la derecha (ej. "Ver web pública"). */
  action?: ReactNode;
  /**
   * Divisor inferior. El dashboard lo apaga porque ya trae la barra superior
   * justo encima y dos líneas seguidas parten la pantalla en dos.
   */
  divider?: boolean;
}

/**
 * Cabecera común de las pantallas del panel: antes cada `layout.tsx` de sección
 * repetía el mismo bloque `h1` + `p`. Reproduce la jerarquía de la pantalla de
 * acceso — antetítulo naranja en mayúsculas con `tracking`, titular en tinta y
 * bajada en gris — cerrada por un divisor.
 */
export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
  divider = true,
}: AdminPageHeaderProps) {
  return (
    <header className={divider ? "border-b border-admin-divider pb-6" : ""}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className="font-inter text-[11px] font-bold uppercase tracking-[0.88px] text-brand-accent">
              {eyebrow}
            </p>
          )}
          <h1
            className={`font-inter text-[24px] font-bold leading-tight text-neutral-ink lg:text-[28px] ${
              eyebrow ? "mt-2" : ""
            }`}
          >
            {title}
          </h1>
          <p className="mt-2 max-w-[720px] font-inter text-[13.5px] leading-[1.6] text-neutral-muted">
            {description}
          </p>
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}
