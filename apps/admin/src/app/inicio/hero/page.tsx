import { loadHeroEditorContext } from "../../../lib/heroEditorContext";
import { resolvePublicSiteUrl } from "../../../lib/publicSite";
import { HeroEditorView } from "./HeroEditorView";

export const dynamic = "force-dynamic";

/**
 * Editor del Hero principal (Figma 958:459). Absorbe las cuatro pantallas que
 * antes repartían este mismo registro: titulares, botones, línea de confianza
 * y collage de fotos.
 */
export default async function InicioHeroPage() {
  const { hero, publication, lastSavedLabel } = await loadHeroEditorContext("/inicio/hero");

  return (
    <HeroEditorView
      initialHero={hero}
      publication={publication}
      initialLastSavedLabel={lastSavedLabel}
      publicSiteUrl={resolvePublicSiteUrl()}
    />
  );
}
