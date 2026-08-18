"use client";

import React, { useState } from "react";
import { useAdminContact } from "../../hooks/useAdminContact";
import { ContactSettingsForm } from "./ContactSettingsForm";
import { InquiryInbox } from "./InquiryInbox";
import { Button, MailIcon, ArrowUpRightIcon } from "@vc/ui";

export default function AdminContactPage() {
  const [activeTab, setActiveTab] = useState<"inbox" | "settings">("inbox");
  const {
    pageSettings,
    inquiries,
    statusFilter,
    setStatusFilter,
    loading,
    saving,
    saveSuccess,
    error,
    updateSettings,
    updateInquiryStatus,
  } = useAdminContact();

  if (loading || !pageSettings) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  const newCount = inquiries.filter((i) => i.status === "NEW").length;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-brand-accent">
              Corte 9 · Leads & Contacto
            </span>
            {newCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                {newCount} NUEVAS
              </span>
            )}
          </div>
          <h1 className="font-sora font-bold text-2xl text-brand-navy">
            Bandeja de Consultas & Contacto
          </h1>
          <p className="font-inter text-neutral-muted text-sm mt-1">
            Gestión de leads entrantes desde el formulario web, validación anti-bot Turnstile y configuración editorial.
          </p>
        </div>
        <div className="flex gap-3">
          <a href="http://localhost:3000/contacto" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" icon={<ArrowUpRightIcon size={16} />}>
              Ver Página Pública
            </Button>
          </a>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-inter">
          ⚠️ {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-border pb-px">
        <button
          onClick={() => setActiveTab("inbox")}
          className={`px-5 py-2.5 font-sora font-semibold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "inbox"
              ? "border-brand-accent text-brand-navy"
              : "border-transparent text-neutral-muted hover:text-brand-navy"
          }`}
        >
          <MailIcon size={16} />
          <span>Bandeja de Consultas</span>
          <span className="text-xs bg-neutral-light px-2 py-0.5 rounded-full font-bold">
            {inquiries.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-5 py-2.5 font-sora font-semibold text-sm border-b-2 transition-all ${
            activeTab === "settings"
              ? "border-brand-accent text-brand-navy"
              : "border-transparent text-neutral-muted hover:text-brand-navy"
          }`}
        >
          Configuración de Página
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "inbox" ? (
        <InquiryInbox
          inquiries={inquiries}
          statusFilter={statusFilter}
          onFilterChange={setStatusFilter}
          onUpdateStatus={updateInquiryStatus}
        />
      ) : (
        <ContactSettingsForm
          initialData={pageSettings}
          onSave={updateSettings}
          saving={saving}
          saveSuccess={saveSuccess}
        />
      )}
    </div>
  );
}
