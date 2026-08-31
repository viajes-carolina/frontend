"use client";

import { Badge, Disclosure, FormField } from "@vc/ui";
import { EditorSection } from "../../../components/editor/EditorSection";
import { HeroActionFields } from "./HeroActionFields";
import { HeroAdvancedFields } from "./HeroAdvancedFields";
import { HeroCollageFields } from "./HeroCollageFields";
import type { HeroEditorState } from "../../../hooks/useHeroEditor";

export interface HeroEditorFormProps {
  editor: HeroEditorState;
}

const TWO_COLUMNS = "grid grid-cols-1 gap-4 sm:grid-cols-2";

/**
 * Tarjeta de edición del Hero principal (Figma 958:459).
 *
 * Dos bloques siempre visibles — el mensaje y el collage, que es lo que
 * cualquiera viene a cambiar — y tres acordeones cerrados para el resto:
 * "Acciones y enlaces", "Línea de confianza" y "Opciones avanzadas". Ninguna
 * de las cuatro pantallas antiguas del Hero pierde campos por el camino; solo
 * cambian de sitio.
 */
export function HeroEditorForm({ editor }: HeroEditorFormProps) {
  const { hero, contentStatus } = editor;

  return (
    <div className="rounded-[8px] border border-neutral-border bg-white p-5">
      <EditorSection
        title="Contenido principal"
        help="Define el mensaje y el tono del primer bloque de la portada."
        status={
          <Badge tone={contentStatus.tone} title={contentStatus.detail}>
            {contentStatus.label}
          </Badge>
        }
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

      <div className="mt-5">
        <Disclosure summary="Acciones y enlaces" variant="panel" className="mb-2">
          <HeroActionFields hero={hero} />
        </Disclosure>

        <Disclosure summary="Línea de confianza" variant="panel" className="mb-2">
          <FormField
            density="compact"
            id="hero-trust-stat"
            label="Texto de confianza"
            value={hero.trustStatText}
            onChange={(e) => hero.setTrustStatText(e.target.value)}
            placeholder="Más de 1,000 viajeros han confiado en nosotros."
            hint="Aparece con un corazón bajo el botón. Solo cifras reales, nunca estimadas."
          />
        </Disclosure>

        <Disclosure summary="Opciones avanzadas" variant="panel">
          <HeroAdvancedFields hero={hero} />
        </Disclosure>
      </div>
    </div>
  );
}
