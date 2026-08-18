import { apiClient } from "@vc/api-client";
import { OfficeForm } from "./OfficeForm";

export const dynamic = "force-dynamic";

export default async function OfficeSettingsPage() {
  const office = await apiClient.getOfficeLocation();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sora font-extrabold text-3xl text-brand-navy">
          Oficina Física & Horarios
        </h1>
        <p className="font-inter text-neutral-muted text-sm mt-1">
          Configura la dirección de atención presencial, coordenadas y horarios de apertura.
        </p>
      </div>

      <OfficeForm initialOffice={office} />
    </div>
  );
}
