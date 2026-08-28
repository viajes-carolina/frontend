"use client";

import React from "react";
import { FaqItemDTO } from "@vc/api-client";
import { Reveal } from "../primitives/Reveal";

export interface BlogQuestionsPauseSectionProps {
  faqs: FaqItemDTO[];
}

export const BlogQuestionsPauseSection: React.FC<BlogQuestionsPauseSectionProps> = ({ faqs }) => {
  if (faqs.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <span
        aria-hidden="true"
        className="font-display pointer-events-none absolute -top-6 right-4 select-none text-[140px] font-semibold leading-none text-[rgba(240,229,210,0.7)] sm:text-[170px]"
      >
        02
      </span>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-accent">
            02 · Respuestas para prepararte
          </p>
          <h2
            className="font-display mt-3 text-3xl font-semibold text-brand-navy sm:text-4xl lg:text-[46px]"
            style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
          >
            Preguntas que otros viajeros también se hicieron
          </h2>
          <p className="font-inter mt-3 text-base text-brand-navy/75 sm:text-lg">
            Lecturas breves para decidir con más claridad, sin sentir que tienes que resolverlo todo de una vez.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-2 sm:grid-cols-2 lg:mt-14">
          {faqs.map((faq, i) => (
            <Reveal
              key={faq.id}
              delayMs={i * 60}
              className={`py-6 ${
                i < 2 ? "border-t-0 sm:border-t-0" : "border-t border-brand-navy/[0.18]"
              }`}
            >
              <span
                className="font-display block text-[28px] font-semibold text-brand-accent"
                style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display mt-2 text-xl font-semibold text-brand-navy sm:text-2xl">
                {faq.question}
              </h3>
              <p className="mt-2 text-sm text-brand-navy/75 line-clamp-2">{faq.answer}</p>
              <span className="mt-3 inline-flex text-[13px] font-semibold text-brand-navy">
                Leer respuesta →
              </span>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center lg:mt-14">
          <a
            href="/blog"
            className="font-inter text-sm font-semibold text-brand-navy hover:text-brand-accent transition-colors"
          >
            Ver todas las historias del diario →
          </a>
        </div>
      </div>
    </section>
  );
};
