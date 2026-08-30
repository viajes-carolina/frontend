"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV } from "./adminNavConfig";
import {
  AdminNavSectionRow,
  NavDot,
  ROW_ACTIVE,
  ROW_BASE,
  ROW_IDLE,
  isSectionActive,
} from "./AdminNavSectionRow";

/** Etiqueta de la sección desplegable que contiene la ruta actual, si la hay. */
function activeSectionLabel(pathname: string): string | null {
  for (const category of ADMIN_NAV) {
    for (const section of category.items) {
      if (section.children && isSectionActive(pathname, section)) return section.label;
    }
  }
  return null;
}

export interface AdminNavProps {
  /** Cierra el drawer mobile: navegar sin esto dejaba el menú tapando la pantalla. */
  onNavigate: () => void;
}

export function AdminNav({ onNavigate }: AdminNavProps) {
  const pathname = usePathname();
  const dashboardActive = pathname === "/";
  const activeLabel = activeSectionLabel(pathname);

  // Acordeón: una sola sección desplegada a la vez, y por defecto la que
  // contiene la ruta actual. Antes un `useEffect` forzaba `expanded=true` al
  // entrar en la sección pero nada la volvía a cerrar, así que el sidebar
  // terminaba con todos los grupos abiertos y 30+ enlaces visibles. Al cambiar
  // de sección se sincroniza con la ruta; dentro de una misma sección manda el
  // usuario (puede colapsarla y no se le reabre al navegar entre sus hijos,
  // porque `activeLabel` no cambia y el efecto no se vuelve a disparar).
  const [openLabel, setOpenLabel] = useState<string | null>(activeLabel);
  useEffect(() => {
    setOpenLabel(activeLabel);
  }, [activeLabel]);

  return (
    <nav aria-label="Secciones del panel" className="mt-6 flex flex-col gap-0.5">
      <Link
        href="/"
        onClick={onNavigate}
        aria-current={dashboardActive ? "page" : undefined}
        className={`${ROW_BASE} ${dashboardActive ? ROW_ACTIVE : ROW_IDLE}`}
      >
        <NavDot active={dashboardActive} />
        <span className="flex-1 truncate text-left">Dashboard</span>
      </Link>

      {ADMIN_NAV.map((category) => (
        <div key={category.label}>
          {/* `pl-6` (24px) sobre los 8px de respiro del sidebar deja la
              etiqueta de grupo en x=32px, la misma columna que los labels de
              las filas. */}
          <p className="mt-5 mb-1.5 pl-6 pr-2.5 font-inter text-[11px] font-semibold uppercase tracking-[0.9px] text-admin-on-navy/55">
            {category.label}
          </p>
          <div className="flex flex-col gap-0.5">
            {category.items.map((section) => (
              <AdminNavSectionRow
                key={section.label}
                section={section}
                pathname={pathname}
                expanded={openLabel === section.label}
                onToggle={() =>
                  setOpenLabel((prev) => (prev === section.label ? null : section.label))
                }
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
