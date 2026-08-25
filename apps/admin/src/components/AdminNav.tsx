"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminNavChild {
  id: string;
  label: string;
  href: string;
}

interface AdminNavItem {
  label: string;
  href: string;
  badge?: { text: string; className: string };
  children?: AdminNavChild[];
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "/" },
  {
    label: "Inicio & Hero",
    href: "/inicio",
    children: [
      { id: "hero", label: "🚀 Hero Principal", href: "/inicio/hero" },
      { id: "promotions", label: "🧭 Encabezado de Promociones", href: "/inicio/promociones" },
      { id: "inspiration", label: "✨ Inspiración desde Blog", href: "/inicio/inspiracion" },
      { id: "pause", label: "💬 Pausa Conversacional", href: "/inicio/pausa" },
      { id: "testimonials", label: "⭐ Encabezado de Experiencias", href: "/inicio/experiencias" },
      { id: "faq", label: "❓ Encabezado de FAQ", href: "/inicio/preguntas-frecuentes" },
    ],
  },
  {
    label: "Nosotros & Asesoras",
    href: "/nosotros",
    children: [
      { id: "contenido", label: "📝 Contenido", href: "/nosotros" },
      { id: "equipo", label: "👥 Equipo", href: "/nosotros/equipo" },
    ],
  },
  {
    label: "Contacto",
    href: "/contacto",
    children: [
      { id: "contenido", label: "📝 Contenido", href: "/contacto" },
      { id: "oficina", label: "📍 Oficina & Horarios", href: "/contacto/oficina" },
    ],
  },
  {
    label: "Blog & Contenidos",
    href: "/blog",
    badge: { text: "CMS", className: "bg-brand-accent text-brand-navy" },
    children: [
      { id: "articulos", label: "📝 Artículos", href: "/blog" },
      { id: "categorias", label: "🏷️ Categorías", href: "/blog/categorias" },
    ],
  },
  { label: "Reclamaciones", href: "/reclamaciones", badge: { text: "Libro", className: "bg-amber-400 text-slate-900" } },
  { label: "Usuarios & Roles", href: "/usuarios", badge: { text: "RBAC", className: "bg-purple-400 text-slate-950" } },
  { label: "Bitácora de Auditoría", href: "/auditoria" },
  { label: "Publicación ISR", href: "/publicacion", badge: { text: "Caché", className: "bg-emerald-400 text-slate-950" } },
  { label: "Biblioteca de Medios", href: "/medios" },
  { label: "Identidad & WhatsApp", href: "/identidad" },
  { label: "Mi Cuenta", href: "/perfil" },
];

function isSectionActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-6 flex flex-col gap-1">
      {ADMIN_NAV_ITEMS.map((item) => {
        const active = isSectionActive(pathname, item.href);
        return (
          <div key={item.href}>
            <Link
              href={item.href}
              className={`px-3.5 py-2.5 rounded-xl font-sora text-sm transition-colors flex items-center justify-between ${
                active ? "bg-white/10 text-white" : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.badge.className}`}>
                  {item.badge.text}
                </span>
              )}
            </Link>

            {active && item.children && (
              <div className="mt-1 ml-3 flex flex-col gap-0.5 border-l border-white/10 pl-3">
                {item.children.map((child) => {
                  const childActive = pathname === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
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
      })}
    </nav>
  );
}
