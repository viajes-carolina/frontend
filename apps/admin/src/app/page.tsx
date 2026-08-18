import { Button } from "@vc/ui";
import { apiClient } from "@vc/api-client";

export default async function AdminDashboardPage() {
  const siteSettings = await apiClient.getSiteSettings();
  const promotions = await apiClient.getPromotions();

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between pb-6 border-b border-neutral-border mb-8">
        <div>
          <h1 className="font-sora font-bold text-2xl text-brand-navy">
            Panel de Control · {siteSettings.siteName}
          </h1>
          <p className="font-inter text-neutral-muted text-sm mt-1">
            Gestión centralizada de contenidos, identidad y publicaciones.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            Ver Sitio Web
          </Button>
          <Button variant="primary" size="sm">
            Nueva Promoción
          </Button>
        </div>
      </header>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Identidad */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm">
          <span className="text-xs uppercase tracking-wider font-semibold text-brand-accent">
            Identidad Global
          </span>
          <h3 className="font-sora font-bold text-lg text-brand-navy mt-2">
            Canal WhatsApp & Marca
          </h3>
          <p className="font-inter text-neutral-muted text-sm mt-1">
            Número activo: <span className="font-medium text-brand-navy">{siteSettings.whatsappPhone}</span>
          </p>
        </div>

        {/* Promociones */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm">
          <span className="text-xs uppercase tracking-wider font-semibold text-brand-accent">
            Catálogo Comercial
          </span>
          <h3 className="font-sora font-bold text-lg text-brand-navy mt-2">
            {promotions.length} Promociones
          </h3>
          <p className="font-inter text-neutral-muted text-sm mt-1">
            Sincronizadas con la web pública y cotizador WhatsApp.
          </p>
        </div>

        {/* Publicación */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm">
          <span className="text-xs uppercase tracking-wider font-semibold text-brand-accent">
            Publicación
          </span>
          <h3 className="font-sora font-bold text-lg text-brand-navy mt-2">
            On-Demand ISR
          </h3>
          <p className="font-inter text-neutral-muted text-sm mt-1">
            Revalidación instantánea sin reconstruir el sitio completo.
          </p>
        </div>
      </div>
    </div>
  );
}
