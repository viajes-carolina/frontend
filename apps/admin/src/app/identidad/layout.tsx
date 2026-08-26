export default function IdentidadLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sora font-extrabold text-3xl text-brand-navy">
          Identidad y Configuración Global
        </h1>
        <p className="font-inter text-neutral-muted text-sm mt-1">
          Gestiona el nombre de la agencia, canal WhatsApp único y redes sociales oficiales.
        </p>
      </div>

      {children}
    </div>
  );
}
