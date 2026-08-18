import { apiClient } from "@vc/api-client";
import { OfficeForm } from "./OfficeForm";

export default async function OfficeSettingsPage() {
  const office = await apiClient.getOfficeLocation();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sora font-bold text-2xl text-brand-navy">
          Oficina Principal & Horarios
        </h1>
        <p className="font-inter text-neutral-muted text-sm mt-1">
          Configuración de dirección física, horarios de atención y enlaces de mapas que se muestran en el pie de página y la página de contacto.
        </p>
      </div>

      <OfficeForm initialOffice={office} />
    </div>
  );
}
