"use client";

import React from "react";

export function JourneyConnector() {
  return (
    <div className="w-full flex items-center justify-center py-6 overflow-hidden select-none">
      <svg
        className="w-full max-w-4xl h-12 text-brand-sunset/30 overflow-visible"
        viewBox="0 0 1200 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 24C300 48 450 0 750 24C1050 48 1150 12 1200 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        <circle cx="750" cy="24" r="4" fill="var(--color-brand-accent)" />
        <circle cx="1200" cy="24" r="4" fill="var(--color-brand-sunset)" />
      </svg>
    </div>
  );
}
