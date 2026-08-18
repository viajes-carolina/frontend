"use client";

import React from "react";
import { PublicContactResponse } from "@vc/api-client";
import { ContactHeroSection, ContactFormSection, ContactDirectBox } from "@vc/ui";
import { useContactForm } from "../../hooks/useContactForm";

export interface ContactClientViewProps {
  contactData: PublicContactResponse;
}

export function ContactClientView({ contactData }: ContactClientViewProps) {
  const { submitInquiry } = useContactForm();

  return (
    <div className="w-full">
      {/* Hero */}
      <ContactHeroSection page={contactData.page} />

      {/* Main Form & Direct Box Grid */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7">
            <ContactFormSection
              page={contactData.page}
              onSubmitInquiry={submitInquiry}
            />
          </div>

          {/* Right Column: Direct Channels Box (5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <ContactDirectBox
              page={contactData.page}
              whatsappPhone={contactData.whatsappPhone}
              primaryPhone={contactData.primaryPhone}
              contactEmail={contactData.contactEmail}
              officeAddress={contactData.officeAddress}
              officeHours={contactData.officeHours}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
