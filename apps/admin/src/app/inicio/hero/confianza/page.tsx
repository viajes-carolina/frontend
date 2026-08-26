import { apiClient } from "@vc/api-client";
import { ConfianzaForm } from "./ConfianzaForm";

export const dynamic = "force-dynamic";

export default async function InicioHeroConfianzaPage() {
  const hero = await apiClient.getHomeHero();
  return <ConfianzaForm initialHero={hero} />;
}
