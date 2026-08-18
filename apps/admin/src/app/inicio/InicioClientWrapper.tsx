"use client";

import React, { useState } from "react";
import type { HomeHeroDTO, HomeBlogInspirationDTO } from "@vc/api-client";
import { HeroForm } from "./HeroForm";
import { BlogInspirationForm } from "./BlogInspirationForm";

interface InicioClientWrapperProps {
  hero: HomeHeroDTO;
  inspiration: HomeBlogInspirationDTO;
}

export const InicioClientWrapper: React.FC<InicioClientWrapperProps> = ({
  hero,
  inspiration,
}) => {
  const [activeTab, setActiveTab] = useState<"hero" | "inspiration">("hero");

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex gap-3 border-b border-neutral-border pb-3">
        <button
          onClick={() => setActiveTab("hero")}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === "hero"
              ? "bg-brand-navy text-white shadow"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          🚀 Hero Principal
        </button>
        <button
          onClick={() => setActiveTab("inspiration")}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === "inspiration"
              ? "bg-brand-navy text-white shadow"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          ✨ Inspiración desde Blog (Figma 06)
        </button>
      </div>

      {activeTab === "hero" ? (
        <HeroForm initialHero={hero} />
      ) : (
        <BlogInspirationForm initialConfig={inspiration} />
      )}
    </div>
  );
};
