import { AdminSectionLayout } from "../../components/AdminSectionLayout";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSectionLayout
      eyebrow="Gobernanza y legal"
      title="Páginas Legales"
      description="Administra el copy de Términos y condiciones, Política de privacidad, Política de cookies, Compromiso contra la ESNNA y Constancia MINCETUR."
    >
      {children}
    </AdminSectionLayout>
  );
}
