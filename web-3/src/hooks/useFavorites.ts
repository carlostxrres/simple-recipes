"use client"

import { useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "simple-eats-favorites"

function readStorage(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function writeStorage(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
  } catch {
    // storage full or unavailable
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Hydrate from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    setFavorites(readStorage())
  }, [])

  const toggle = useCallback((recipeId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(recipeId)) next.delete(recipeId)
      else next.add(recipeId)
      writeStorage(next)
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (recipeId: string) => favorites.has(recipeId),
    [favorites],
  )

  return { favorites, toggle, isFavorite }
}
