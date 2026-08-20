"use client";

import React, { useRef, useState } from "react";

export interface FocalPointPickerProps {
  src: string;
  alt: string;
  initialFocalX?: number; // 0..100
  initialFocalY?: number; // 0..100
  onChange: (focalX: number, focalY: number) => void;
  className?: string;
}

export function FocalPointPicker({
  src,
  alt,
  initialFocalX = 50,
  initialFocalY = 50,
  onChange,
  className = "",
}: FocalPointPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [focalX, setFocalX] = useState<number>(initialFocalX);
  const [focalY, setFocalY] = useState<number>(initialFocalY);
  const [isDragging, setIsDragging] = useState(false);

  const calculatePoint = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawX = ((clientX - rect.left) / rect.width) * 100;
    const rawY = ((clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.round(Math.max(0, Math.min(100, rawX)) * 10) / 10;
    const clampedY = Math.round(Math.max(0, Math.min(100, rawY)) * 10) / 10;

    setFocalX(clampedX);
    setFocalY(clampedY);
    onChange(clampedX, clampedY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    calculatePoint(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    calculatePoint(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const safeSrc = src
    ? src.startsWith("http") || src.startsWith("/") || src.startsWith("data:") || src.startsWith("blob:")
      ? src
      : `/${src}`
    : "/media/demo-hero-travel.webp";

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted">
          Punto Focal Interactivo (Centro de Atención)
        </label>
        <span className="font-inter text-xs font-bold text-brand-navy bg-brand-navy/10 px-2.5 py-1 rounded-full">
          X: {focalX}% | Y: {focalY}%
        </span>
      </div>

      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-crosshair select-none border-2 border-dashed border-brand-accent/40 bg-neutral-surface shadow-inner"
      >
        <img
          src={safeSrc}
          alt={alt}
          className="w-full h-full object-contain pointer-events-none"
        />

        {/* Crosshair Target Indicator */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-75"
          style={{
            left: `${focalX}%`,
            top: `${focalY}%`,
          }}
        >
          <div className="relative flex items-center justify-center">
            {/* Outer animated ring */}
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-[0_0_12px_rgba(0,0,0,0.6)] animate-pulse" />
            {/* Inner primary circle */}
            <div className="absolute w-4 h-4 rounded-full bg-brand-accent border-2 border-white shadow-md" />
            {/* Cross lines */}
            <div className="absolute w-6 h-0.5 bg-white shadow-sm" />
            <div className="absolute h-6 w-0.5 bg-white shadow-sm" />
          </div>
        </div>
      </div>

      <p className="font-inter text-xs text-neutral-muted">
        💡 Haz clic o arrastra la mira sobre el área visual más importante (rostros, monumento o paisaje). Esto garantiza que no se corte en pantallas móviles o formatos verticales.
      </p>
    </div>
  );
}
