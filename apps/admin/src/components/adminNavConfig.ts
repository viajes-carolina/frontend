// Única fuente de verdad de la estructura del menú lateral del panel admin.
// AdminNav.tsx solo consume esta configuración para renderizar — no decide
// aquí ninguna lógica de presentación (eso vive en el componente).
//
// Cada sección traía un `icon: ComponentType<IconProps>`. El diseño del
// sidebar (Figma 930:3) sustituye los iconos SVG por un punto de estado de
// 8px, así que el campo se quedó sin ningún consumidor (`AdminNavSectionRow`
// era el único) y se elimina en vez de dejarlo como dato muerto que hay que
// mantener al añadir secciones.

export interface AdminNavLeaf {
  label: string;
  href: string;
}

/**
 * Peso visual del distintivo, no su color: las clases concretas se resuelven
 * en `AdminNav.tsx` a partir de los tokens del panel. Antes cada badge traía
 * clases crudas de Tailwind (`bg-amber-400`, `bg-purple-400`…) que quedaron
 * fuera de la paleta del panel al retokenizarlo.
 *
 * - `accent`   — módulo destacado del panel (naranja pleno).
 * - `attention` — requiere seguimiento constante (naranja atenuado).
 * - `neutral`  — etiqueta meramente informativa.
 */
export type AdminNavBadgeTone = "accent" | "attention" | "neutral";

export interface AdminNavBadge {
  text: string;
  tone: AdminNavBadgeTone;
}

export interface AdminNavSection {
  label: string;
  /** Solo se define cuando la sección NO tiene `children` — navega directo. */
  href?: string;
  badge?: AdminNavBadge;
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
        // Submenú consolidado según el diseño (Figma 930:4): de doce entradas a
        // una por bloque de la portada. Las cuatro pantallas del Hero se
        // fusionaron en un solo editor, y encabezado + listado de Promociones y
        // de FAQ pasaron a compartir pantalla; las rutas viejas redirigen.
        //
        // El orden es el de la portada real, no el alfabético, para que el menú
        // se lea como se recorre la página.
        //
        // "Pausa conversacional" es el séptimo ítem y no aparece en el diseño,
        // que solo dibuja seis. Es un bloque real y editable del sitio (sección
        // 04 de la portada, entre el blog y los testimonios) y no encaja dentro
        // de ninguno de los otros seis, así que se conserva como entrada propia
        // en su posición real en vez de quedar inaccesible.
        children: [
          { label: "Hero principal", href: "/inicio/hero" },
          { label: "Promociones", href: "/inicio/promociones" },
          { label: "Blog en Home", href: "/inicio/inspiracion" },
          { label: "Pausa conversacional", href: "/inicio/pausa" },
          { label: "Experiencias", href: "/inicio/experiencias" },
          { label: "Testimonios", href: "/inicio/experiencias/testimonios" },
          { label: "Preguntas frecuentes", href: "/inicio/preguntas-frecuentes" },
        ],
      },
      {
        label: "Nosotros",
        children: [
          { label: "Cabecera", href: "/nosotros/cabecera" },
          { label: "Nuestra forma de trabajar", href: "/nosotros/forma-de-trabajo" },
          { label: "Equipo", href: "/nosotros/equipo" },
        ],
      },
      {
        label: "Contacto",
        children: [
          { label: "Hero & Encabezado", href: "/contacto/hero" },
          { label: "Encabezado de Oficina", href: "/contacto/encabezado-oficina" },
          { label: "Oficina & Horarios", href: "/contacto/oficina" },
        ],
      },
      {
        label: "Blog",
        badge: { text: "CMS", tone: "accent" },
        children: [
          { label: "Artículos", href: "/blog" },
          { label: "Categorías", href: "/blog/categorias" },
          { label: "Portada", href: "/blog/portada" },
          { label: "Biblioteca", href: "/blog/biblioteca" },
        ],
      },
    ],
  },
  {
    label: "Gobernanza & Legal",
    items: [
      {
        label: "Legal",
        children: [
          { label: "Términos y condiciones", href: "/legal/terminos" },
          { label: "Política de privacidad", href: "/legal/privacidad" },
          { label: "Política de cookies", href: "/legal/cookies" },
          { label: "Compromiso contra la ESNNA", href: "/legal/esnna" },
          { label: "Constancia MINCETUR", href: "/legal/mincetur" },
        ],
      },
      {
        label: "Reclamaciones",
        href: "/reclamaciones",
        badge: { text: "Libro", tone: "attention" },
      },
      {
        label: "Usuarios & Roles",
        href: "/usuarios",
        badge: { text: "RBAC", tone: "neutral" },
      },
      {
        label: "Bitácora de Auditoría",
        href: "/auditoria",
      },
    ],
  },
  {
    label: "Operaciones",
    items: [
      {
        label: "Publicación",
        href: "/publicacion",
        badge: { text: "Caché", tone: "neutral" },
      },
    ],
  },
  {
    label: "Configuración",
    items: [
      {
        label: "Identidad & WhatsApp",
        children: [
          { label: "Identidad de Marca", href: "/identidad/marca" },
          { label: "Información Legal", href: "/identidad/legal" },
          { label: "Canal WhatsApp", href: "/identidad/whatsapp" },
          { label: "Redes Sociales", href: "/identidad/redes" },
        ],
      },
      { label: "Mi Cuenta", href: "/perfil" },
    ],
  },
];
