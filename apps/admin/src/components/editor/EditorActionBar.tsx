"use client";

export interface EditorActionBarProps {
  /** Línea 1 del estado: "Cambios sin guardar" / "Sin cambios pendientes". */
  statusLabel: string;
  /** `true` pinta el estado en el naranja de pendiente; `false`, en gris. */
  statusPending: boolean;
  /** Línea 2: "Último guardado: hoy, 09:18" o el motivo de que no se sepa. */
  savedAtLabel: string;
  saving: boolean;
  publishing: boolean;
  /** `false` deshabilita Cancelar y Guardar borrador (no hay nada que guardar). */
  dirty: boolean;
  onCancel: () => void;
  onSaveAndPublish: () => void;
}

const BUTTON_BASE =
  "cursor-pointer rounded-[6px] px-3.5 py-2 font-inter text-[11px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Barra inferior de los editores de contenido (Figma 930:4): a la izquierda el
 * estado de guardado, a la derecha las tres acciones.
 *
 * "Guardar borrador" es el `submit` del formulario que envuelve al editor —
 * así la tecla Enter guarda, en vez de no hacer nada. "Guardar y publicar" es
 * un botón aparte porque encadena dos operaciones y no debe dispararse sin
 * intención explícita.
 */
export function EditorActionBar({
  statusLabel,
  statusPending,
  savedAtLabel,
  saving,
  publishing,
  dirty,
  onCancel,
  onSaveAndPublish,
}: EditorActionBarProps) {
  const busy = saving || publishing;

  return (
    <div className="mt-5 flex flex-col gap-3 rounded-[8px] border border-neutral-border bg-white px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p
          className={`font-inter text-[11px] font-semibold ${
            statusPending ? "text-state-pending" : "text-neutral-muted"
          }`}
        >
          {statusLabel}
        </p>
        <p className="mt-0.5 font-inter text-[9px] text-neutral-muted">{savedAtLabel}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy || !dirty}
          className={`${BUTTON_BASE} border border-neutral-border text-neutral-ink hover:bg-neutral-soft`}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={busy || !dirty}
          className={`${BUTTON_BASE} border border-brand-navy bg-transparent text-brand-navy hover:bg-brand-navy/5`}
        >
          {saving && !publishing ? "Guardando…" : "Guardar borrador"}
        </button>
        <button
          type="button"
          onClick={onSaveAndPublish}
          disabled={busy}
          className={`${BUTTON_BASE} bg-brand-accent text-on-accent hover:bg-brand-accent/90`}
        >
          {publishing ? "Publicando…" : "Guardar y publicar"}
        </button>
      </div>
    </div>
  );
}
