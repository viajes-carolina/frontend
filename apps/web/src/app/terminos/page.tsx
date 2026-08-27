import { apiClient } from "@vc/api-client";
import { LegalArticleSection } from "@vc/ui";

export const metadata = {
  title: "Términos y condiciones | Viajes Carolina",
  description:
    "Condiciones generales aplicables a las cotizaciones, reservas y servicios gestionados por Viajes Carolina.",
};

const SECTIONS = [
  {
    number: "01",
    title: "Alcance de nuestros servicios",
    body: "Viajes Carolina brinda orientación, cotización y gestión de servicios turísticos según las condiciones informadas para cada viaje. Cada propuesta puede incluir vuelos, alojamiento, traslados, actividades u otros servicios expresamente indicados.",
  },
  {
    number: "02",
    title: "Cotizaciones y disponibilidad",
    body: "Las cotizaciones son referenciales hasta que la reserva y el pago hayan sido confirmados. Tarifas, cupos, horarios y condiciones pueden variar por decisión de aerolíneas, hoteles u operadores.",
  },
  {
    number: "03",
    title: "Reservas y pagos",
    body: "La reserva queda confirmada cuando el cliente acepta la propuesta, entrega la información requerida y realiza el pago acordado. Los comprobantes y condiciones específicas se comunican antes de confirmar.",
  },
  {
    number: "04",
    title: "Cambios, cancelaciones y reembolsos",
    body: "Cada proveedor aplica sus propias penalidades y restricciones. Antes de pagar, el cliente recibe las condiciones relevantes del servicio contratado.",
  },
  {
    number: "05",
    title: "Responsabilidades del viajero",
    body: "El viajero debe revisar la vigencia de documentos, requisitos migratorios, sanitarios y cualquier condición necesaria para realizar el viaje.",
  },
  {
    number: "06",
    title: "Atención y contacto",
    body: "Si necesitas aclarar una condición antes de reservar, puedes escribirnos. Queremos que tomes una decisión informada y sin presión.",
  },
];

export default async function TerminosPage() {
  const settings = await apiClient.getSiteSettings({ revalidate: 3600 });

  return (
    <LegalArticleSection
      eyebrow="Información legal"
      title="Términos y condiciones"
      intro="Aquí explicamos de forma clara las condiciones generales aplicables a las cotizaciones, reservas y servicios gestionados por Viajes Carolina."
      updatedLabel="Última actualización: agosto de 2026"
      sections={SECTIONS}
      closingTitle="Antes de confirmar un viaje"
      closingBody="Te mostraremos el precio, las inclusiones, las restricciones y las condiciones particulares de tu propuesta."
      whatsappCtaLabel="Resolver una duda por WhatsApp"
      whatsappPhone={settings.whatsappPhone}
      whatsappMessage="Hola Viajes Carolina, tengo una consulta sobre los términos y condiciones."
    />
  );
}
