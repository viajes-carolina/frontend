"use client";

import { FormField } from "@vc/ui";
import type { HeroEditorState } from "../../../hooks/useHeroEditor";

export interface HeroAdvancedFieldsProps {
  hero: HeroEditorState["hero"];
}

/**
 * Contenido del acordeón "Opciones avanzadas" (Figma 958:459, punto 2).
 *
 * Aquí van los campos que el Hero SÍ guarda pero que la portada no dibuja
 * hoy. Antes vivían en un `Disclosure` anidado dentro de "Línea de confianza"
 * (un acordeón dentro de otro), y `badgeText` directamente no tenía campo: se
 * guardaba en cada `PUT` sin que nadie pudiera verlo ni corregirlo.
 *
 * No se ocultan del todo porque siguen persistiendo: si el valor almacenado es
 * incorrecto, alguien tiene que poder arreglarlo. Y no se mezclan con el
 * mensaje principal porque anunciarían un efecto en la portada que no existe.
 */
export function HeroAdvancedFields({ hero }: HeroAdvancedFieldsProps) {
  return (
    <div className="space-y-4">
      <p className="font-inter text-[10px] leading-[1.5] text-neutral-muted">
        Campos que se siguen guardando con el Hero pero que la portada no muestra
        en su diseño actual. Se conservan por si otra sección los reutiliza.
      </p>

      <FormField
        density="compact"
        id="hero-badge-text"
        label="Insignia heredada"
        value={hero.badgeText}
        onChange={(e) => hero.setBadgeText(e.target.value)}
        placeholder="Empieza con una conversación"
        hint="Antecesora de la “Insignia superior”. La portada dibuja la de arriba, no esta."
      />

      <div>
        <p className="mb-3 font-inter text-[10px] font-semibold uppercase tracking-[0.45px] text-admin-label">
          Pilares de confianza
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <FormField
              key={index}
              density="compact"
              id={`hero-trust-indicator-${index}`}
              label={`Pilar ${index + 1}`}
              value={hero.trustIndicators[index] || ""}
              onChange={(e) => hero.updateTrustIndicator(index, e.target.value)}
              placeholder={`Pilar ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
