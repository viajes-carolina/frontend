import { apiClient } from "@vc/api-client";
import { TitularesForm } from "./TitularesForm";

export const dynamic = "force-dynamic";

export default async function InicioHeroTitularesPage() {
  const hero = await apiClient.getHomeHero();
  return <TitularesForm initialHero={hero} />;
}
