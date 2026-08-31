"use client";

import React from "react";

/**
 * Botón compartido por el sitio público y el panel administrativo.
 *
 * ── Reglas de uso (guía de estilo del panel) ──────────────────────────────
 * "Naranja comunica la acción principal. Navy y blanco acompañan; rojo se
 *  reserva para acciones destructivas."
 * "Una acción principal por bloque; las demás reducen su jerarquía."
 *
 * En la práctica: un solo `variant="primary"` por bloque de acciones, el resto
 * en `secondary`/`outline`/`ghost`, y `danger` únicamente cuando la acción
 * destruye datos (eliminar, revocar, rechazar).
 *
 * ── Accesibilidad ────────────────────────────────────────────────────────
 * "Todos los controles interactivos deben mostrar un borde azul claramente
 *  visible al recibir foco."
 * `focus:outline-none` nunca va solo: siempre lo acompaña un anillo de 2px con
 * separación (`focus:ring-2 focus:ring-offset-2`). Su color sale de
 * `--vc-focus-ring` cuando la app la define (el panel la fija en su azul
 * informativo para las seis variantes) y, si no, del color propio de la
 * variante — que es lo que hace el sitio público.
 *
 * ── Geometría ────────────────────────────────────────────────────────────
 * El radio y la caja del tamaño `md` salen de las variables `--vc-*` que cada
 * app define en su CSS (ver `@vc/config/tailwind/theme.css`). El panel las
 * redefine para obtener el botón del diseño: 44px de alto, radio de 7px,
 * padding 16/12 y texto de 12px semibold centrado. Los tamaños `sm` y `lg` no
 * están especificados por la guía: conservan su ritmo actual en ambos
 * productos y solo comparten el radio.
 */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "whatsapp"
  | "outline"
  | "ghost"
  | "danger"
  | "dangerSolid";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  /**
   * React 19 pasa `ref` como una prop normal. Se declara para que un diálogo
   * pueda enfocar un botón concreto al abrir (ver `ConfirmDialog`, que enfoca
   * "Cancelar" y no la acción destructiva).
   */
  ref?: React.Ref<HTMLButtonElement>;
}

/* `vc-control` no es una utilidad de Tailwind: es el gancho de la regla CSS que
   pinta el estado deshabilitado. Se declara una vez en el tema compartido (con
   el `opacity: 0.5` histórico del sitio público) y el panel la redefine con la
   superficie plana de su guía. Ver el comentario en
   `@vc/config/tailwind/theme.css`. */
const BASE_CLASSES = [
  "vc-control",
  /* `justify-center` es lo que centra la etiqueta. No se añade `text-center`
     a propósito: cambiaría la alineación de los CTA del sitio público que sí
     parten en dos líneas en móvil. */
  "inline-flex items-center justify-center",
  "font-sora font-semibold",
  "transition-all duration-200",
  "cursor-pointer",
  "focus:outline-none focus:ring-2 focus:ring-offset-2",
  "focus:ring-[color:var(--vc-focus-ring,var(--vc-btn-ring))]",
].join(" ");

const SIZE_CLASSES: Record<ButtonSize, string> = {
  /* Botón compacto de los overlays y estados del sistema de la guía: texto de
     10px semibold y radio de 7px. La guía lo dibuja con padding 12/9 en la
     confirmación destructiva y 13/10 en el botón de reintento; se normaliza al
     punto intermedio (12/10) en vez de arrastrar la diferencia de 1px. */
  xs: "text-[10px] px-3 py-2.5 gap-1.5 rounded-[var(--vc-control-radius-sm)]",
  sm: "text-xs px-3.5 py-2 gap-1.5 rounded-[var(--vc-control-radius-sm)]",
  /* El único tamaño que la guía del panel describe. Cada pieza de la caja
     (alto, padding, cuerpo de texto e interlineado) es una variable para que
     el sitio público conserve su botón, donde el alto lo dicta el contenido. */
  md: [
    "h-[var(--vc-btn-md-height)]",
    "px-[var(--vc-btn-md-padding-x)] py-[var(--vc-btn-md-padding-y)]",
    "text-[length:var(--vc-btn-md-font-size)] leading-[var(--vc-btn-md-line-height)]",
    "gap-2 rounded-[var(--vc-control-radius)]",
  ].join(" "),
  lg: "text-base px-7 py-3.5 gap-2.5 rounded-[var(--vc-control-radius)]",
};

/* `[--vc-btn-ring:…]` fija el color de foco propio de cada variante. Solo se
   usa si la app no define `--vc-focus-ring`; es el comportamiento actual del
   sitio público, preservado tal cual. */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  /* Acción principal: naranja de marca con texto sobre acento (navy en la web,
     blanco en el panel — lo resuelve el token `on-accent`). */
  primary:
    "bg-brand-accent text-on-accent hover:bg-brand-sunset active:scale-[0.98] shadow-sm [--vc-btn-ring:var(--color-brand-accent)]",
  /* Acompaña al primario: blanco con borde neutro y texto navy. */
  secondary:
    "bg-white text-brand-navy border border-neutral-border hover:bg-neutral-soft active:scale-[0.98] shadow-sm [--vc-btn-ring:var(--color-brand-blue)]",
  whatsapp:
    "bg-brand-whatsapp text-brand-navy hover:brightness-105 active:scale-[0.98] shadow-sm [--vc-btn-ring:var(--color-brand-whatsapp)]",
  outline:
    "border-2 border-brand-navy/20 text-brand-navy hover:border-brand-navy hover:bg-brand-navy/5 active:scale-[0.98] [--vc-btn-ring:var(--color-brand-navy)]",
  ghost:
    "text-brand-navy hover:bg-brand-navy/5 active:scale-[0.98] [--vc-btn-ring:var(--color-brand-navy)]",
  /* Solo para acciones destructivas. */
  danger:
    "bg-danger-surface text-danger-ink border border-danger-border hover:brightness-[0.97] active:scale-[0.98] [--vc-btn-ring:var(--color-danger-ink)]",
  /* La misma acción destructiva, pero en sólido. Existe porque la guía la usa
     donde la variante suave sería invisible: dentro de la tarjeta de
     confirmación y de la alerta de error, cuyo fondo YA es `danger-surface`.
     Sigue valiendo "rojo se reserva para acciones destructivas": aquí el rojo
     no compite con el naranja principal porque es el único botón de acción del
     bloque. */
  dangerSolid:
    "bg-danger-ink text-white hover:brightness-110 active:scale-[0.98] shadow-sm [--vc-btn-ring:var(--color-danger-ink)]",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  icon,
  iconPosition = "right",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${BASE_CLASSES} ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="inline-flex shrink-0">{icon}</span>}
    </button>
  );
}
