import { AdminSectionLayout } from "../../components/AdminSectionLayout";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSectionLayout
      eyebrow="Contenido del sitio"
      title="Blog · Artículos y Categorías"
      description="Crea, edita y organiza los artículos, guías de viaje y categorías del blog, con buscador para encontrarlos rápido."
    >
      {children}
    </AdminSectionLayout>
  );
}
