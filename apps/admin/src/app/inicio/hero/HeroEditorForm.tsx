"use client";

import { Disclosure, FormField } from "@vc/ui";
import { EditorSection } from "../../../components/editor/EditorSection";
import { HeroCollageFields } from "./HeroCollageFields";
import type { HeroEditorState } from "../../../hooks/useHeroEditor";

export interface HeroEditorFormProps {
  editor: HeroEditorState;
}

const TWO_COLUMNS = "grid grid-cols-1 gap-4 sm:grid-cols-2";

/**
 * Tarjeta de edición del Hero principal.
 *
 * Sigue la anatomía del diseño (secciones con encabezado + ayuda, separadores,
 * campos compactos) pero cubre TODO lo que el Hero real guarda, que es más de
 * lo que el mockup dibuja: además del mensaje, la acción y la imagen, hay una
 * acción secundaria y una línea de confianza. Ninguna se elimina para
 * parecerse al mockup.
 */
export function HeroEditorForm({ editor }: HeroEditorFormProps) {
  const { hero } = editor;

  return (
    <div className="rounded-[8px] border border-neutral-border bg-white p-5">
      <EditorSection
        title="Contenido principal"
        help="Define el mensaje y el tono del primer bloque de la portada."
      >
        <FormField
          density="compact"
          id="hero-eyebrow"
          label="Insignia superior"
          value={hero.eyebrowText}
          onChange={(e) => hero.setEyebrowText(e.target.value)}
          placeholder="Empieza con una conversación"
        />

        <div className={TWO_COLUMNS}>
          <FormField
            density="compact"
            id="hero-title-highlight"
            label="Título principal"
            value={hero.titleHighlight}
            onChange={(e) => hero.setTitleHighlight(e.target.value)}
            placeholder="Tu viaje comienza"
            required
          />
          <FormField
            density="compact"
            id="hero-title-accent"
            label="Texto de acento"
            value={hero.titleAccent}
            onChange={(e) => hero.setTitleAccent(e.target.value)}
            placeholder="antes de despegar"
            required
          />
        </div>

        <FormField
          density="compact"
          multiline
          id="hero-description"
          label="Descripción"
          className="h-[66px] resize-none"
          value={hero.description}
          onChange={(e) => hero.setDescription(e.target.value)}
          placeholder="Desde la primera idea hasta tu regreso, una asesora te acompaña."
          required
        />
      </EditorSection>

      <EditorSection
        divider
        title="Collage de fotos"
        help="Una foto principal y tres de apoyo, siempre de clientes reales en su viaje. Cada una guarda su punto focal para recortarse bien en escritorio y móvil."
      >
        <HeroCollageFields editor={editor} />
      </EditorSection>

      <EditorSection
        divider
        title="Acción principal"
        help="Configura el botón de WhatsApp visible debajo del mensaje."
      >
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
          />
        </div>
      </EditorSection>

      <EditorSection
        divider
        title="Acción secundaria"
        help="Botón opcional junto al de WhatsApp. Si dejas el texto vacío, no se muestra."
      >
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
      </EditorSection>

      <EditorSection
        divider
        title="Línea de confianza"
        help="Frase con corazón bajo el botón. Solo cifras reales, nunca estimadas."
      >
        <FormField
          density="compact"
          id="hero-trust-stat"
          label="Texto de confianza"
          value={hero.trustStatText}
          onChange={(e) => hero.setTrustStatText(e.target.value)}
          placeholder="Más de 1,000 viajeros han confiado en nosotros."
        />

        <Disclosure summary="Campos heredados (sin uso actual en el Hero)">
          <p className="mb-3 font-inter text-[10px] leading-[1.5] text-neutral-muted">
            Estos tres pilares se siguen guardando pero el Hero actual no los muestra: venían de un
            diseño anterior y se conservan por si otra sección los necesita.
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
        </Disclosure>
      </EditorSection>
    </div>
  );
}
