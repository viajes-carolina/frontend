import type { ComponentType } from "react";
import {
  SunIcon,
  CompassIcon,
  MailIcon,
  EditIcon,
  LifeBuoyIcon,
  UsersIcon,
  ClipboardListIcon,
  RefreshCwIcon,
  SettingsIcon,
  UserCircleIcon,
  type IconProps,
} from "@vc/ui";

// Única fuente de verdad de la estructura del menú lateral del panel admin.
// AdminNav.tsx solo consume esta configuración para renderizar — no decide
// aquí ninguna lógica de presentación (eso vive en el componente).

export interface AdminNavLeaf {
  label: string;
  href: string;
}

export interface AdminNavSection {
  label: string;
  icon: ComponentType<IconProps>;
  /** Solo se define cuando la sección NO tiene `children` — navega directo. */
  href?: string;
  badge?: { text: string; className: string };
  children?: AdminNavLeaf[];
}

export interface AdminNavCategory {
  label: string;
  items: AdminNavSection[];
}

export const ADMIN_NAV: AdminNavCategory[] = [
  {
    label: "Contenido del Sitio",
    items: [
      {
        label: "Inicio",
        icon: SunIcon,
        children: [
          { label: "Hero Principal", href: "/inicio/hero" },
          { label: "Encabezado de Promociones", href: "/inicio/promociones" },
          { label: "Inspiración desde Blog", href: "/inicio/inspiracion" },
          { label: "Pausa Conversacional", href: "/inicio/pausa" },
          { label: "Encabezado de Experiencias", href: "/inicio/experiencias" },
          { label: "Encabezado de FAQ", href: "/inicio/preguntas-frecuentes" },
        ],
      },
      {
        label: "Nosotros",
        icon: CompassIcon,
        children: [
          { label: "Contenido", href: "/nosotros" },
          { label: "Equipo", href: "/nosotros/equipo" },
        ],
      },
      {
        label: "Contacto",
        icon: MailIcon,
        children: [
          { label: "Contenido", href: "/contacto" },
          { label: "Oficina & Horarios", href: "/contacto/oficina" },
        ],
      },
      {
        label: "Blog",
        icon: EditIcon,
        badge: { text: "CMS", className: "bg-brand-accent text-brand-navy" },
        children: [
          { label: "Artículos", href: "/blog" },
          { label: "Categorías", href: "/blog/categorias" },
        ],
      },
    ],
  },
  {
    label: "Gobernanza & Legal",
    items: [
      {
        label: "Reclamaciones",
        icon: LifeBuoyIcon,
        href: "/reclamaciones",
        badge: { text: "Libro", className: "bg-amber-400 text-slate-900" },
      },
      {
        label: "Usuarios & Roles",
        icon: UsersIcon,
        href: "/usuarios",
        badge: { text: "RBAC", className: "bg-purple-400 text-slate-950" },
      },
      {
        label: "Bitácora de Auditoría",
        icon: ClipboardListIcon,
        href: "/auditoria",
      },
    ],
  },
  {
    label: "Operaciones",
    items: [
      {
        label: "Publicación",
        icon: RefreshCwIcon,
        href: "/publicacion",
        badge: { text: "Caché", className: "bg-emerald-400 text-slate-950" },
      },
    ],
  },
  {
    label: "Configuración",
    items: [
      { label: "Identidad & WhatsApp", icon: SettingsIcon, href: "/identidad" },
      { label: "Mi Cuenta", icon: UserCircleIcon, href: "/perfil" },
    ],
  },
];
