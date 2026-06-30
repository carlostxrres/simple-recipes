import Link from "next/link"
import Image from "next/image"
import { IconChefHat, IconClock, IconFlame } from "@tabler/icons-react"
import { getRecipes } from "@/lib/queries"
import { formatTime, getDifficultyColor, getDifficultyLabel } from "@/lib/format"
import { Badge } from "@/components/ui/Badge"
import FavoriteButton from "@/components/FavoriteButton"
import type { Tag, Cuisine } from "@/lib/types"

interface RelatedSectionProps {
  currentId: string
  cuisines: Cuisine[]
  tags: Tag[]
}

export async function RelatedSection({ currentId, cuisines, tags }: RelatedSectionProps) {
  // Try cuisine first, then first tag
  const cuisineSlug = cuisines[0]?.slug
  const tagSlug = tags[0]?.slug

  const data = await getRecipes({
    cuisine: cuisineSlug,
    tag: cuisineSlug ? undefined : tagSlug,
    limit: 5,
    page: 1,
  })

  const related = data.data.filter((r) => r.id !== currentId).slice(0, 4)

  if (related.length === 0) {
    return null
  }

  const sectionLabel = cuisineSlug
    ? `Más recetas de cocina ${cuisines[0].name}`
    : `Recetas similares`

  return (
    <section className="no-print">
      <h2 className="text-xl font-bold text-text-primary mb-6">{sectionLabel}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {related.map((recipe) => (
          <Link key={recipe.id} href={`/recipes/${recipe.slug}`}>
            <article className="recipe-card glass-frost rounded-2xl overflow-hidden group cursor-pointer border border-white/90">
              <div className="relative aspect-4/3 overflow-hidden">
                {recipe.image_url ? (
                  <Image
                    src={recipe.image_url}
                    alt={recipe.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <IconChefHat className="w-10 h-10 text-primary-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <FavoriteButton recipeSlug={recipe.slug} recipeName={recipe.name} />
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-semibold text-sm leading-tight group-hover:text-primary-600 transition-colors line-clamp-2">
                  <span>{recipe.name}</span>{" "}
                  <span className="text-text-secondary font-normal">{recipe.headline}</span>
                </h3>

                <div className="flex items-center gap-2 mt-2 text-xs text-text-secondary">
                  <div className="flex items-center gap-1">
                    <IconClock className="w-3.5 h-3.5" />
                    <span>{formatTime(recipe.time_minutes)}</span>
                  </div>
                  <Badge className={`${getDifficultyColor(recipe.difficulty)} text-[10px] px-1.5 py-0`}>
                    {getDifficultyLabel(recipe.difficulty)}
                  </Badge>
                  <div className="flex items-center gap-1 ml-auto">
                    <IconFlame className="w-3.5 h-3.5 text-primary-500" />
                    <span>{Math.round(recipe.nutrition_energy_kcal)} kcal</span>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}
