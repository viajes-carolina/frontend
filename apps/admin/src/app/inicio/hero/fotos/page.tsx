import { apiClient } from "@vc/api-client";
import { FotosForm } from "./FotosForm";

export const dynamic = "force-dynamic";

export default async function InicioHeroFotosPage() {
  const hero = await apiClient.getHomeHero();
  return <FotosForm initialHero={hero} />;
}
