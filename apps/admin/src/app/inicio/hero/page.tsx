import { loadHeroEditorContext } from "../../../lib/heroEditorContext";
import { HeroEditorView } from "./HeroEditorView";

export const dynamic = "force-dynamic";

/**
 * Editor del Hero principal (Figma 930:4). Absorbe las cuatro pantallas que
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
    />
  );
}
