import React from "react";
import { WhatsAppButton } from "../primitives/WhatsAppButton";

export interface BlogArticleClosingCtaProps {
  postTitle: string;
  whatsappPhone: string;
}

export const BlogArticleClosingCta: React.FC<BlogArticleClosingCtaProps> = ({ postTitle, whatsappPhone }) => {
  const message = `Hola Viajes Carolina, acabo de leer el artículo "${postTitle}" en su blog y me gustaría que pensemos juntos esta ruta.`;

  return (
    <div className="rounded-[24px] bg-atmosphere-fog px-7 py-8 my-10 sm:px-9">
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
