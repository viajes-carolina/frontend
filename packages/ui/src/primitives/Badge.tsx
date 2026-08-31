import React from "react";

/**
 * Píldora de estado del panel administrativo.
 *
 * ── Anatomía (guía de estilo del panel) ──────────────────────────────────
 * Radio 999px, padding 10px horizontal / 7px vertical, texto de 10px semibold.
 *
 * ── Tonos ────────────────────────────────────────────────────────────────
 * Se nombran por lo que SIGNIFICAN, no por su color: el mismo azul que hoy
 * dice "publicado" puede pasar a otro tono sin que haya que renombrar nada en
 * las pantallas. El ejemplo del diseño va entre paréntesis.
 *
 *   info    #e5f2fa / #2980ba  ("Publicado")
 *   neutral #f0f2f5 / #5b6b79  ("Borrador")
 *   accent  #fff0e3 / #f95d09  ("En portada")
 *   danger  #fff0f0 / #b82929  ("Error")
 *   success #e0faeb / #138f63  ("WhatsApp")
 *
 * ── Accesibilidad ────────────────────────────────────────────────────────
 * "Selección, visibilidad y estado sin depender únicamente del color."
 * Por eso `children` es obligatorio y siempre es texto: el tono acompaña al
 * estado, no lo sustituye. No existe una variante "solo punto de color".
 *
 * ── Alcance ──────────────────────────────────────────────────────────────
 * Los tonos se apoyan en tokens que solo declara el `@theme` de
 * `apps/admin/src/app/globals.css` (`info-surface`, `neutral-quiet-*`,
 * `accent-soft-surface`, `whatsapp-surface`, `danger-*`), igual que ya ocurre
 * con `FormField` y la familia `admin-*`. Es un componente del panel; en
 * `apps/web` esos tokens no existen y el badge saldría sin color.
 */
export type BadgeTone = "info" | "neutral" | "accent" | "danger" | "success";

export interface BadgeProps {
  /** Etiqueta visible. Obligatoria: el estado nunca se comunica solo con color. */
  children: React.ReactNode;
  tone?: BadgeTone;
  /** Ícono opcional a la izquierda del texto. Decorativo: no reemplaza a `children`. */
  icon?: React.ReactNode;
  className?: string;
  /** `title` nativo, para el texto largo que no cabe en la píldora. */
  title?: string;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  info: "bg-info-surface text-info",
  neutral: "bg-neutral-quiet-surface text-neutral-quiet-ink",
  accent: "bg-accent-soft-surface text-brand-accent",
  danger: "bg-danger-surface text-danger-ink",
  success: "bg-whatsapp-surface text-state-published",
};

const BASE_CLASSES = [
  "inline-flex items-center gap-1 shrink-0",
  "rounded-full px-[10px] py-[7px]",
  "font-inter text-[10px] font-semibold leading-none",
  "whitespace-nowrap",
].join(" ");

export const Badge: React.FC<BadgeProps> = ({
  children,
  tone = "neutral",
  icon,
  className = "",
  title,
}) => (
  <span className={`${BASE_CLASSES} ${TONE_CLASSES[tone]} ${className}`} title={title}>
    {icon && (
      <span aria-hidden="true" className="inline-flex shrink-0">
        {icon}
      </span>
    )}
    {children}
  </span>
);
