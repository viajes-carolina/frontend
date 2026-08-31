"use client";

import { FormField } from "@vc/ui";
import type { HeroEditorState } from "../../../hooks/useHeroEditor";

export interface HeroActionFieldsProps {
  hero: HeroEditorState["hero"];
}

const TWO_COLUMNS = "grid grid-cols-1 gap-4 sm:grid-cols-2";

/**
 * Contenido del acordeón "Acciones y enlaces" (Figma 958:459, punto 2): los
 * dos botones del Hero y el enlace del secundario.
 *
 * El botón de WhatsApp sí se dibuja en la portada. El secundario NO: ni
 * `HeroSection` ni ninguna otra pieza de `apps/web` leen `secondaryCtaText` o
 * `secondaryCtaUrl` hoy — solo se guardan. La ayuda lo dice en vez de repetir
 * el "aparece junto al de WhatsApp" que llevaba antes y que no era cierto.
 */
export function HeroActionFields({ hero }: HeroActionFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-3 font-inter text-[10px] font-semibold uppercase tracking-[0.45px] text-admin-label">
          Botón de WhatsApp
        </p>
        <div className={TWO_COLUMNS}>
          <FormField
            density="compact"
            id="hero-whatsapp-cta"
            label="Texto del botón"
            value={hero.whatsappCtaText}
            onChange={(e) => hero.setWhatsappCtaText(e.target.value)}
            placeholder="Cuéntanos qué imaginas"
            required
          />
          <FormField
            density="compact"
            id="hero-whatsapp-message"
            label="Mensaje prefijado"
            value={hero.whatsappMessageOverride}
            onChange={(e) => hero.setWhatsappMessageOverride(e.target.value)}
            placeholder="Hola Viajes Carolina, quiero empezar a planear mi próximo viaje."
            hint="Si lo dejas vacío se usa el mensaje por defecto de la configuración del sitio."
          />
        </div>
      </div>

      <div className="border-t border-neutral-border pt-4">
        <p className="mb-1 font-inter text-[10px] font-semibold uppercase tracking-[0.45px] text-admin-label">
          Botón secundario
        </p>
        <p className="mb-3 font-inter text-[10px] leading-[1.5] text-neutral-muted">
          El Hero público todavía no dibuja este botón: los valores se guardan y
          viajan en el contenido, pero hoy no se ven en la portada.
        </p>
        <div className={TWO_COLUMNS}>
          <FormField
            density="compact"
            id="hero-secondary-cta"
            label="Texto del botón"
            value={hero.secondaryCtaText}
            onChange={(e) => hero.setSecondaryCtaText(e.target.value)}
            placeholder="Explorar promociones"
          />
          <FormField
            density="compact"
            id="hero-secondary-url"
            label="Destino"
            value={hero.secondaryCtaUrl}
            onChange={(e) => hero.setSecondaryCtaUrl(e.target.value)}
            placeholder="#promociones"
          />
        </div>
      </div>
    </div>
  );
}
