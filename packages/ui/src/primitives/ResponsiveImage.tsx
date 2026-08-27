"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

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
  // Las imágenes `priority` arrancan visibles (van sobre el fold, no deben
  // parpadear); el resto arranca oculta para que el fundido de entrada se
  // note al cargar.
  const [isLoaded, setIsLoaded] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Salvaguarda: si la imagen ya está en caché del navegador, el evento
  // `load` puede no dispararse — sin esto se queda atascada en "cargando".
  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  const focalX = Math.max(0, Math.min(100, focalPoint?.x ?? 50));
  const focalY = Math.max(0, Math.min(100, focalPoint?.y ?? 50));

  const objectPositionStyle = `${focalX}% ${focalY}%`;

  // Prevent Cumulative Layout Shift (CLS < 0.1)
  const containerStyle: React.CSSProperties = {
    position: fill ? "absolute" : "relative",
    ...(fill ? { inset: 0 } : {}),
    overflow: "hidden",
    ...(aspectRatio ? { aspectRatio } : {}),
  };

  const safeSrc = src.startsWith("http") || src.startsWith("/") || src.startsWith("blob:") || src.startsWith("data:") ? src : `/${src}`;

  // blob:/data: aparecen durante la vista previa local de un archivo recién
  // elegido (antes de subirlo) en MediaPickerModal — next/image no puede
  // optimizar esos esquemas y fallaría sin este flag.
  const isUnoptimizedSrc = safeSrc.startsWith("blob:") || safeSrc.startsWith("data:");

  const imageStyle: React.CSSProperties = {
    objectFit,
    objectPosition: objectPositionStyle,
  };

  const imageClassName = `transition-all duration-300 ease-out ${
    isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 blur-sm"
  } ${imgClassName}`;

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setIsLoaded(true);

  return (
    <figure className={`group overflow-hidden ${fill ? "w-full h-full" : "rounded-2xl bg-neutral-surface"} ${className}`} style={containerStyle}>
      {fill ? (
        <Image
          ref={imgRef}
          src={safeSrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={isUnoptimizedSrc}
          style={imageStyle}
          className={imageClassName}
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        <Image
          ref={imgRef}
          src={safeSrc}
          alt={alt}
          // Fuera de `fill`, next/image exige width/height numéricos — ningún
          // llamador actual de ResponsiveImage usa esta rama sin `fill`
          // (ver ResponsiveImage sin `fill` ni `width`/`height` era el bug
          // corregido en SearchResultsView), pero se preserva la interfaz
          // pública tal cual para no romper integraciones futuras.
          width={width!}
          height={height!}
          sizes={sizes}
          priority={priority}
          unoptimized={isUnoptimizedSrc}
          style={imageStyle}
          className={imageClassName}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {caption && (
        <figcaption className="text-xs text-neutral-muted mt-1.5 px-1 font-inter">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
