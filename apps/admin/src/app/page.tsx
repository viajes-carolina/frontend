import Link from "next/link";
import { Button, PlaneIcon, MapPinIcon, WhatsAppIcon, ArrowUpRightIcon } from "@vc/ui";
import { apiClient } from "@vc/api-client";

export default async function AdminDashboardPage() {
  const [siteSettings, office, promotions] = await Promise.all([
    apiClient.getSiteSettings(),
    apiClient.getOfficeLocation(),
    apiClient.getPromotions(),
  ]);

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-border">
        <div>
          <h1 className="font-sora font-bold text-2xl text-brand-navy">
            Panel de Control · {siteSettings.siteName}
          </h1>
          <p className="font-inter text-neutral-muted text-sm mt-1">
            Gestión centralizada de contenidos, identidad, oficina y publicaciones.
          </p>
        </div>
        <div className="flex gap-3">
          <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" icon={<ArrowUpRightIcon size={16} />}>
              Ver Web Pública
            </Button>
          </a>
        </div>
      </header>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card: Identidad & WhatsApp */}
        <Link
          href="/identidad"
          className="group bg-white p-6 rounded-2xl border border-neutral-border hover:border-brand-accent/50 shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-brand-accent">
                Corte 1 · Identidad
              </span>
              <div className="p-2 rounded-xl bg-brand-whatsapp/10 text-brand-whatsapp">
                <WhatsAppIcon size={20} />
              </div>
            </div>
            <h3 className="font-sora font-bold text-lg text-brand-navy group-hover:text-brand-accent transition-colors">
              Canal WhatsApp & Marca
            </h3>
            <p className="font-inter text-neutral-muted text-sm mt-2 leading-relaxed">
              Número E.164 activo: <span className="font-semibold text-brand-navy">{siteSettings.whatsappPhone}</span>.
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-accent mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Editar Identidad &rarr;
          </span>
        </Link>

        {/* Card: Oficina & Horarios */}
        <Link
          href="/oficina"
          className="group bg-white p-6 rounded-2xl border border-neutral-border hover:border-brand-accent/50 shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-brand-accent">
                Corte 2 · Oficina
              </span>
              <div className="p-2 rounded-xl bg-brand-navy/10 text-brand-navy">
                <MapPinIcon size={20} />
              </div>
            </div>
            <h3 className="font-sora font-bold text-lg text-brand-navy group-hover:text-brand-accent transition-colors">
              Oficina & Horarios
            </h3>
            <p className="font-inter text-neutral-muted text-sm mt-2 leading-relaxed">
              {office.addressLine}, {office.district}.
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-accent mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Editar Ubicación &rarr;
          </span>
        </Link>

        {/* Card: Estado del Sistema */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-600">
                Arquitectura
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <PlaneIcon size={20} />
              </div>
            </div>
            <h3 className="font-sora font-bold text-lg text-brand-navy">
              Quarkus 3.x & Next.js 15
            </h3>
            <p className="font-inter text-neutral-muted text-sm mt-2 leading-relaxed">
              Hexagonal Backend + Next.js App Router Monorepo.
            </p>
          </div>
          <span className="text-xs font-medium text-neutral-muted mt-4">
            12 de 51 tareas completadas (23.5%)
          </span>
        </div>

      </div>
    </div>
  );
}
