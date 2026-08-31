"use client";

import React from "react";

/* ==========================================================================
   Lenguaje visual del campo — guía de estilo del panel

   Etiqueta: 10px bold, mayúsculas, tracking 0.4px, color #475766
             (`admin-label`), separada 7px del control.
   Control:  alto 44px (textarea 72px), radio 7px, padding 12px,
             fondo #f9f9fa (`admin-field`), texto 12px #29333d (`admin-value`).

   Cuatro estados, y solo cuatro:
     normal        borde 1px #d6dee3 (`neutral-border`)
     foco          borde 2px #2980ba (`info`)
     error         borde 1px #d14040 (`danger-field`) + ayuda 10px #b82929
     deshabilitado fondo #f0f2f5 (`neutral-quiet-surface`), borde #d6dee3,
                   texto #8c96a1 (`control-disabled-ink`)

   Accesibilidad — "Todos los controles interactivos deben mostrar un borde
   azul claramente visible al recibir foco." El campo no usa anillo sino el
   propio borde, engrosado a 2px en `info`. `focus:outline-none` va acompañado
   de ese borde, nunca solo.

   El engrosamiento del borde NO descuadra el alto: el alto es fijo (44px) y
   `box-sizing: border-box`, así que el píxel extra sale del área de contenido,
   no de la caja. Lo que sí se movería es el texto, 1px hacia adentro por lado;
   por eso el foco compensa el padding a 11px.

   Estas constantes se exportan para que `FormSelect` y cualquier campo suelto
   del panel usen exactamente el mismo par etiqueta/control.
   ========================================================================== */
export const FORM_LABEL_CLASSES =
  "block font-inter text-[10px] font-bold uppercase tracking-[0.4px] text-admin-label";

/** Cadena común a input, textarea y select, SIN color de borde y SIN alto.
 *
 *  El color de borde se elige aparte (`FORM_CONTROL_BORDER_CLASSES` o
 *  `FORM_CONTROL_ERROR_BORDER_CLASSES`) y nunca se añade "encima" del otro:
 *  `border-neutral-border` y `border-danger-field` son dos utilidades de la
 *  misma propiedad y especificidad, y Tailwind las emite en su propio orden
 *  (el neutro va después del rojo en la hoja generada). Sumar la de error al
 *  final de la cadena de clases NO la hace ganar — el campo inválido se seguía
 *  viendo gris. Por eso se sustituye una por otra en vez de superponerlas.
 *
 *  El alto lo añade cada forma del control (`FORM_CONTROL_SINGLE_LINE_CLASSES`
 *  / `FORM_CONTROL_MULTILINE_CLASSES`): 44px y 72px no son intercambiables. */
export const FORM_CONTROL_BASE_CLASSES = [
  "w-full rounded-[var(--vc-control-radius)]",
  "border bg-admin-field",
  "p-3 font-inter text-[12px] text-admin-value",
  "transition-colors placeholder:text-admin-footnote/70",
  "hover:border-admin-checkbox",
  /* Foco: borde de 2px en el azul informativo, con el padding compensado para
     que el texto no salte. Gana al color de borde de error (`focus:` añade una
     pseudoclase, 0-2-0 contra 0-1-0), y así debe ser: mientras el campo está
     enfocado, el foco tiene que verse. */
  "focus:outline-none focus:border-2 focus:border-info focus:p-[11px]",
  "disabled:cursor-not-allowed disabled:bg-neutral-quiet-surface disabled:text-control-disabled-ink disabled:border-neutral-border",
].join(" ");

export const FORM_CONTROL_BORDER_CLASSES = "border-neutral-border";
export const FORM_CONTROL_ERROR_BORDER_CLASSES = "border-danger-field";

/** Cadena completa en estado normal. */
export const FORM_CONTROL_CLASSES = `${FORM_CONTROL_BASE_CLASSES} ${FORM_CONTROL_BORDER_CLASSES}`;

export const FORM_CONTROL_SINGLE_LINE_CLASSES = `${FORM_CONTROL_CLASSES} h-11`;
export const FORM_CONTROL_MULTILINE_CLASSES = `${FORM_CONTROL_CLASSES} min-h-[72px]`;

/* Escala compacta de los editores de contenido (Figma 930:4): label de 9px
   sobre `neutral-muted`, campo de 36px de alto y texto de 11px. Es la MISMA
   anatomía (label + control + mensaje), solo cambia la densidad — por eso vive
   como variante de `FormField` y no como un campo paralelo dentro de
   `apps/admin`. Comparte con la escala normal el radio, los colores de estado
   y el borde de foco de 2px. */
export const FORM_LABEL_COMPACT_CLASSES =
  "block font-inter text-[9px] font-semibold uppercase tracking-[0.45px] text-neutral-muted";

export const FORM_CONTROL_COMPACT_BASE_CLASSES = [
  "w-full rounded-[var(--vc-control-radius)]",
  "border bg-admin-field",
  "px-3 py-2 font-inter text-[11px] leading-[1.45] text-neutral-ink",
  "transition-colors placeholder:text-neutral-muted/70",
  "hover:border-admin-checkbox",
  "focus:outline-none focus:border-2 focus:border-info focus:px-[11px] focus:py-[7px]",
  "disabled:cursor-not-allowed disabled:bg-neutral-quiet-surface disabled:text-control-disabled-ink disabled:border-neutral-border",
].join(" ");

export const FORM_CONTROL_COMPACT_CLASSES = `${FORM_CONTROL_COMPACT_BASE_CLASSES} ${FORM_CONTROL_BORDER_CLASSES}`;

/** `comfortable` es la escala de la guía de estilo; `compact`, la de los editores. */
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
 * Trae su propio contenedor y asocia `htmlFor`/`id` (generado con `useId` si no
 * se pasa uno), de modo que hacer clic en la etiqueta enfoca el campo y los
 * lectores de pantalla lo anuncian con su nombre.
 *
 * Usa `multiline` para renderizar un `<textarea>` en vez de un `<input>`.
 *
 * El mensaje de error se muestra debajo, en 10px sobre `danger-ink` — el estado
 * no depende solo del color del borde, también hay texto ("Revisa este campo
 * antes de continuar.") y `aria-invalid` para quien no lo ve.
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
    /* El alto fijo solo aplica a la forma de una línea; el textarea recibe su
       piso (72px en la escala normal, el histórico 36px del editor en la
       compacta) y crece desde ahí. */
    const shape = compact
      ? `${FORM_CONTROL_COMPACT_BASE_CLASSES}${multiline ? "" : " h-9"}`
      : multiline
        ? `${FORM_CONTROL_BASE_CLASSES} min-h-[72px]`
        : `${FORM_CONTROL_BASE_CLASSES} h-11`;

    /* El color de borde SUSTITUYE al neutro; no se apila sobre él. Ver el
       comentario de `FORM_CONTROL_BASE_CLASSES`. */
    const borderClass = error ? FORM_CONTROL_ERROR_BORDER_CLASSES : FORM_CONTROL_BORDER_CLASSES;

    const controlClassName = [shape, borderClass, className ?? ""].filter(Boolean).join(" ");
    const describedBy = message ? messageId : undefined;

    return (
      <div className={`${compact ? "space-y-1.5" : "space-y-[7px]"} ${wrapperClassName}`}>
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
            className={`font-inter text-[10px] leading-[1.45] ${
              error ? "text-danger-ink" : "text-admin-footnote"
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
