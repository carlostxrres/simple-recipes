"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { IconHeartOff } from "@tabler/icons-react"
import { useFavorites } from "@/hooks/useFavorites"
import RecipeCard from "@/components/RecipeCard"
import type { Recipe } from "@/lib/types"
import { sileo } from "sileo"

async function fetchRecipeBySlug(slug: string): Promise<Recipe | null> {
  try {
    const res = await fetch(`/api/recipes/slug/${slug}`)
    if (!res.ok) {
      return null
    }
    const data = await res.json()
    return data.data as Recipe
  } catch {
    return null
  }
}

export default function FavoritesContent() {
  const { favorites, hydrated } = useFavorites()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)

  const slugs = [...favorites]
  const slugKey = slugs.join(",")

  useEffect(() => {
    if (!hydrated) {
      return
    }
    if (slugs.length === 0) {
      setRecipes([])
      return
    }
    setLoading(true)
    Promise.all(slugs.map(fetchRecipeBySlug)).then((results) => {
      const loaded = results.filter((r): r is Recipe => r !== null)
      setRecipes(loaded)
      setLoading(false)
      if (loaded.length < results.length) {
        sileo.warning({
          title: "Algunas recetas no pudieron cargarse",
          description: "Puede ser un problema de conexión. Recarga para intentarlo de nuevo.",
        })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, slugKey])

  if (!hydrated || loading) {
    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="break-inside-avoid rounded-2xl overflow-hidden border border-white/90"
          >
            <div className="aspect-4/3 animate-pulse bg-slate-200 dark:bg-slate-700" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <IconHeartOff className="h-10 w-10 text-slate-400 dark:text-slate-500" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Aún no tienes favoritos
          </h2>
          <p className="max-w-sm text-slate-500 dark:text-slate-400">
            Guarda las recetas que te gusten pulsando el corazón para encontrarlas
            aquí fácilmente.
          </p>
        </div>
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Explorar recetas
        </Link>
      </div>
    )
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="break-inside-avoid">
          <RecipeCard recipe={recipe} />
        </div>
      ))}
    </div>
  )
}
