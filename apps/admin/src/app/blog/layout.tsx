export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sora font-extrabold text-3xl text-brand-navy">
          Blog · Artículos y Categorías
        </h1>
        <p className="font-inter text-neutral-muted text-sm mt-1">
          Crea, edita y organiza los artículos, guías de viaje y categorías del blog (CMS con búsqueda
          trigram).
        </p>
      </div>

      {children}
    </div>
  );
}
