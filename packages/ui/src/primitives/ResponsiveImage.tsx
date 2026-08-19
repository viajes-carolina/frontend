"use client";

import React, { useState } from "react";

export interface FocalPoint {
  x: number; // 0..100
  y: number; // 0..100
}

export interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: string; // e.g. "16/9", "4/3", "1/1", "21/9"
  focalPoint?: FocalPoint;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  fill?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  caption?: string;
}

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  aspectRatio,
  focalPoint = { x: 50, y: 50 },
  priority = false,
  className = "",
  imgClassName = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  fill = false,
  objectFit = "cover",
  caption,
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(true);

  const focalX = Math.max(0, Math.min(100, focalPoint?.x ?? 50));
  const focalY = Math.max(0, Math.min(100, focalPoint?.y ?? 50));

  const objectPositionStyle = `${focalX}% ${focalY}%`;

  // Prevent Cumulative Layout Shift (CLS < 0.1)
  const containerStyle: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    ...(aspectRatio ? { aspectRatio } : {}),
  };

  const safeSrc = src.startsWith("http") || src.startsWith("/") ? src : `/${src}`;

  return (
    <figure className={`group overflow-hidden rounded-2xl bg-neutral-surface ${className}`} style={containerStyle}>
      <img
        src={safeSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{
          objectFit,
          objectPosition: objectPositionStyle,
          width: fill || aspectRatio ? "100%" : width ? `${width}px` : "100%",
          height: fill || aspectRatio ? "100%" : height ? `${height}px` : "auto",
        }}
        className={`transition-all duration-300 ease-out ${
          isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-90 blur-0"
        } ${imgClassName}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
      />

      {caption && (
        <figcaption className="text-xs text-neutral-muted mt-1.5 px-1 font-inter">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
