import { AdminSectionLayout } from "../../components/AdminSectionLayout";

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSectionLayout
      eyebrow="Contenido del sitio"
      title="Contacto · Contenido y Oficina"
      description="Administra los textos de la página pública de Contacto y la información de la oficina física, horarios y ubicación."
    >
      {children}
    </AdminSectionLayout>
  );
}
