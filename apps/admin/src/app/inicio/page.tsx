import { apiClient } from "@vc/api-client";
import { HeroForm } from "./HeroForm";

export const dynamic = "force-dynamic";

export default async function HomeHeroAdminPage() {
  const hero = await apiClient.getHomeHero();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sora font-extrabold text-3xl text-brand-navy">
          Inicio · Hero Principal y Primera Conversación
        </h1>
        <p className="font-inter text-neutral-muted text-sm mt-1">
          Administra los titulares, llamados a la acción de WhatsApp, propuesta de valor y fotografías de la cabecera principal.
        </p>
      </div>

      <HeroForm initialHero={hero} />
    </div>
  );
}
