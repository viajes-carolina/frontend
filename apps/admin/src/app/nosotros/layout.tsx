export default function NosotrosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sora font-extrabold text-3xl text-brand-navy">
          Nosotros · Contenido y Equipo de Asesoras
        </h1>
        <p className="font-inter text-neutral-muted text-sm mt-1">
          Administra la historia institucional, misión, valores y el equipo de asesoras que aparecen en la
          página pública &quot;Nosotros&quot;.
        </p>
      </div>

      {children}
    </div>
  );
}
