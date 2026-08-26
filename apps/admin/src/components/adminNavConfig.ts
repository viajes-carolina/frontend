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
          { label: "Titulares", href: "/inicio/hero/titulares" },
          { label: "Botones de Acción", href: "/inicio/hero/botones" },
          { label: "Línea de Confianza", href: "/inicio/hero/confianza" },
          { label: "Collage de Fotos", href: "/inicio/hero/fotos" },
          { label: "Encabezado de Promociones", href: "/inicio/promociones" },
          { label: "Catálogo de Promociones", href: "/inicio/promociones/catalogo" },
          { label: "Inspiración desde Blog", href: "/inicio/inspiracion" },
          { label: "Pausa Conversacional", href: "/inicio/pausa" },
          { label: "Encabezado de Experiencias", href: "/inicio/experiencias" },
          { label: "Testimonios", href: "/inicio/experiencias/testimonios" },
          { label: "Encabezado de FAQ", href: "/inicio/preguntas-frecuentes" },
          { label: "Preguntas Frecuentes", href: "/inicio/preguntas-frecuentes/preguntas" },
        ],
      },
      {
        label: "Nosotros",
        icon: CompassIcon,
        children: [
          { label: "Cabecera", href: "/nosotros/cabecera" },
          { label: "Historia", href: "/nosotros/historia" },
          { label: "Misión", href: "/nosotros/mision" },
          { label: "Cómo te acompañamos", href: "/nosotros/acompanamiento" },
          { label: "Experiencias", href: "/nosotros/experiencias" },
          { label: "Una persona al otro lado", href: "/nosotros/humano" },
          { label: "Equipo", href: "/nosotros/equipo" },
        ],
      },
      {
        label: "Contacto",
        icon: MailIcon,
        children: [
          { label: "Hero & Encabezado", href: "/contacto/hero" },
          { label: "Encabezado de Oficina", href: "/contacto/encabezado-oficina" },
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
      {
        label: "Identidad & WhatsApp",
        icon: SettingsIcon,
        children: [
          { label: "Identidad de Marca", href: "/identidad/marca" },
          { label: "Información Legal", href: "/identidad/legal" },
          { label: "Canal WhatsApp", href: "/identidad/whatsapp" },
          { label: "Redes Sociales", href: "/identidad/redes" },
        ],
      },
      { label: "Mi Cuenta", icon: UserCircleIcon, href: "/perfil" },
    ],
  },
];
