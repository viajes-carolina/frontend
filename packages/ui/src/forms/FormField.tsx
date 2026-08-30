"use client";

import React from "react";

/* Lenguaje visual del panel (misma escala que la pantalla de acceso): label en
   mayúsculas con tracking sobre `admin-label`, campo `admin-field` con borde
   `admin-field-border` y radio de 7px. Se exportan para que `FormSelect` y
   cualquier campo suelto del panel usen exactamente el mismo par. */
export const FORM_LABEL_CLASSES =
  "block font-inter text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label";

export const FORM_CONTROL_CLASSES =
  "w-full rounded-[7px] border border-admin-field-border bg-admin-field px-3.5 py-2.5 font-inter text-[14px] text-admin-value transition-colors placeholder:text-admin-footnote/70 hover:border-admin-checkbox focus:border-brand-accent focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-60";

/* Escala compacta de los editores de contenido (Figma 930:4): label de 9px
   sobre `neutral-muted`, campo de 36px de alto con radio de 6px y texto de
   11px. Es la MISMA anatomía (label + control + mensaje), solo cambia la
   densidad — por eso vive como variante de `FormField` y no como un campo
   paralelo dentro de `apps/admin`. */
export const FORM_LABEL_COMPACT_CLASSES =
  "block font-inter text-[9px] font-semibold uppercase tracking-[0.45px] text-neutral-muted";

export const FORM_CONTROL_COMPACT_CLASSES =
  "w-full rounded-[6px] border border-neutral-border bg-admin-field px-3 py-2 font-inter text-[11px] leading-[1.45] text-neutral-ink transition-colors placeholder:text-neutral-muted/70 hover:border-admin-checkbox focus:border-brand-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/25 disabled:cursor-not-allowed disabled:opacity-60";

/** `comfortable` es la escala histórica del panel; `compact`, la de los editores. */
export type FormFieldDensity = "comfortable" | "compact";

interface FormFieldSharedProps {
  label: string;
  /** Texto de ayuda bajo el campo. Se oculta si hay `error`. */
  hint?: string;
  /** Mensaje de validación. Marca el campo con `aria-invalid`. */
  error?: string;
  /** Clases del contenedor (ej. `md:col-span-2` dentro de una grilla). */
  wrapperClassName?: string;
  density?: FormFieldDensity;
}

interface FormFieldSingleLineProps
  extends FormFieldSharedProps,
    React.InputHTMLAttributes<HTMLInputElement> {
  multiline?: false;
}

interface FormFieldMultilineProps
  extends FormFieldSharedProps,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  multiline: true;
}

export type FormFieldProps = FormFieldSingleLineProps | FormFieldMultilineProps;

/**
 * Campo de formulario (label + input/textarea) con el estilo oficial del panel.
 *
 * Antes devolvía un Fragment sin contenedor, así que cada formulario tenía que
 * envolverlo en un `<div>` propio — y donde no lo hacía, dentro de una grilla,
 * el label y el input caían en celdas distintas. Ahora trae su propio
 * contenedor y asocia `htmlFor`/`id` (generado con `useId` si no se pasa uno),
 * de modo que hacer clic en la etiqueta enfoca el campo y los lectores de
 * pantalla lo anuncian con su nombre.
 *
 * Usa `multiline` para renderizar un `<textarea>` en vez de un `<input>`.
 */
export const FormField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  (props, ref) => {
    const {
      label,
      multiline,
      className,
      hint,
      error,
      wrapperClassName = "",
      density = "comfortable",
      id,
      ...rest
    } = props;

    const generatedId = React.useId();
    const fieldId = id ?? generatedId;
    const messageId = `${fieldId}-message`;
    const message = error ?? hint;

    const compact = density === "compact";
    // El alto fijo de 36px solo aplica al `input`: el `textarea` recibe el suyo
    // desde quien lo usa (en el editor del Hero, 66px).
    const base = compact
      ? `${FORM_CONTROL_COMPACT_CLASSES}${multiline ? "" : " h-9"}`
      : FORM_CONTROL_CLASSES;
    const controlClassName = className ? `${base} ${className}` : base;
    const describedBy = message ? messageId : undefined;

    return (
      <div className={`${compact ? "space-y-1.5" : "space-y-2"} ${wrapperClassName}`}>
        <label htmlFor={fieldId} className={compact ? FORM_LABEL_COMPACT_CLASSES : FORM_LABEL_CLASSES}>
          {label}
          {rest.required && (
            <span aria-hidden="true" className="ml-1 text-brand-accent">
              *
            </span>
          )}
        </label>

        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={fieldId}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={controlClassName}
            {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            id={fieldId}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={controlClassName}
            {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        {message && (
          <p
            id={messageId}
            className={`font-inter leading-[1.45] ${compact ? "text-[10px]" : "text-[12px]"} ${
              error ? "text-brand-accent" : "text-admin-footnote"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
