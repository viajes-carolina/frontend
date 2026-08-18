import type { Metadata } from "next";
import { apiClient, SearchResultType } from "@vc/api-client";
import { SearchClientView } from "./SearchClientView";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q ? ` para "${params.q}"` : "";
  return {
    title: `Búsqueda de Destinos y Promociones${q} | Viajes Carolina`,
    description:
      "Explora paquetes turísticos, ofertas al Caribe, consejos de viaje y experiencias únicas con asesoría personalizada de Viajes Carolina.",
    openGraph: {
      title: `Búsqueda de Viajes y Destinos | Viajes Carolina`,
      description:
        "Encuentra las mejores promociones y experiencias de viaje con asesoría personalizada.",
    },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const type = (params.type || "ALL") as SearchResultType;

  let initialData;
  try {
    initialData = await apiClient.searchGlobal(query, type, 24);
  } catch (e) {
    console.error("Error fetching search results SSR:", e);
  }

  return (
    <SearchClientView
      initialQuery={query}
      initialType={type}
      initialData={initialData}
    />
  );
}
