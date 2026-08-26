"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDownIcon, LayoutGridIcon } from "@vc/ui";
import { ADMIN_NAV, type AdminNavSection } from "./adminNavConfig";
import { useUnsavedChangesContext } from "../hooks/useUnsavedChangesGuard";

// Compartido por todos los <Link> del sidebar: si la página actual tiene
// cambios sin guardar (estado compartido vía UnsavedChangesProvider),
// intercepta la navegación con un confirm() nativo antes de dejar salir.
// Sin cambios pendientes, es un no-op total — el <Link> navega normal.
function useNavClickGuard() {
  const router = useRouter();
  const { dirty } = useUnsavedChangesContext();

  return function handleNavClick(e: React.MouseEvent, href: string) {
    if (!dirty) return;
    e.preventDefault();
    if (window.confirm("Tienes cambios sin guardar. ¿Salir sin guardar?")) {
      router.push(href);
    }
  };
}

function isRouteActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isSectionActive(pathname: string, section: AdminNavSection) {
  if (section.children) {
    return section.children.some((child) => isRouteActive(pathname, child.href));
  }
  return section.href ? isRouteActive(pathname, section.href) : false;
}

function NavBadge({ badge }: { badge: NonNullable<AdminNavSection["badge"]> }) {
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badge.className}`}>
      {badge.text}
    </span>
  );
}

interface AdminNavSectionRowProps {
  section: AdminNavSection;
  pathname: string;
  onNavClick: (e: React.MouseEvent, href: string) => void;
}

function AdminNavSectionRow({ section, pathname, onNavClick }: AdminNavSectionRowProps) {
  const Icon = section.icon;
  const active = isSectionActive(pathname, section);
  // Se inicializa según la ruta activa al montar y se auto-expande cada vez
  // que el grupo pasa a estar activo (ej. al llegar por un link externo o
  // por el Dashboard sin haber tocado el sidebar antes) — pero no se fuerza
  // a colapsar al salir, así el usuario puede colapsar un grupo activo y
  // no se le vuelve a abrir solo por seguir dentro de esa ruta.
  const [expanded, setExpanded] = useState(() => active);
  useEffect(() => {
    if (active) setExpanded(true);
  }, [active]);

  if (!section.children) {
    return (
      <Link
        href={section.href ?? "#"}
        onClick={(e) => onNavClick(e, section.href ?? "#")}
        className={`px-3.5 py-2.5 rounded-xl font-sora text-sm transition-colors flex items-center gap-2.5 ${
          active ? "bg-white/10 text-white" : "text-white/80 hover:text-white hover:bg-white/10"
        }`}
      >
        <Icon size={18} className="shrink-0" />
        <span className="flex-1">{section.label}</span>
        {section.badge && <NavBadge badge={section.badge} />}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className={`w-full px-3.5 py-2.5 rounded-xl font-sora text-sm transition-colors flex items-center gap-2.5 ${
          active ? "bg-white/10 text-white" : "text-white/80 hover:text-white hover:bg-white/10"
        }`}
      >
        <Icon size={18} className="shrink-0" />
        <span className="flex-1 text-left">{section.label}</span>
        {section.badge && <NavBadge badge={section.badge} />}
        <ChevronDownIcon
          size={16}
          className={`shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="mt-1 ml-3 flex flex-col gap-0.5 border-l border-white/10 pl-3">
          {section.children.map((child) => {
            const childActive = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={(e) => onNavClick(e, child.href)}
                className={`block px-3 py-2 rounded-lg font-sora text-xs transition-colors ${
                  childActive
                    ? "bg-white/15 text-white font-semibold"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AdminNav() {
  const pathname = usePathname();
  const dashboardActive = pathname === "/";
  const handleNavClick = useNavClickGuard();

  return (
    <nav className="mt-6 flex flex-col gap-1">
      <Link
        href="/"
        onClick={(e) => handleNavClick(e, "/")}
        className={`px-3.5 py-2.5 rounded-xl font-sora text-sm transition-colors flex items-center gap-2.5 ${
          dashboardActive ? "bg-white/10 text-white" : "text-white/80 hover:text-white hover:bg-white/10"
        }`}
      >
        <LayoutGridIcon size={18} className="shrink-0" />
        <span>Dashboard</span>
      </Link>

      {ADMIN_NAV.map((category) => (
        <div key={category.label}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-3.5 mt-4 mb-1">
            {category.label}
          </p>
          <div className="flex flex-col gap-1">
            {category.items.map((section) => (
              <AdminNavSectionRow
                key={section.label}
                section={section}
                pathname={pathname}
                onNavClick={handleNavClick}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
