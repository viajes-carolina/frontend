import type { ReactNode } from "react";
import { Skeleton } from "@vc/ui";
import { ADMIN_SECTION_CONTAINER } from "./AdminSectionLayout";

export interface AdminSectionLoadingProps {
  /** Esqueleto del cuerpo (`FormSkeleton`, `TableSkeleton`…). */
  children: ReactNode;
}

/**
 * Esqueleto de una pantalla de sección: reproduce el contenedor y la cabecera
 * de `AdminSectionLayout` para que el contenido no salte al llegar los datos.
 *
 * Existe porque la cabecera dejó de vivir en un `layout.tsx` compartido y pasó
 * a cada página: sin esto, el `loading.tsx` se pintaba sin margen ni cabecera y
 * el bloque se desplazaba al terminar de cargar.
 */
export function AdminSectionLoading({ children }: AdminSectionLoadingProps) {
  return (
    <div className={ADMIN_SECTION_CONTAINER}>
      <div className="space-y-3 border-b border-admin-divider pb-6">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-64 max-w-full" />
        <Skeleton className="h-4 w-[420px] max-w-full" />
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
