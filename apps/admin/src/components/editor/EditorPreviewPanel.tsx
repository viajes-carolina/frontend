"use client";

import type { ReactNode } from "react";
import { EditorDeviceSwitch, type PreviewDevice } from "./EditorDeviceSwitch";

export interface EditorPreviewPanelProps {
  device: PreviewDevice;
  onDeviceChange: (device: PreviewDevice) => void;
  /** Nota al pie verde del diseño. */
  footnote: string;
  children: ReactNode;
}

/**
 * Columna derecha de los editores de contenido (Figma 930:4): título,
 * conmutador de dispositivo, la previsualización y la nota al pie que aclara
 * que lo que se ve es el formulario en curso, no lo guardado.
 */
export function EditorPreviewPanel({
  device,
  onDeviceChange,
  footnote,
  children,
}: EditorPreviewPanelProps) {
  return (
    <aside className="rounded-[8px] border border-neutral-border bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-inter text-[14px] font-semibold text-neutral-ink">Vista previa</h2>
        <EditorDeviceSwitch value={device} onChange={onDeviceChange} />
      </div>

      <div className="mt-4">{children}</div>

      <p className="mt-4 flex items-center gap-2 rounded-[6px] bg-state-published-surface px-3 py-2 font-inter text-[10px] font-medium text-state-published">
        <span aria-hidden="true" className="h-[7px] w-[7px] shrink-0 rounded-full bg-state-published" />
        {footnote}
      </p>
    </aside>
  );
}
