import { apiClient } from "@vc/api-client";
import { IdentityForm } from "./IdentityForm";

export default async function IdentitySettingsPage() {
  const settings = await apiClient.getSiteSettings();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sora font-bold text-2xl text-brand-navy">
          Identidad Global & Canal WhatsApp
        </h1>
        <p className="font-inter text-neutral-muted text-sm mt-1">
          Edita el nombre de marca, número oficial de WhatsApp y enlaces que se reflejan automáticamente en el header y CTAs de la web.
        </p>
      </div>

      <IdentityForm initialSettings={settings} />
    </div>
  );
}
