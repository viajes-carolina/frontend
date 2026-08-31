"use client";

import React, { useRef, useState } from "react";
import { Button, DownloadIcon, FormFeedback, UploadIcon, type FormFeedbackState } from "@vc/ui";

/* ==========================================================================
   Franja de intercambio por archivo .md.

   Deja bajar el formulario a un archivo, rellenarlo fuera del panel y volver a
   subirlo. La comparten el modal de promoción y el de artículo; lo que cambia
   entre los dos (qué se escribe y cómo se lee) llega por props: aquí solo vive
   la mecánica del navegador.
   ========================================================================== */

export interface TemplateExchangeBarProps {
  /** Frase que explica para qué sirve, en el idioma de cada formulario. */
  hint: string;
  /** Se llama al pulsar «Descargar»: devuelve nombre y contenido del archivo. */
  buildFile: () => { filename: string; content: string };
  /** Aplica el texto del archivo a los campos y devuelve qué contar al usuario. */
  applyFile: (text: string) => FormFeedbackState;
  downloadLabel?: string;
  uploadLabel?: string;
  /**
   * Separación con lo que viene debajo. La pone quien la usa porque el modal de
   * artículo ya envuelve el formulario en `space-y-6` y un margen propio se
   * sumaría al del contenedor.
   */
  className?: string;
}

/**
 * Tope de tamaño.
 *
 * Un artículo largo no llega a 200 KB. El tope está para que elegir por error
 * un vídeo o un PDF se explique con una frase en vez de congelar la pestaña
 * leyendo megas en memoria.
 */
const MAX_BYTES = 2 * 1024 * 1024;

const ACCEPTED_EXTENSIONS = [".md", ".markdown", ".txt"];

export function TemplateExchangeBar({
  hint,
  buildFile,
  applyFile,
  downloadLabel = "Descargar plantilla",
  uploadLabel = "Cargar archivo",
  className = "",
}: TemplateExchangeBarProps) {
  const [feedback, setFeedback] = useState<FormFeedbackState | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDownload = () => {
    const { filename, content } = buildFile();
    /* `charset=utf-8` explícito: sin él, abrir el archivo en un editor de
       Windows puede interpretarlo como ANSI y los acentos salen rotos. */
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setFeedback({
      tone: "success",
      message: `Se descargó «${filename}». Rellénalo y vuelve a subirlo aquí.`,
    });
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    /* El input se vacía SIEMPRE: si no, volver a elegir el mismo archivo tras
       corregirlo no dispara `change` y parece que el botón dejó de funcionar. */
    event.target.value = "";
    if (!file) return;

    const name = file.name.toLowerCase();
    if (!ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext))) {
      setFeedback({
        tone: "error",
        message: `«${file.name}» no es un archivo .md. Descarga la plantilla, rellénala en un editor de texto y sube ese mismo archivo.`,
      });
      return;
    }

    if (file.size > MAX_BYTES) {
      setFeedback({
        tone: "error",
        message: `«${file.name}» pesa demasiado para ser una plantilla rellenada. Comprueba que es el archivo correcto.`,
      });
      return;
    }

    try {
      setFeedback(applyFile(await file.text()));
    } catch {
      setFeedback({
        tone: "error",
        message: "No se pudo leer el archivo. Vuelve a intentarlo o descarga la plantilla de nuevo.",
      });
    }
  };

  return (
    <div className={`rounded-[10px] border border-admin-divider bg-admin-field p-4 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-inter text-[11px] leading-[1.6] text-admin-footnote">{hint}</p>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            type="button"
            icon={<DownloadIcon size={14} aria-hidden="true" />}
            onClick={handleDownload}
          >
            {downloadLabel}
          </Button>

          {/* Mismo patrón que MediaPickerModal: el <input type="file"> real va
              oculto y la etiqueta hace de botón, para que se vea como el resto
              del kit en vez de como el control del navegador. */}
          <Button
            variant="outline"
            size="sm"
            type="button"
            icon={<UploadIcon size={14} aria-hidden="true" />}
            onClick={() => inputRef.current?.click()}
          >
            {uploadLabel}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept=".md,.markdown,.txt,text/markdown,text/plain"
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Fuera del contenedor con gap: FormFeedback renderiza su región
          `role="status"` aunque esté vacía y contaría como un hermano más. */}
      <FormFeedback feedback={feedback} className="mt-3" />
    </div>
  );
}
