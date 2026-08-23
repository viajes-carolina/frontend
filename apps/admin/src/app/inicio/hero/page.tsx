import { apiClient } from "@vc/api-client";
import { HeroForm } from "../HeroForm";

export const dynamic = "force-dynamic";

export default async function HeroPage() {
  const hero = await apiClient.getHomeHero();
  return <HeroForm initialHero={hero} />;
}
