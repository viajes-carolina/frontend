import React from "react";

export interface JourneyConnectorProps {
  variant?: "horizontal" | "vertical" | "curved";
  className?: string;
}

export function JourneyConnector({
  variant = "curved",
  className = "",
}: JourneyConnectorProps) {
  if (variant === "vertical") {
    return (
      <div className={`flex flex-col items-center justify-center my-4 ${className}`} aria-hidden="true">
        <div className="w-0.5 h-16 border-l-2 border-dashed border-brand-sunset/60" />
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden flex items-center justify-center py-2 ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-5xl h-12 text-brand-sunset"
      >
        <path
          d="M0 32C300 64 600 0 900 32C1050 48 1150 20 1200 32"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray="6 8"
          strokeLinecap="round"
          className="opacity-75"
        />
      </svg>
    </div>
  );
}
