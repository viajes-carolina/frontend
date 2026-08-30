import { redirect } from "next/navigation";

/** El listado de preguntas se fusionó con el encabezado de la sección. */
export default function LegacyPreguntasPage() {
  redirect("/inicio/preguntas-frecuentes");
}
