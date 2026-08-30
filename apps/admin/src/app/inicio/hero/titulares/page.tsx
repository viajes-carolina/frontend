import { redirect } from "next/navigation";

/**
 * Ruta absorbida por el editor unificado del Hero principal (Figma 930:4).
 * Se conserva como redirección para no romper enlaces ni marcadores guardados.
 */
export default function LegacyHeroRoutePage() {
  redirect("/inicio/hero");
}
