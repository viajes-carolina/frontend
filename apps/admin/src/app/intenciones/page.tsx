import { apiClient } from "@vc/api-client";
import { IntentionList } from "./IntentionList";

export const dynamic = "force-dynamic";

export default async function TravelIntentionsAdminPage() {
  const intentions = await apiClient.getAdminTravelIntentions();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-sora font-extrabold text-3xl text-brand-navy">
          Intenciones de Viaje · Selector de Portada
        </h1>
        <p className="font-inter text-neutral-muted text-sm mt-1">
          Gestiona las categorías de viaje que inspiran a los clientes (Playa & Relax, Cultura, Romance, Aventura) y sus destinos sugeridos.
        </p>
      </div>

      <IntentionList initialIntentions={intentions} />
    </div>
  );
}
