import type { HomeHeroDTO } from "@vc/api-client";
import type { BadgeTone } from "@vc/ui";

/**
 * Indicador de estado del bloque "Contenido principal" del editor del Hero.
 *
 * El diseño pide "un indicador de estado" a la derecha del título del bloque.
 * Se resuelve con el único dato real que existe a nivel de bloque: si los
 * campos de ESE bloque difieren de lo último guardado. No se reutiliza la
 * píldora de publicación del encabezado — diría lo mismo tres veces y no
 * hablaría del bloque — ni se inventa un "completo/incompleto" que el modelo
 * no respalda.
 *
 * Vive en `lib/` porque es comparación pura: el `.tsx` solo pinta la etiqueta
 * y el tono que devuelve.
 */

export interface HeroContentBlockValues {
  eyebrowText: string;
  titleHighlight: string;
  titleAccent: string;
  description: string;
}

export interface HeroBlockStatus {
  label: string;
  tone: BadgeTone;
  /** Texto largo para el `title` de la píldora. */
  detail: string;
}

/** Compara ignorando espacios sobrantes y la diferencia entre ausente y vacío. */
function normalize(value: string | undefined): string {
  return (value ?? "").trim();
}

export function describeHeroContentStatus(
  current: HeroContentBlockValues,
  saved: HomeHeroDTO,
): HeroBlockStatus {
  const edited =
    normalize(current.eyebrowText) !== normalize(saved.eyebrowText) ||
    normalize(current.titleHighlight) !== normalize(saved.titleHighlight) ||
    normalize(current.titleAccent) !== normalize(saved.titleAccent) ||
    normalize(current.description) !== normalize(saved.description);

  return edited
    ? {
        label: "Editado",
        tone: "accent",
        detail: "El mensaje principal difiere de lo último guardado.",
      }
    : {
        label: "Sin cambios",
        tone: "neutral",
        detail: "El mensaje principal coincide con lo último guardado.",
      };
}
