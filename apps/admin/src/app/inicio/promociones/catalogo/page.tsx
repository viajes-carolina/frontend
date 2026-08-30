import { redirect } from "next/navigation";

/** El catálogo se fusionó con el encabezado en una sola pantalla de Promociones. */
export default function LegacyPromocionesCatalogoPage() {
  redirect("/inicio/promociones");
}
