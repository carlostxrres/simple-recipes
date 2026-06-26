import { Suspense } from "react"
import { IconChefHat } from "@tabler/icons-react"
import type { Metadata } from "next"
import MasonryGrid from "@/components/MasonryGrid"
import RecipeCard from "@/components/RecipeCard"
import GalleryFilters from "@/app/sections/GalleryFilters"
import ActiveFilterPills from "./ActiveFilterPills"
import RecipeSearch from "./RecipeSearch"
import ShuffleButton from "./ShuffleButton"
import Pagination from "@/components/Pagination"
import {
  getRecipes,
  getTags,
  getCuisines,
  getIngredients,
  getAllergens,
  getUtensils,
} from "@/lib/queries"
import type { SearchFilters } from "@/lib/types"

const PER_PAGE = 24

type RawParams = {
  search?: string
  tag?: string | string[]
  cuisine?: string
  includeIngredients?: string | string[]
  excludeIngredients?: string | string[]
  includeUtensils?: string | string[]
  excludeUtensils?: string | string[]
  excludeAllergens?: string | string[]
  maxTime?: string
  page?: string
  seed?: string
}

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return []
  return Array.isArray(v) ? v : [v]
}

interface RecipesPageProps {
  searchParams: Promise<RawParams>
}

export const metadata: Metadata = {
  title: "Recetas | Simple Eats",
  description: "Explora todas las recetas de Simple Eats.",
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const p = await searchParams
  const page = Math.max(1, parseInt(p.page ?? "1") || 1)

  const filters: SearchFilters = {
    search: p.search,
    tag: toArray(p.tag),
    cuisine: p.cuisine,
    includeIngredients: toArray(p.includeIngredients),
    excludeIngredients: toArray(p.excludeIngredients),
    includeUtensils: toArray(p.includeUtensils),
    excludeUtensils: toArray(p.excludeUtensils),
    excludeAllergens: toArray(p.excludeAllergens),
    maxTime: p.maxTime ? parseInt(p.maxTime) || undefined : undefined,
    seed: p.seed,
  }

  const [recipesData, tagsData, cuisinesData, ingredientsData, allergensData, utensilsData] =
    await Promise.all([
      getRecipes({ ...filters, page, limit: PER_PAGE }),
      getTags(),
      getCuisines(),
      getIngredients(),
      getAllergens(),
      getUtensils(),
    ])

  const { data: recipes, pagination } = recipesData

  return (
    <main className="flex flex-col gap-8 pb-16">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl dark:text-slate-100">
          Todas las recetas
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {pagination.total} receta{pagination.total !== 1 ? "s" : ""}
          {pagination.totalPages > 1 &&
            ` · Página ${page} de ${pagination.totalPages}`}
        </p>
      </div>

      {/* Search + filter row */}
      <div className="flex flex-wrap items-center gap-3">
        <Suspense fallback={<div className="h-9 flex-1 max-w-md rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />}>
          <RecipeSearch />
        </Suspense>
        <Suspense fallback={<div className="h-9 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />}>
          <ShuffleButton />
        </Suspense>
        <Suspense
          fallback={
            <div className="h-10 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          }
        >
          <GalleryFilters
            tags={tagsData.data}
            cuisines={cuisinesData.data}
            ingredients={ingredientsData.data}
            allergens={allergensData.data}
            utensils={utensilsData.data}
          />
        </Suspense>
      </div>

      {/* Active filter pills */}
      <ActiveFilterPills
        searchParams={p}
        tags={tagsData.data}
        cuisines={cuisinesData.data}
        ingredients={ingredientsData.data}
        allergens={allergensData.data}
        utensils={utensilsData.data}
      />

      {/* Results */}
      {recipes.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <IconChefHat className="w-16 h-16 text-slate-300 dark:text-slate-600" />
          <div>
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              No hay recetas con esos filtros
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Prueba a ajustar o eliminar algunos filtros
            </p>
          </div>
        </div>
      ) : (
        <MasonryGrid>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </MasonryGrid>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={pagination.totalPages}
          basePath="/recipes"
          searchParams={p}
        />
      )}
    </main>
  )
}
