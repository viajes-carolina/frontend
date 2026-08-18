import { apiClient } from "@vc/api-client";
import { InicioClientWrapper } from "./InicioClientWrapper";

export const dynamic = "force-dynamic";

export default async function HomeHeroAdminPage() {
  const [hero, inspiration] = await Promise.all([
    apiClient.getHomeHero(),
    apiClient.getAdminHomeBlogInspiration(),
  ]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sora font-extrabold text-3xl text-brand-navy">
          Inicio · Contenido y Secciones de Portada
        </h1>
        <p className="font-inter text-neutral-muted text-sm mt-1">
          Administra los llamados a la acción, propuesta de valor, hero principal y la sección de inspiración desde el blog.
        </p>
      </div>

      <InicioClientWrapper hero={hero} inspiration={inspiration} />
    </div>
  );
}
