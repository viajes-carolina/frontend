"use client";

import React from "react";
import { Button } from "../primitives/Button";
import { FormFeedback, type FormFeedbackState } from "./FormFeedback";

export interface FormCardProps {
  /** Título de la tarjeta. Se renderiza como `h2` (el `h1` vive en el layout de cada sección). */
  title: string;
  description?: React.ReactNode;
  /** Contenido alineado a la derecha del encabezado (ej. un switch de visibilidad). */
  headerAside?: React.ReactNode;
  feedback?: FormFeedbackState | null;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  /** Texto del botón en reposo. Durante el guardado se muestra `savingLabel`. */
  submitLabel: string;
  savingLabel?: string;
  saving?: boolean;
  /** Deshabilita el envío por reglas propias del formulario (se suma a `saving`). */
  submitDisabled?: boolean;
  /** Acciones extra a la izquierda del botón principal (ej. "Cancelar"). */
  footerAside?: React.ReactNode;
  /** Clases extra del `<form>`. El ancho máximo por defecto es `max-w-4xl`. */
  className?: string;
  /**
   * `id` del `<form>`. Sirve para que un botón situado FUERA de la tarjeta la
   * envíe con el atributo `form="…"` — el caso de una barra de guardado
   * persistente que vive al pie de la pantalla, no dentro del formulario.
   */
  id?: string;
  /**
   * Oculta el pie con el botón de guardado. Se usa cuando esa acción ya vive en
   * una barra persistente: sin esto la pantalla mostraba **el mismo botón dos
   * veces**, que contradice la regla de la guía "una acción principal por
   * bloque". Al ocultarlo, el envío debe quedar garantizado desde fuera (ver `id`).
   */
  hideFooter?: boolean;
  children: React.ReactNode;
}

/**
 * Tarjeta de formulario del panel administrativo: encabezado (título +
 * descripción) separado por una divisoria, cuerpo con los campos y pie con la
 * acción de guardado.
 *
 * Unifica el bloque que ~20 formularios repetían a mano y, de paso, cierra
 * tres inconsistencias que venían con él:
 *
 * - El contenedor es siempre un `<form onSubmit>`, nunca un `<div>` con
 *   `onClick` en el botón: los que eran `<div>` no se podían enviar con Enter.
 * - El texto del botón muestra siempre el estado de guardado (`savingLabel`),
 *   en vez de quedarse estático en unos formularios y ser dinámico en otros.
 * - El feedback pasa por `FormFeedback`, que aporta el `role="status"` que
 *   ninguno tenía.
 *
 * Adopta el lenguaje visual de la pantalla de acceso: bordes de 12px, labels
 * en mayúsculas con tracking, divisorias `admin-divider` y sombra suave.
 */
export function FormCard({
  title,
  description,
  headerAside,
  feedback = null,
  onSubmit,
  submitLabel,
  savingLabel = "Guardando...",
  saving = false,
  submitDisabled = false,
  footerAside,
  className = "",
  id,
  hideFooter = false,
  children,
}: FormCardProps) {
  return (
    <form
      id={id}
      onSubmit={onSubmit}
      className={`w-full max-w-4xl rounded-[12px] border border-neutral-border bg-white p-6 font-inter shadow-[0_8px_24px_rgba(17,34,48,0.06)] sm:p-8 ${className}`}
    >
      <div className="mb-6 flex flex-col gap-4 border-b border-admin-divider pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-inter text-[18px] font-bold leading-tight text-neutral-ink">{title}</h2>
          {description && (
            <p className="mt-1.5 max-w-3xl font-inter text-[13px] leading-[1.55] text-neutral-muted">
              {description}
            </p>
          )}
        </div>
        {headerAside && <div className="shrink-0">{headerAside}</div>}
      </div>

      {/* Fuera del `space-y-6` de abajo a propósito: la región live sigue en el
          DOM cuando no hay mensaje, y como hermana de `space-y-*` habría
          corrido un margen muerto hacia el primer campo. */}
      <FormFeedback feedback={feedback} />

      <div className="space-y-6">{children}</div>

      {!hideFooter && (
        <div className="mt-8 flex items-center justify-end gap-3 border-t border-admin-divider pt-6">
          {footerAside}
          <Button variant="primary" type="submit" disabled={saving || submitDisabled}>
            {saving ? savingLabel : submitLabel}
          </Button>
        </div>
      )}
    </form>
  );
}
