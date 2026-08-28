import React from "react";
import { WhatsAppButton } from "../primitives/WhatsAppButton";

export interface BlogArticleClosingCtaProps {
  postTitle: string;
  whatsappPhone: string;
}

export const BlogArticleClosingCta: React.FC<BlogArticleClosingCtaProps> = ({ postTitle, whatsappPhone }) => {
  const message = `Hola Viajes Carolina, acabo de leer el artículo "${postTitle}" en su blog y me gustaría que pensemos juntos esta ruta.`;

  // Fondo blanco + borde en vez del bg-atmosphere-fog original: ese gris
  // (#f3f6f5) se apoyaba en el bg-white de la sección del artículo, que ahora
  // es transparente sobre el fondo global ivory (#f8f5ef) — quedaban a 6 puntos
  // de diferencia y la tarjeta desaparecía. Mismo tratamiento que el resto de
  // tarjetas del sitio.
  return (
    <div className="rounded-[24px] border border-neutral-border bg-white px-7 py-8 my-10 shadow-sm sm:px-9">
      <h3 className="font-display text-xl sm:text-2xl font-semibold text-brand-navy">
        ¿Quieres que pensemos esta ruta contigo?
      </h3>
      <div className="mt-5">
        <WhatsAppButton phone={whatsappPhone} message={message} size="md">
          Conversar por WhatsApp
        </WhatsAppButton>
      </div>
    </div>
  );
};
