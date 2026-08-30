"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClient, type MediaAssetDTO } from "@vc/api-client";

/** Tamaño de página de la lectura única de la biblioteca. */
const LIBRARY_PAGE_SIZE = 200;

/**
 * Índice `id -> MediaAssetDTO` de la biblioteca de medios.
 *
 * El editor de contenidos guarda de cada imagen solo `id`, `url` y punto focal;
 * el diseño, en cambio, muestra nombre de archivo, dimensiones y peso. Esa
 * ficha completa solo existe en la biblioteca, así que se lee una vez al montar
 * el editor y se consulta por `id`.
 *
 * `register` incorpora al índice la imagen que el usuario acaba de elegir en el
 * selector: ahí el DTO llega completo y no hay que volver a pedir la lista.
 *
 * Si la lectura falla no se rompe nada: el índice queda vacío y `describeMedia`
 * degrada a lo que sí se sabe.
 */
export function useMediaMetadata() {
  const [assets, setAssets] = useState<Map<number, MediaAssetDTO>>(new Map());

  useEffect(() => {
    let cancelled = false;
    apiClient
      .getMediaList(0, LIBRARY_PAGE_SIZE)
      .then((res) => {
        if (cancelled) return;
        setAssets(new Map((res.items || []).map((item) => [item.id, item])));
      })
      .catch((err) => {
        console.error("No se pudo leer la biblioteca de medios:", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const register = useCallback((asset: MediaAssetDTO) => {
    setAssets((prev) => new Map(prev).set(asset.id, asset));
  }, []);

  return { assets, register };
}
