"use client";

import React, { useRef, useState } from "react";

export interface ClaimAttachmentUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  accept?: string;
}

const DEFAULT_ACCEPT = ".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg";

/**
 * Dropzone simple multi-archivo. Solo maneja `File[]` en memoria — la subida
 * real ocurre después de crear el reclamo (ver useClaimWizard). Sin recorte de
 * foco ni preview de imagen: eso es exclusivo de la librería de medios.
 */
export function ClaimAttachmentUploader({
  files,
  onFilesChange,
  accept = DEFAULT_ACCEPT,
}: ClaimAttachmentUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;
    onFilesChange([...files, ...Array.from(incoming)]);
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h3 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-1.5">
        Documentos de apoyo · opcional
      </h3>
      <p className="text-xs text-neutral-muted mb-3">
        Adjunta comprobantes, capturas o documentos si ayudan a explicar lo ocurrido.
      </p>

      <div
        role="button"
        tabIndex={0}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`cursor-pointer flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
          isDragging
            ? "border-brand-accent bg-brand-accent/5"
            : "border-neutral-border hover:border-brand-navy/30"
        }`}
      >
        <span className="text-sm font-semibold text-brand-navy">Arrastra tus archivos aquí</span>
        <span className="text-xs text-neutral-muted">o haz clic para seleccionarlos (PDF, PNG, JPG)</span>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-3 bg-neutral-soft border border-neutral-border rounded-xl px-3 py-2"
            >
              <span className="text-xs text-brand-navy truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 shrink-0"
                aria-label={`Quitar ${file.name}`}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-2 text-[11px] text-neutral-subtle">
        Evita adjuntar información sensible que no sea necesaria.
      </p>
    </div>
  );
}
