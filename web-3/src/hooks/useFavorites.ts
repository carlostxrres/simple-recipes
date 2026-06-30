"use client"

import { useState, useEffect, useCallback } from "react"
import { sileo } from "sileo"

const STORAGE_KEY = "simple-eats-favs"

function readStorage(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function writeStorage(slugs: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...slugs]))
  } catch {
    sileo.error({
      title: "Error al guardar",
      description: "No se pudo guardar el favorito. Puede que el almacenamiento esté lleno.",
    })
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Hydrate from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    setFavorites(readStorage())
  }, [])

  const toggle = useCallback((recipeSlug: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(recipeSlug)) next.delete(recipeSlug)
      else next.add(recipeSlug)
      writeStorage(next)
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (recipeSlug: string) => favorites.has(recipeSlug),
    [favorites],
  )

  return { favorites, toggle, isFavorite }
}
