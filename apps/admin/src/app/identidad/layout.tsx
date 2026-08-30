import { AdminSectionLayout } from "../../components/AdminSectionLayout";

export default function IdentidadLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSectionLayout
      eyebrow="Configuración"
      title="Identidad y Configuración Global"
      description="Gestiona el nombre de la agencia, canal WhatsApp único y redes sociales oficiales."
    >
      {children}
    </AdminSectionLayout>
  );
}
