"use client"

import { useCallback } from "react"
import { sileo } from "sileo"
import { usePersistedSet } from "./usePersistedSet"

const STORAGE_KEY = "simple-eats-favs"

function onWriteError() {
  sileo.error({
    title: "Error al guardar",
    description: "No se pudo guardar el favorito. Puede que el almacenamiento esté lleno.",
  })
}

export function useFavorites() {
  const { ids: favorites, toggle, hydrated } = usePersistedSet(STORAGE_KEY, onWriteError)

  const isFavorite = useCallback(
    (recipeSlug: string) => favorites.has(recipeSlug),
    [favorites],
  )

  return { favorites, toggle, isFavorite, hydrated }
}
