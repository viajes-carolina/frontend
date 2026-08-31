"use client";

/** Jerarquía visual de una acción de apoyo. La principal siempre va en naranja. */
export type EditorBarActionTone = "neutral" | "navy";

export interface EditorBarAction {
  label: string;
  /** Etiqueta mientras la acción está en curso ("Publicando…"). */
  busyLabel?: string;
  busy?: boolean;
  disabled?: boolean;
  /**
   * `submit` para la acción que envía el `<form>` envolvente — así la tecla
   * Enter guarda, en vez de no hacer nada. Solo tiene sentido si el editor
   * está dentro de un `<form>`; por defecto es `button`, que es lo que
   * necesita la variante de una sola acción (no exige formulario).
   */
  type?: "button" | "submit";
  /**
   * `id` del `<form>` que envía esta acción, cuando la barra vive FUERA de él.
   * Es el caso de una pantalla con la barra al pie y el formulario dentro de
   * una columna: sin esto habría que duplicar el botón dentro de la tarjeta,
   * que es justo lo que la guía prohíbe ("una acción principal por bloque").
   */
  form?: string;
  onClick?: () => void;
  tone?: EditorBarActionTone;
}

export interface EditorActionBarProps {
  /** Línea 1 del estado: "Cambios sin guardar" / "Sin cambios pendientes". */
  statusLabel: string;
  /** `true` pinta el estado en el naranja de pendiente; `false`, en gris. */
  statusPending: boolean;
  /**
   * Línea 2: "Último guardado: hoy, 09:18". Opcional — la variante de una sola
   * acción de la guía muestra únicamente el estado.
   */
  savedAtLabel?: string;
  /** La única acción obligatoria: "Una acción principal por bloque". */
  primaryAction: EditorBarAction;
  /** Acciones de apoyo, en orden, a la izquierda de la principal. */
  secondaryActions?: EditorBarAction[];
}

/* `px-2.5` en móvil y `px-3.5` desde `sm`: con el padding de escritorio las
   tres acciones suman 342px y no caben en los 326px útiles de un móvil de
   390px, así que "Guardar y publicar" se iba a una tercera línea y la barra
   pasaba de 95px a 141px de alto. Recortar 4px por lado las devuelve a una
   sola fila sin tocar el tamaño de letra. */
const BUTTON_BASE =
  "cursor-pointer rounded-[6px] px-2.5 py-2 font-inter text-[11px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:opacity-50 sm:px-3.5";

const TONE_CLASSES: Record<EditorBarActionTone, string> = {
  neutral: "border border-neutral-border text-neutral-ink hover:bg-neutral-soft",
  navy: "border border-brand-navy bg-transparent text-brand-navy hover:bg-brand-navy/5",
};

const PRIMARY_CLASSES = "bg-brand-accent text-on-accent hover:bg-brand-accent/90";

function ActionButton({ action, className }: { action: EditorBarAction; className: string }) {
  return (
    <button
      type={action.type ?? "button"}
      form={action.form}
      onClick={action.onClick}
      disabled={action.disabled}
      className={`${BUTTON_BASE} ${className}`}
    >
      {action.busy && action.busyLabel ? action.busyLabel : action.label}
    </button>
  );
}

/**
 * Barra de acciones persistente de los editores de contenido.
 *
 * ── Regla literal de la guía ─────────────────────────────────────────────
 * "Evita que el guardado desaparezca al final de formularios largos."
 * Se llamaba persistente pero era un `div` en flujo normal al final del
 * formulario: en el editor del Hero había que recorrer toda la página para
 * llegar a "Guardar". Ahora es `sticky`.
 *
 * ── Por qué `sticky` y no `fixed` ────────────────────────────────────────
 * `sticky` conserva el hueco de la barra en el flujo, así que al llegar al
 * final del formulario la barra ATERRIZA en su sitio y no tapa nada de forma
 * permanente; el padding inferior del editor (28/32px) es mayor que el
 * `bottom-4` de anclaje, de modo que en reposo queda despegada del borde. Con
 * `fixed` habría que reservar ese hueco a mano en cada pantalla y el último
 * campo quedaría oculto en la que se olvidara.
 *
 * ── Contenedor de scroll ─────────────────────────────────────────────────
 * `sticky` se resuelve contra el ancestro con scroll más cercano. El `<main>`
 * de `AdminShell` declaraba `overflow-y-auto` sin altura acotada: nunca
 * desplazaba nada (desplazaba el documento) pero SÍ contaba como contenedor de
 * scroll, y eso anulaba cualquier `sticky` de las pantallas. Ver la nota en
 * `AdminShell.tsx`.
 *
 * ── Móvil ────────────────────────────────────────────────────────────────
 * La barra apila estado y botones solo si no caben: `flex-wrap` en vez de
 * `flex-col` incondicional, y los botones se mantienen en una fila alineada a
 * la derecha. En la práctica ocupa ~92px de alto en un móvil de 390px — lo
 * suficiente para no comerse la pantalla en un formulario largo.
 */
export function EditorActionBar({
  statusLabel,
  statusPending,
  savedAtLabel,
  primaryAction,
  secondaryActions = [],
}: EditorActionBarProps) {
  return (
    <div className="sticky bottom-4 z-30 mt-5">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-[8px] border border-neutral-border bg-white py-2.5 pl-3 pr-2.5 shadow-[0_8px_24px_rgba(17,34,48,0.12)] sm:min-h-[58px]">
        <div className="min-w-0">
          <p
            className={`font-inter text-[11px] font-semibold ${
              statusPending ? "text-state-pending" : "text-neutral-muted"
            }`}
          >
            {statusLabel}
          </p>
          {savedAtLabel && (
            <p className="mt-0.5 font-inter text-[9px] text-neutral-muted">{savedAtLabel}</p>
          )}
        </div>

        <div className="ml-auto flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
          {secondaryActions.map((action) => (
            <ActionButton
              key={action.label}
              action={action}
              className={TONE_CLASSES[action.tone ?? "neutral"]}
            />
          ))}
          <ActionButton action={primaryAction} className={PRIMARY_CLASSES} />
        </div>
      </div>
    </div>
  );
}
