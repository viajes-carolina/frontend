"use client";

import React from "react";
import { Button } from "./Button";

export interface SaveBarProps {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard: () => void;
  message?: string;
  className?: string;
}

/**
 * Barra de guardado contextual: solo se monta en el DOM cuando hay cambios
 * pendientes (`dirty`). Reproduce la barra fija ya usada en los formularios
 * de admin (HeroForm/AboutForm), ahora reusable desde `@vc/ui`.
 */
export function SaveBar({
  dirty,
  saving,
  onSave,
  onDiscard,
  message = "Tienes cambios sin guardar",
  className = "",
}: SaveBarProps) {
  if (!dirty) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-neutral-border bg-neutral-soft/95 backdrop-blur ${className}`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between gap-4">
        <p className="font-inter text-sm text-brand-navy font-medium">{message}</p>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={onDiscard} disabled={saving}>
            Descartar
          </Button>
          <Button type="button" variant="primary" onClick={onSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>
    </div>
  );
}
