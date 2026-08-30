import type { ReactNode } from "react";
import { AdminPageHeader } from "./AdminPageHeader";

export interface AdminSectionLayoutProps {
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
}

/**
 * Ancho y respiro de una sección del panel. Se exporta para que el esqueleto de
 * carga ocupe exactamente el mismo espacio que la pantalla real.
 */
export const ADMIN_SECTION_CONTAINER = "mx-auto max-w-6xl px-5 py-7 lg:px-8 lg:py-10";

/**
 * Contenedor de las secciones del panel (Inicio, Nosotros, Contacto, Blog,
 * Legal, Identidad). Unifica el ancho, el respiro y la cabecera que los seis
 * `layout.tsx` venían duplicando línea por línea.
 */
export function AdminSectionLayout({
  eyebrow,
  title,
  description,
  children,
}: AdminSectionLayoutProps) {
  return (
    <div className={ADMIN_SECTION_CONTAINER}>
      <AdminPageHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-8">{children}</div>
    </div>
  );
}
