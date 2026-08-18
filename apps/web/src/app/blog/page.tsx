import { Metadata } from "next";
import { apiClient } from "@vc/api-client";
import { BlogClientView } from "./BlogClientView";

export const metadata: Metadata = {
  title: "Blog de Viajes | Guías, Consejos e Inspiración — Viajes Carolina",
  description:
    "Descubre guías completas de viaje, recomendaciones de playas, circuitos turísticos, requisitos de viaje y los mejores consejos de nuestras asesoras expertas.",
  openGraph: {
    title: "Blog de Viajes | Guías, Consejos e Inspiración — Viajes Carolina",
    description:
      "Descubre guías completas de viaje, recomendaciones de playas, circuitos turísticos y tips de asesoras expertas.",
    images: ["/media/demo-cartagena-caribe.webp"],
  },
};

export default async function BlogPage() {
  const initialData = await apiClient.getPublicBlog();
  return <BlogClientView initialData={initialData} />;
}
