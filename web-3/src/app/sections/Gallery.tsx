import { IconArrowRight } from "@tabler/icons-react"
import RecipeCard from "../../components/RecipeCard"
import {
  getRecipes,
  getTags,
  getCuisines,
  getAllergens,
  getIngredients,
} from "../../lib/api"

interface Params {
  page?: string
  search?: string
  tag?: string
  cuisine?: string
  includeIngredients?: string | string[]
  excludeAllergens?: string | string[]
  maxTime?: string
}

export default async function () {
  const params: Params = {}

  const page = parseInt(params.page || "1")
  const search = params.search || ""
  const tag = params.tag || ""
  const cuisine = params.cuisine || ""
  const maxTime = params.maxTime ? parseInt(params.maxTime) : undefined

  // Handle array params
  const includeIngredients = params.includeIngredients
    ? Array.isArray(params.includeIngredients)
      ? params.includeIngredients
      : [params.includeIngredients]
    : []
  const excludeAllergens = params.excludeAllergens
    ? Array.isArray(params.excludeAllergens)
      ? params.excludeAllergens
      : [params.excludeAllergens]
    : []

  // Fetch data
  const [recipesData, tagsData, cuisinesData, allergensData, ingredientsData] =
    await Promise.all([
      getRecipes({
        page,
        limit: 12,
        search,
        tag,
        cuisine,
        includeIngredients,
        excludeAllergens,
        maxTime,
      }),
      getTags(),
      getCuisines(),
      getAllergens(),
      getIngredients(),
    ])

  const recipes = recipesData.data
  const pagination = recipesData.pagination

  return (
    <section id="gallery" className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 text-balance">
        <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl dark:text-slate-100">
          Discover new recipes to make on repeat.
        </h2>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
          Explore recipes chosen for their simplicity, speed, and flavor. Cook
          smarter with real food dishes that have earned their place in people's
          kitchens.
        </p>
      </div>
      <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:auto-rows-[380px] lg:grid-cols-3">
        {recipes.map((recipe, index) => (
          <RecipeCard key={recipe.id} recipe={recipe} index={index} />
        ))}
      </div>

      {/* To do: make button work */}
      <div className="mt-10 flex justify-center">
        <a
          className="inline-flex items-end gap-2 rounded-full font-semibold transition focus-visible:outline focus-visible:outline-offset-2 border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800 px-6 py-3 text-sm shadow-sm hover:shadow-md"
          href="/recipes"
        >
          <span>Explore all recipes</span>
          <IconArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  )
}
