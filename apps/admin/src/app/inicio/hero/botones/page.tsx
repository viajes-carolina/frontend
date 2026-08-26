import { apiClient } from "@vc/api-client";
import { BotonesForm } from "./BotonesForm";

export const dynamic = "force-dynamic";

export default async function InicioHeroBotonesPage() {
  const hero = await apiClient.getHomeHero();
  return <BotonesForm initialHero={hero} />;
}
