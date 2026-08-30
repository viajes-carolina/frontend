import { AdminSectionLayout } from "../../components/AdminSectionLayout";

export default function NosotrosLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSectionLayout
      eyebrow="Contenido del sitio"
      title="Nosotros · Contenido y Equipo de Asesoras"
      description="Administra la presentación, la forma de trabajar y el equipo de asesoras que aparecen en la página pública «Nosotros»."
    >
      {children}
    </AdminSectionLayout>
  );
}
