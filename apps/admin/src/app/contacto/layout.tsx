export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sora font-extrabold text-3xl text-brand-navy">
          Contacto · Contenido y Oficina
        </h1>
        <p className="font-inter text-neutral-muted text-sm mt-1">
          Administra los textos de la página pública de Contacto y la información de la oficina física,
          horarios y ubicación.
        </p>
      </div>

      {children}
    </div>
  );
}
