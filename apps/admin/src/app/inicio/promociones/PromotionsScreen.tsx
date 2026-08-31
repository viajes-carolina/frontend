"use client";

import React from "react";
import type { AdminPromotionsPageResponse, HomePromotionsSectionDTO } from "@vc/api-client";
import { Button, ChevronDownIcon } from "@vc/ui";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { PromotionsSectionForm } from "../PromotionsSectionForm";
import { PromotionsCatalogPanel } from "./PromotionsCatalogPanel";

/**
 * Pantalla de Promociones (diseño `958:639`).
 *
 * ── Por qué el encabezado de sección está plegado ────────────────────────
 * El diseño pone en la cabecera un botón "Editar encabezado" y dedica el resto
 * de la pantalla al catálogo: resumen, barra de herramientas y tabla. El
 * formulario del encabezado de la sección (título, subtítulo y cierre
 * "Propuesta a medida" del Home) sigue estando aquí — se edita mucho menos que
 * el catálogo — pero deja de empujar la tabla 900px hacia abajo.
 */
export interface PromotionsScreenProps {
  initialSection?: HomePromotionsSectionDTO;
  /** La primera página del catálogo, no el catálogo entero. */
  initialPromotionsPage: AdminPromotionsPageResponse;
}

export function PromotionsScreen({ initialSection, initialPromotionsPage }: PromotionsScreenProps) {
  const [isHeaderEditorOpen, setIsHeaderEditorOpen] = React.useState(false);
  const panelId = React.useId();

  return (
    <>
      <AdminPageHeader
        eyebrow="Inicio / Promociones / Catálogo"
        title="Promociones"
        /* El diseño dice "contenido importado desde Facebook". Se corrige a
           "publicado en": el importador se retiró y hoy el flujo es de salida
           — al crear una promoción el backend publica el post en la Página. */
        description="Administra el catálogo, la visibilidad en portada y el contenido publicado en Facebook."
        action={
          <Button
            variant="secondary"
            size="sm"
            type="button"
            aria-expanded={isHeaderEditorOpen}
            aria-controls={isHeaderEditorOpen ? panelId : undefined}
            onClick={() => setIsHeaderEditorOpen((open) => !open)}
            icon={
              <ChevronDownIcon
                size={12}
                aria-hidden="true"
                className={`transition-transform duration-150 ${isHeaderEditorOpen ? "rotate-180" : ""}`}
              />
            }
            iconPosition="right"
          >
            {isHeaderEditorOpen ? "Ocultar encabezado" : "Editar encabezado"}
          </Button>
        }
      />

      <div className="mt-8 space-y-8">
        {isHeaderEditorOpen && (
          <div id={panelId}>
            <PromotionsSectionForm initialConfig={initialSection} />
          </div>
        )}

        <PromotionsCatalogPanel initialPage={initialPromotionsPage} />
      </div>
    </>
  );
}
