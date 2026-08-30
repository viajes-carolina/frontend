import { apiClient, type HomeHeroDTO } from "@vc/api-client";
import { buildPublicationSummary } from "./dashboardPublishing";
import type { DashboardTone } from "./dashboardActivity";
import { buildLastSavedLabel } from "./editorSaveState";
import { withAdminAuth } from "./withAdminAuth";

/**
 * Lecturas del editor del Hero principal.
 *
 * Vive en `lib/` para que `page.tsx` quede como plantilla. Tres datos, tres
 * orígenes reales:
 *
 * - El contenido del Hero, que es lo que se edita.
 * - El estado de publicación del sitio, del que sale la píldora del encabezado.
 *   Se deriva igual que en el dashboard, con `buildPublicationSummary`.
 * - La hora del último guardado, tomada de `updatedAt` del propio Hero.
 *
 * La etiqueta de "último guardado" se calcula AQUÍ, en el servidor, y viaja
 * como texto ya formateado: si el cliente la calculara en su primer render, el
 * formato de hora local podría no coincidir con el del servidor y React
 * marcaría un desajuste de hidratación.
 */

export interface HeroEditorContext {
  hero: HomeHeroDTO;
  publication: { label: string; tone: DashboardTone };
  lastSavedLabel: string;
}

export async function loadHeroEditorContext(
  fromPath: string,
  now: Date = new Date(),
): Promise<HeroEditorContext> {
  const hero = await withAdminAuth(apiClient.getHomeHero(), fromPath);

  // El estado de publicación es informativo: si no se puede leer, el editor
  // sigue siendo utilizable y la píldora dice que no se pudo consultar.
  const engineStatus = await apiClient
    .getPublishingStatus()
    .catch(() => null);

  const summary = buildPublicationSummary({ engineStatus, now });

  return {
    hero,
    publication: { label: summary.kpiValue, tone: summary.tone },
    lastSavedLabel: buildLastSavedLabel(hero.updatedAt, now),
  };
}
