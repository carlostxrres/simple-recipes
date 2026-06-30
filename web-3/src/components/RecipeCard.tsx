import { Badge } from "./ui/Badge"
import FavoriteButton from "./FavoriteButton"
import NotesButton from "./NotesButton"
import { formatTime, getDifficultyLabel, getDifficultyColor } from "../lib/api"
import { IconClock, IconFlame, IconChefHat } from "@tabler/icons-react"
import type { Recipe } from "../lib/types"
import Link from "next/link"
import Image from "next/image"

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <article className="recipe-card glass-frost rounded-2xl overflow-hidden group cursor-pointer dispersion border border-white/90">
        {/* Image container */}
        <div className="relative aspect-4/3 overflow-hidden">
          {recipe.image_url ? (
            <Image
              src={recipe.image_url}
              alt={recipe.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <IconChefHat className="w-16 h-16 text-primary-400" />
            </div>
          )}
          {/* Action buttons overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 pointer-events-auto">
            <FavoriteButton recipeSlug={recipe.slug} recipeName={recipe.name} />
            <NotesButton recipeSlug={recipe.slug} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 pointer-events-none">
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary-600 transition-colors">
            <span>{recipe.name}</span>{" "}
            <span className="text-text-secondary">{recipe.headline}</span>
          </h3>

          <div className="flex flex-wrap items-center gap-2 pt-1 mt-3">
            <div className="flex items-center gap-1 text-text-secondary text-sm">
              <IconClock className="w-4 h-4" />
              <span>{formatTime(recipe.time_minutes)}</span>
            </div>

            <Badge className={getDifficultyColor(recipe.difficulty)}>
              {getDifficultyLabel(recipe.difficulty)}
            </Badge>

            <div className="flex items-center gap-1 text-text-secondary text-sm ml-auto">
              <IconFlame className="w-4 h-4 text-primary-500" />
              <span>{Math.round(recipe.nutrition_energy_kcal)} kcal</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
