"use client";

export type PreviewDevice = "desktop" | "mobile";

const OPTIONS: { value: PreviewDevice; label: string }[] = [
  { value: "desktop", label: "Escritorio" },
  { value: "mobile", label: "Móvil" },
];

export interface EditorDeviceSwitchProps {
  value: PreviewDevice;
  onChange: (device: PreviewDevice) => void;
}

/**
 * Conmutador de dispositivo de la vista previa (Figma 930:4).
 *
 * Grupo de botones con `aria-pressed` y no un `radiogroup`: no cambia ningún
 * dato del contenido, solo el ancho con el que se dibuja la previsualización.
 */
export function EditorDeviceSwitch({ value, onChange }: EditorDeviceSwitchProps) {
  return (
    <div role="group" aria-label="Ancho de la vista previa" className="flex gap-0.5 rounded-[5px] bg-admin-switch-track p-[3px]">
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer rounded-[4px] px-2.5 py-1 font-inter text-[9px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-accent ${
              active ? "bg-white font-semibold text-neutral-ink" : "font-medium text-neutral-muted hover:text-neutral-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
