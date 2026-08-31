import type { EditorActionBarProps } from "../components/editor/EditorActionBar";

export interface EditorActionBarInput {
  /** El formulario difiere de lo cargado. */
  dirty: boolean;
  saving: boolean;
  publishing: boolean;
  savedAtLabel: string;
  onCancel: () => void;
  onSaveAndPublish: () => void;
}

/**
 * Traduce el estado de un editor de contenidos a las props de su barra de
 * acciones: qué dice el estado y qué botones se pueden pulsar.
 *
 * Vive en `lib/` y no en la vista porque son decisiones, no plantilla: cuándo
 * un botón está bloqueado, qué etiqueta muestra mientras trabaja y qué acción
 * es la principal. La vista solo hace `<EditorActionBar {...actionBar} />`.
 *
 * `busy` (guardando O publicando) bloquea las tres acciones: "Guardar y
 * publicar" encadena guardado + revalidación, así que mientras corre no debe
 * poder lanzarse un segundo guardado por detrás.
 */
export function buildEditorActionBar({
  dirty,
  saving,
  publishing,
  savedAtLabel,
  onCancel,
  onSaveAndPublish,
}: EditorActionBarInput): EditorActionBarProps {
  const busy = saving || publishing;

  return {
    statusLabel: dirty ? "Cambios sin guardar" : "Sin cambios pendientes",
    statusPending: dirty,
    savedAtLabel,
    secondaryActions: [
      {
        label: "Cancelar",
        onClick: onCancel,
        disabled: busy || !dirty,
      },
      {
        // El `submit` del `<form>` que envuelve al editor: la tecla Enter
        // guarda el borrador.
        label: "Guardar borrador",
        type: "submit",
        tone: "navy",
        busy: saving && !publishing,
        busyLabel: "Guardando…",
        disabled: busy || !dirty,
      },
    ],
    primaryAction: {
      label: "Guardar y publicar",
      busy: publishing,
      busyLabel: "Publicando…",
      disabled: busy,
      onClick: onSaveAndPublish,
    },
  };
}
