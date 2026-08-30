"use client";

import React from "react";
import { CheckIcon, CloseIcon } from "../icons/icons";

export type FormFeedbackTone = "success" | "error";

/**
 * Estado único de feedback de un formulario del panel.
 *
 * Reemplaza las dos formas incompatibles que convivían antes: el objeto
 * `{ type, text }` renderizado fuera de la tarjeta y el par de flags
 * `error` / `success` renderizado dentro. Un solo valor nullable evita
 * además el estado imposible "éxito y error a la vez".
 */
export interface FormFeedbackState {
  tone: FormFeedbackTone;
  message: string;
}

export interface FormFeedbackProps {
  feedback: FormFeedbackState | null;
  /** Clases extra para el banner visible. El margen inferior lo aporta el propio componente. */
  className?: string;
}

/**
 * Banner de resultado de guardado, en la paleta del panel.
 *
 * Dos decisiones importantes:
 *
 * 1. La región `role="status"` se renderiza SIEMPRE, aunque no haya mensaje.
 *    Varios lectores de pantalla solo anuncian una región live si ya existía
 *    en el DOM antes de recibir contenido; montarla junto con el mensaje deja
 *    el "Cambios guardados" en silencio. Cuando `feedback` es `null` el
 *    contenedor queda vacío y no ocupa alto — por eso NO debe colocarse como
 *    hijo directo de un contenedor `space-y-*` (contaría como hermano y
 *    correría un margen muerto).
 *
 * 2. Los colores salen de los tokens del panel, no de la paleta por defecto
 *    de Tailwind: la retokenización del admin redefine `brand-*` y `neutral-*`,
 *    pero no `emerald-*`/`red-*`, así que los banners viejos quedaban fuera de
 *    la paleta. Éxito en navy con check, error en el naranja de acento con
 *    aspa — el mismo lenguaje del banner de error de la pantalla de acceso.
 */
export function FormFeedback({ feedback, className = "" }: FormFeedbackProps) {
  const isSuccess = feedback?.tone === "success";

  return (
    <div role="status" aria-live="polite">
      {feedback && (
        <div
          className={`mb-6 flex items-start gap-3 rounded-[10px] border px-4 py-3 ${
            isSuccess
              ? "border-brand-navy/20 bg-brand-navy/[0.05]"
              : "border-brand-accent/35 bg-brand-accent/10"
          } ${className}`}
        >
          <span
            className={`mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
              isSuccess ? "bg-brand-navy text-white" : "bg-brand-accent text-on-accent"
            }`}
          >
            {isSuccess ? (
              <CheckIcon size={11} aria-hidden="true" />
            ) : (
              <CloseIcon size={11} aria-hidden="true" />
            )}
          </span>
          <span className="font-inter text-[13px] leading-[1.5] text-neutral-ink">{feedback.message}</span>
        </div>
      )}
    </div>
  );
}
