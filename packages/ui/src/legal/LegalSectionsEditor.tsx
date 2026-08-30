"use client";

import React from "react";
import type { LegalSectionDTO } from "@vc/api-client";
import { FormField } from "../forms/FormField";
import { Button } from "../primitives/Button";
import { PlusIcon, TrashIcon } from "../icons/icons";

export interface LegalSectionsEditorProps {
  sections: LegalSectionDTO[];
  onUpdate: (index: number, field: "title" | "body", value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

// Editor de lista repetible de secciones ({title, body}) compartido por los 5
// formularios admin de páginas legales — sin drag-and-drop, solo agregar al
// final y quitar por índice. Vive en `@vc/ui` (no en `apps/admin`) para no
// duplicar esta plantilla 5 veces.
export function LegalSectionsEditor({ sections, onUpdate, onAdd, onRemove }: LegalSectionsEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-inter text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label">
          Secciones del documento ({sections.length})
        </h3>
        <Button type="button" variant="outline" size="sm" icon={<PlusIcon size={16} />} iconPosition="left" onClick={onAdd}>
          Agregar sección
        </Button>
      </div>

      {sections.map((section, idx) => (
        <div key={idx} className="space-y-3 rounded-[10px] border border-admin-divider bg-admin-field p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="font-inter text-xs font-semibold text-brand-accent">
              Sección {String(idx + 1).padStart(2, "0")}
            </span>
            <Button
              type="button"
              variant="danger"
              size="sm"
              icon={<TrashIcon size={14} />}
              iconPosition="left"
              onClick={() => onRemove(idx)}
            >
              Quitar esta sección
            </Button>
          </div>
          <FormField
            label="Título"
            type="text"
            value={section.title}
            onChange={(e) => onUpdate(idx, "title", e.target.value)}
            placeholder="Título de la sección"
          />
          <FormField
            label="Contenido"
            multiline
            rows={3}
            value={section.body}
            onChange={(e) => onUpdate(idx, "body", e.target.value)}
            placeholder="Texto de la sección"
          />
        </div>
      ))}

      {sections.length === 0 && (
        <p className="font-inter text-xs italic text-neutral-muted">Todavía no hay secciones. Agrega la primera.</p>
      )}
    </div>
  );
}
