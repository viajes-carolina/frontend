"use client";

import React from "react";
import Image from "next/image";
import { TestimonialDTO, FaqItemDTO } from "@vc/api-client";
import { useAdminTrust } from "../../hooks/useAdminTrust";
import { Button, PlusIcon, EditIcon, TrashIcon, CheckIcon, StarIcon, HelpCircleIcon, ImageIcon } from "@vc/ui";
import { TestimonialFormModal } from "./TestimonialFormModal";
import { FaqFormModal } from "./FaqFormModal";

export interface TrustManagerProps {
  initialTestimonials: TestimonialDTO[];
  initialFaqs: FaqItemDTO[];
}

export function TrustManager({ initialTestimonials, initialFaqs }: TrustManagerProps) {
  const {
    activeTab, setActiveTab,
    testimonials, faqs,
    statusMessage,
    // Testimonial Form State
    isTestimonialModalOpen, setIsTestimonialModalOpen,
    editingTestimonial,
    clientName, setClientName,
    clientLocation, setClientLocation,
    tripDestination, setTripDestination,
    comment, setComment,
    rating, setRating,
    avatarMediaId, avatarMediaUrl,
    consentConfirmed, setConsentConfirmed,
    testimonialDisplayOrder, setTestimonialDisplayOrder,
    testimonialActive, setTestimonialActive,
    isAvatarPickerOpen, setIsAvatarPickerOpen,
    openCreateTestimonial, openEditTestimonial,
    handleSelectAvatar, handleSaveTestimonial, handleDeleteTestimonial,
    // FAQ Form State
    isFaqModalOpen, setIsFaqModalOpen,
    editingFaq,
    question, setQuestion,
    answer, setAnswer,
    category, setCategory,
    faqDisplayOrder, setFaqDisplayOrder,
    faqActive, setFaqActive,
    openCreateFaq, openEditFaq,
    handleSaveFaq, handleDeleteFaq,
  } = useAdminTrust(initialTestimonials, initialFaqs);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Notifications */}
      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
          <CheckIcon size={20} className="text-emerald-600 shrink-0" />
          <span className="font-medium text-sm">{statusMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-neutral-border pb-4">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("testimonials")}
            className={`px-5 py-2.5 rounded-xl font-sora text-sm font-semibold transition-all ${
              activeTab === "testimonials"
                ? "bg-brand-navy text-white shadow-md"
                : "bg-white text-neutral-muted hover:text-brand-navy border border-neutral-border"
            }`}
          >
            ★ Testimonios ({testimonials.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("faqs")}
            className={`px-5 py-2.5 rounded-xl font-sora text-sm font-semibold transition-all ${
              activeTab === "faqs"
                ? "bg-brand-navy text-white shadow-md"
                : "bg-white text-neutral-muted hover:text-brand-navy border border-neutral-border"
            }`}
          >
            ❓ Preguntas Frecuentes ({faqs.length})
          </button>
        </div>

        {activeTab === "testimonials" ? (
          <Button
            variant="primary"
            size="sm"
            icon={<PlusIcon size={18} />}
            onClick={openCreateTestimonial}
          >
            Nuevo Testimonio
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            icon={<PlusIcon size={18} />}
            onClick={openCreateFaq}
          >
            Nueva FAQ
          </Button>
        )}
      </div>

      {/* Tab Content 1: Testimonials */}
      {activeTab === "testimonials" && (
        <div className="bg-white rounded-3xl border border-neutral-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-border bg-neutral-surface/50 text-[11px] font-sora font-bold text-neutral-muted uppercase tracking-wider">
                  <th className="py-4 px-6">Cliente</th>
                  <th className="py-4 px-6">Viaje / Destino</th>
                  <th className="py-4 px-6">Calificación</th>
                  <th className="py-4 px-6">Comentario</th>
                  <th className="py-4 px-6">Estado</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border">
                {testimonials.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-surface/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full bg-neutral-surface border border-neutral-border overflow-hidden shrink-0 flex items-center justify-center">
                          {item.avatarMediaUrl ? (
                            <Image
                              src={item.avatarMediaUrl.startsWith("http") || item.avatarMediaUrl.startsWith("/") ? item.avatarMediaUrl : `/${item.avatarMediaUrl}`}
                              alt={item.clientName}
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <span className="font-sora font-bold text-xs text-brand-navy">
                              {item.clientName.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-sora font-bold text-sm text-brand-navy block">
                            {item.clientName}
                          </span>
                          <span className="font-inter text-xs text-neutral-muted">
                            {item.clientLocation || "Perú"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-inter text-xs text-brand-navy font-semibold">
                      {item.tripDestination}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: item.rating || 5 }).map((_, i) => (
                          <StarIcon key={i} size={14} />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs font-inter text-xs text-neutral-muted line-clamp-2 italic">
                      "{item.comment}"
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-neutral-surface text-neutral-muted border border-neutral-border"
                        }`}
                      >
                        {item.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<EditIcon size={14} />}
                          onClick={() => openEditTestimonial(item)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={<TrashIcon size={14} />}
                          onClick={() => handleDeleteTestimonial(item.id)}
                        >
                          Desactivar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: FAQs */}
      {activeTab === "faqs" && (
        <div className="bg-white rounded-3xl border border-neutral-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-border bg-neutral-surface/50 text-[11px] font-sora font-bold text-neutral-muted uppercase tracking-wider">
                  <th className="py-4 px-6">Categoría</th>
                  <th className="py-4 px-6">Pregunta Frecuente</th>
                  <th className="py-4 px-6">Respuesta</th>
                  <th className="py-4 px-6">Estado</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border">
                {faqs.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-surface/30 transition-colors">
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-brand-blue/10 text-brand-blue font-sora text-xs font-bold border border-brand-blue/20">
                        {item.category || "General"}
                      </span>
                    </td>
                    <td className="py-4 px-6 max-w-xs font-sora font-bold text-sm text-brand-navy">
                      {item.question}
                    </td>
                    <td className="py-4 px-6 max-w-sm font-inter text-xs text-neutral-muted line-clamp-2">
                      {item.answer}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-neutral-surface text-neutral-muted border border-neutral-border"
                        }`}
                      >
                        {item.active ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<EditIcon size={14} />}
                          onClick={() => openEditFaq(item)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={<TrashIcon size={14} />}
                          onClick={() => handleDeleteFaq(item.id)}
                        >
                          Desactivar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <TestimonialFormModal
        isOpen={isTestimonialModalOpen}
        onClose={() => setIsTestimonialModalOpen(false)}
        onSubmit={handleSaveTestimonial}
        isEditing={!!editingTestimonial}
        clientName={clientName}
        setClientName={setClientName}
        clientLocation={clientLocation}
        setClientLocation={setClientLocation}
        tripDestination={tripDestination}
        setTripDestination={setTripDestination}
        comment={comment}
        setComment={setComment}
        rating={rating}
        setRating={setRating}
        avatarMediaId={avatarMediaId}
        avatarMediaUrl={avatarMediaUrl}
        consentConfirmed={consentConfirmed}
        setConsentConfirmed={setConsentConfirmed}
        displayOrder={testimonialDisplayOrder}
        setDisplayOrder={setTestimonialDisplayOrder}
        active={testimonialActive}
        setActive={setTestimonialActive}
        isAvatarPickerOpen={isAvatarPickerOpen}
        setIsAvatarPickerOpen={setIsAvatarPickerOpen}
        onSelectAvatar={handleSelectAvatar}
      />

      <FaqFormModal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
        onSubmit={handleSaveFaq}
        isEditing={!!editingFaq}
        question={question}
        setQuestion={setQuestion}
        answer={answer}
        setAnswer={setAnswer}
        category={category}
        setCategory={setCategory}
        displayOrder={faqDisplayOrder}
        setDisplayOrder={setFaqDisplayOrder}
        active={faqActive}
        setActive={setFaqActive}
      />
    </div>
  );
}
