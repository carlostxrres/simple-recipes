import { IconArrowRight } from "@tabler/icons-react"
import MasonryGrid from "../../components/MasonryGrid"
import RecipeCard from "../../components/RecipeCard"
import GalleryFilters from "./GalleryFilters"
import { getRecipes, getTags } from "../../lib/api"

interface GalleryProps {
  selectedTags: string[]
}

export default async function Gallery({ selectedTags }: GalleryProps) {
  const [recipesData, tagsData] = await Promise.all([
    getRecipes({ page: 1, limit: 12, tag: selectedTags.length ? selectedTags : undefined }),
    getTags(),
  ])
  const recipes = recipesData.data
  const tags = tagsData.data

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

      <div className="flex justify-end">
        <GalleryFilters tags={tags} selectedTags={selectedTags} />
      </div>

      <MasonryGrid>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </MasonryGrid>

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
