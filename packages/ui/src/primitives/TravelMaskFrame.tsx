"use client";

import React, { useId } from "react";
import { ResponsiveImage } from "./ResponsiveImage";
import { PlaneIcon, StarIcon } from "../icons/icons";

export interface TravelMaskFrameProps {
  imageUrl?: string;
  alt?: string;
  focalPoint?: { x: number; y: number };
  topBadge?: string;
  originText?: string;
  priceText?: string;
  ratingText?: string;
  subtitleText?: string;
  priority?: boolean;
  className?: string;
}

export function TravelMaskFrame({
  imageUrl,
  alt = "Destino de viaje",
  focalPoint = { x: 50, y: 50 },
  topBadge,
  originText,
  priceText,
  ratingText = "4.9/5 · Experiencias",
  subtitleText = "Salidas 2026 Confirmadas",
  priority = false,
  className = "",
}: TravelMaskFrameProps) {
  const clipId = useId();
  const maskId = `travel-mask-${clipId.replace(/:/g, "")}`;

  // SVG Asymmetric organic curved path from Figma (viewBox: 0 0 360 320)
  const maskPath =
    "M0 70C0 31.3401 31.3401 0 70 0H210C292.843 0 360 67.1573 360 150V250C360 288.66 328.66 320 290 320H150C67.1573 320 0 252.843 0 170V70Z";

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Decorative Ambient Glow Orbs */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-brand-sunset/20 via-brand-accent/15 to-atmosphere-sea/25 rounded-full blur-2xl pointer-events-none -z-10" />
      <div className="absolute -top-6 -right-6 w-48 h-48 bg-brand-sunset/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* SVG Clip Path Definition */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id={maskId} clipPathUnits="objectBoundingBox">
            <path
              d={maskPath}
              transform="scale(0.00277777777, 0.003125)"
            />
          </clipPath>
        </defs>
      </svg>

      {/* Organic Mask Frame Container */}
      <div className="relative w-full max-w-[360px] aspect-[360/320] group">
        
        {/* Masked Photo Wrapper */}
        <div
          className="relative w-full h-full overflow-hidden transition-transform duration-500 group-hover:scale-[1.02] shadow-2xl"
          style={{
            clipPath: `url(#${maskId})`,
            WebkitClipPath: `url(#${maskId})`,
          }}
        >
          {imageUrl ? (
            <ResponsiveImage
              src={imageUrl}
              alt={alt}
              fill
              priority={priority}
              focalPoint={focalPoint}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-atmosphere-twilight via-brand-navy to-brand-blue flex flex-col items-center justify-center p-6 text-white text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-brand-accent mb-3 group-hover:scale-110 transition-transform duration-300">
                <PlaneIcon size={32} />
              </div>
              <span className="font-sora text-sm font-bold text-white">
                {alt}
              </span>
            </div>
          )}

          {/* Subtle Contrast Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* Floating Top Badge */}
        {topBadge && (
          <div className="absolute -top-3 left-4 px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-neutral-border text-brand-navy font-sora text-xs font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span>{topBadge}</span>
          </div>
        )}

        {/* Floating Bottom Info Card: Origin & Price */}
        {(originText || priceText) && (
          <div className="absolute -bottom-4 right-2 sm:-right-4 px-4 py-2 rounded-2xl bg-brand-navy/95 backdrop-blur-md border border-white/20 text-white shadow-floating flex flex-col text-left space-y-0.5 animate-fade-in">
            {originText && (
              <span className="font-inter text-[11px] text-atmosphere-pale-sky font-medium">
                {originText}
              </span>
            )}
            {priceText && (
              <span className="font-sora font-extrabold text-sm sm:text-base text-brand-sunset">
                {priceText}
              </span>
            )}
          </div>
        )}

        {/* Floating Left Rating & Trust Badge */}
        {ratingText && (
          <div className="absolute top-1/2 -left-4 sm:-left-8 -translate-y-1/2 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-border shadow-floating flex items-center gap-2.5 text-left text-brand-navy hidden sm:flex animate-fade-in">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center shrink-0">
              <StarIcon size={16} />
            </div>
            <div className="flex flex-col">
              <span className="font-sora font-bold text-xs text-brand-navy leading-none">
                {ratingText}
              </span>
              <span className="font-inter text-[10px] text-neutral-muted mt-1 leading-none">
                {subtitleText}
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
