"use client"

import { IconHeart, IconHeartFilled } from "@tabler/icons-react"
import { useFavorites } from "@/hooks/useFavorites"

interface FavoriteButtonProps {
  recipeId: string
  recipeName: string
}

export default function FavoriteButton({ recipeId, recipeName }: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites()
  const active = isFavorite(recipeId)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(recipeId)
      }}
      aria-label={active ? `Quitar ${recipeName} de favoritos` : `Guardar ${recipeName} en favoritos`}
      aria-pressed={active}
      className={`flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-200 ${
        active
          ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
          : "border-white/60 bg-white/40 text-slate-400 hover:bg-white/70 hover:text-red-400 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:text-red-400"
      }`}
    >
      {active ? (
        <IconHeartFilled className="h-4 w-4" />
      ) : (
        <IconHeart className="h-4 w-4" />
      )}
    </button>
  )
}
