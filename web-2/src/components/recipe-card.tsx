"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { IconClock, IconFlame, IconChefHat } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { formatTime, getDifficultyLabel, getDifficultyColor } from "@/lib/api"
import type { Recipe } from "@/lib/types"

interface RecipeCardProps {
  recipe: Recipe
  index?: number
}

export function RecipeCard({ recipe, index = 0 }: RecipeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      <Link href={`/recipes/${recipe.slug}`}>
        <article className="recipe-card glass-frost rounded-2xl overflow-hidden group cursor-pointer dispersion">
          {/* Image container */}
          <div className="relative aspect-4/3 overflow-hidden">
            {recipe.image_url ? (
              // <Image
              //   src={recipe.image_url}
              //   alt={recipe.name}
              //   fill
              //   className="object-cover transition-transform duration-500 group-hover:scale-105"
              //   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              // />
              <img
                src={recipe.image_url}
                alt={recipe.name}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ viewTransitionName: `img-${recipe.id}` }}
              />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <IconChefHat className="w-16 h-16 text-primary-400" />
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <h3 className="font-semibold text-lg leading-tight text-text-primary line-clamp-2 group-hover:text-primary-600 transition-colors">
              {recipe.name}
            </h3>

            {/* Headline */}
            <p className="text-sm text-text-secondary line-clamp-2">
              {recipe.headline}
            </p>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Cooking time */}
              <div className="flex items-center gap-1 text-text-secondary text-sm">
                <IconClock className="w-4 h-4" />
                <span>{formatTime(recipe.time_minutes)}</span>
              </div>

              {/* Difficulty */}
              <Badge className={getDifficultyColor(recipe.difficulty)}>
                {getDifficultyLabel(recipe.difficulty)}
              </Badge>

              {/* Calories */}
              <div className="flex items-center gap-1 text-text-secondary text-sm ml-auto">
                <IconFlame className="w-4 h-4 text-primary-500" />
                <span>{Math.round(recipe.nutrition_energy_kcal)} kcal</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
