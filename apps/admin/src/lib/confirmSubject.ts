/**
 * Recorte del nombre del elemento que va en el título de una confirmación.
 *
 * La regla de la guía —"la consecuencia y el objeto afectado deben aparecer
 * explícitamente"— obliga a que el título NOMBRE el elemento. Pero algunos de
 * esos nombres no son nombres cortos: la "pregunta frecuente" que se desactiva
 * puede ser una frase de dos líneas, y un título de 14px bold con 180
 * caracteres deja de leerse como título.
 *
 * El corte cae en el último espacio anterior al límite para no partir palabras,
 * y añade una elipsis de un solo carácter (`…`, no `...`) para que el lector de
 * pantalla no deletree tres puntos. Si el texto ya cabe, se devuelve intacto.
 */
export function confirmSubject(text: string, maxLength = 64): string {
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length <= maxLength) return clean;

  const cut = clean.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  /* Sin espacios en el tramo (una URL, un slug largo) se corta en seco: es
     preferible a devolver la cadena entera y romper el título. */
  return `${(lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
