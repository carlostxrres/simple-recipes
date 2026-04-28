import { IconArrowRight, IconChefHat } from "@tabler/icons-react"
import Link from "next/link"
import MasonryGrid from "../../components/MasonryGrid"
import RecipeCard from "../../components/RecipeCard"
import { getRecipes } from "../../lib/api"

export default async function Gallery() {
  let recipes: Awaited<ReturnType<typeof getRecipes>>["data"] = []
  let total = 0
  try {
    const recipesData = await getRecipes({ page: 1, limit: 12 })
    recipes = recipesData.data
    total = recipesData.pagination.total
  } catch (err) {
    console.error("[Gallery] Failed to fetch recipes:", err)
  }

  return (
    <section id="gallery" className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 text-balance">
        <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl dark:text-slate-100">
          Descubre tus próximas recetas favoritas.
        </h2>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
          Recetas elegidas por su sencillez, rapidez y sabor. Come mejor con
          ingredientes reales y sin complicaciones.
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <IconChefHat className="w-16 h-16 text-slate-300 dark:text-slate-600" />
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
            No hay recetas disponibles
          </p>
        </div>
      ) : (
        <MasonryGrid>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </MasonryGrid>
      )}

      <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {total > 12
            ? `Mostrando 12 de ${total} recetas`
            : `${total} receta${total !== 1 ? "s" : ""}`}
        </p>
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-md focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800"
          href="/recipes"
        >
          <span>Ver todas las recetas</span>
          <IconArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
