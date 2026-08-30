"use client";

import Link from "next/link";
import { ChevronDownIcon } from "@vc/ui";
import type { AdminNavBadge, AdminNavBadgeTone, AdminNavSection } from "./adminNavConfig";

/*
 * Anatomía de una fila de primer nivel (diseño del sidebar, Figma 930:3).
 *
 * El sidebar mide 248px y `AdminShell` le da 8px de respiro lateral, así que
 * la fila arranca en x=8 y mide 232px. Sobre ese origen:
 *
 *   8px  borde de la fila (el rectángulo de hover/activo, radio 6px)
 *   16px punto de estado de 8px  ← `pl-2` (8px) desde el borde de la fila
 *   32px etiqueta                ← 8px de punto + `gap-2` (8px)
 *
 * El punto sustituye al icono SVG de 18px que llevaba cada sección: ya no
 * dibuja *qué* es la sección sino *en cuál estás*, encendido en naranja de
 * acento cuando la ruta actual cuelga de ella y atenuado en el resto.
 */

// DESVIACIÓN DEL DISEÑO — tamaño de la etiqueta.
// El diseño pide 16px. A 248px de ancho, una fila con chevron deja 175px
// útiles para el texto, e "Identidad & WhatsApp" —que además va en semibold
// cuando su sección está activa— mide 172,5px en Inter 16px: 2,5px de margen
// (medido en el navegador con un Range sobre la fila real). Ese margen se lo
// come cualquier redondeo o la métrica de la fuente de reserva mientras Inter
// carga (`display: swap`). A 15px la misma etiqueta baja a 161,8px y quedan
// 13,2px de holgura, y la siguiente más ajustada ("Usuarios & Roles", con
// badge) pasa de 23,5px a 31,5px. Se usan 15px para que ninguna sección se
// trunque; el resto de la escala del diseño (11px en las etiquetas de grupo,
// 40px de alto de fila, punto en x=16 y label en x=32) se respeta tal cual.
export const ROW_TEXT = "text-[15px]";

export const ROW_BASE =
  `group relative flex h-10 w-full items-center gap-2 rounded-[6px] pl-2 pr-2.5 font-inter ${ROW_TEXT} transition-colors`;
export const ROW_IDLE = "text-admin-on-navy hover:bg-white/[0.07] hover:text-white";
export const ROW_ACTIVE = "bg-white/[0.10] font-semibold text-white";

const BADGE_TONE: Record<AdminNavBadgeTone, string> = {
  accent: "bg-brand-accent text-on-accent",
  attention: "bg-brand-accent/15 text-brand-accent ring-1 ring-inset ring-brand-accent/40",
  neutral: "bg-white/[0.10] text-admin-on-navy ring-1 ring-inset ring-white/15",
};

export function isRouteActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isSectionActive(pathname: string, section: AdminNavSection) {
  if (section.children) {
    return section.children.some((child) => isRouteActive(pathname, child.href));
  }
  return section.href ? isRouteActive(pathname, section.href) : false;
}

function NavBadge({ badge }: { badge: AdminNavBadge }) {
  return (
    <span
      className={`shrink-0 rounded-[5px] px-1.5 py-0.5 font-inter text-[9px] font-bold uppercase tracking-[0.4px] ${BADGE_TONE[badge.tone]}`}
    >
      {badge.text}
    </span>
  );
}

/**
 * Punto de estado de la fila. Decorativo: el estado ya viaja en el
 * `aria-current` del enlace y en el `aria-expanded` del desplegable, así que
 * un lector de pantalla no necesita oírlo dos veces.
 */
export function NavDot({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`h-2 w-2 shrink-0 rounded-full transition-colors ${
        active ? "bg-brand-accent" : "bg-admin-on-navy/35 group-hover:bg-admin-on-navy/75"
      }`}
    />
  );
}

export interface AdminNavSectionRowProps {
  section: AdminNavSection;
  pathname: string;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}

export function AdminNavSectionRow({
  section,
  pathname,
  expanded,
  onToggle,
  onNavigate,
}: AdminNavSectionRowProps) {
  const active = isSectionActive(pathname, section);

  if (!section.children) {
    return (
      <Link
        href={section.href ?? "#"}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={`${ROW_BASE} ${active ? ROW_ACTIVE : ROW_IDLE}`}
      >
        <NavDot active={active} />
        {/* `truncate` es una red de seguridad, no el comportamiento esperado:
            con 15px ninguna etiqueta actual llega al borde. */}
        <span className="flex-1 truncate text-left">{section.label}</span>
        {section.badge && <NavBadge badge={section.badge} />}
      </Link>
    );
  }

  const panelId = `admin-nav-${section.label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        className={`${ROW_BASE} ${active ? ROW_ACTIVE : ROW_IDLE}`}
      >
        <NavDot active={active} />
        <span className="flex-1 truncate text-left">{section.label}</span>
        {section.badge && <NavBadge badge={section.badge} />}
        <ChevronDownIcon
          size={14}
          aria-hidden="true"
          className={`shrink-0 transition-transform duration-150 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Se renderiza siempre (oculto con `hidden`) para que el `aria-controls`
          del botón apunte a un elemento existente en ambos estados.
          El filete vertical cae en x=20px, justo bajo el centro del punto de
          la sección padre, para que el submenú se lea colgando de él. */}
      <div
        id={panelId}
        className={`mt-1 ml-3 flex-col gap-0.5 border-l border-white/10 pl-3 ${
          expanded ? "flex" : "hidden"
        }`}
      >
        {section.children.map((child) => {
          const childActive = pathname === child.href;
          return (
            <Link
              key={child.href}
              href={child.href}
              onClick={onNavigate}
              aria-current={childActive ? "page" : undefined}
              className={`block truncate rounded-[6px] px-2.5 py-[7px] font-inter text-[12px] transition-colors ${
                childActive
                  ? "bg-white/[0.10] font-semibold text-white"
                  : "text-admin-on-navy/80 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {child.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
