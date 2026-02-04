import { Badge } from "./ui/Badge"
import { formatTime, getDifficultyLabel, getDifficultyColor } from "../lib/api"
import { IconClock, IconFlame, IconChefHat } from "@tabler/icons-react"
import type { Recipe } from "../lib/types"
import Link from "next/link"
import Image from "next/image"

interface RecipeCardProps {
  recipe: Recipe
  index?: number
}

// id: string;
// slug: string;
// is_active: boolean;
// created_at: string;
// last_updated_at: string;
// name: string;
// headline: string;
// description: string;
// has_image: boolean;
// image_url: string | null;
// time_minutes: number;
// difficulty: "1" | "2" | "3";
// nutrition_energy_kj: number;
// nutrition_energy_kcal: number;
// nutrition_fat: number;
// nutrition_fat_saturated: number;
// nutrition_carbs: number;
// nutrition_carbs_sugar: number;
// nutrition_fiber: number;
// nutrition_protein: number;
// nutrition_sodium: number;

export default function ({ recipe, index = 0 }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <article className="recipe-card glass-frost rounded-2xl overflow-hidden group cursor-pointer dispersion border border-white/90">
        {/* sm:hover:-translate-y-1 transition-transform duration-150  */}
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
        </div>

        {/* Content */}
        <div className="p-4 pointer-events-none  text-slate-900">
          {/* Title and Headline */}
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary-600 transition-colors">
            <span>{recipe.name}</span>{" "}
            <span className="text-text-secondary">{recipe.headline}</span>
          </h3>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-2 pt-1 mt-3">
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
  )
  //   return (
  //     <article className="group relative overflow-hidden rounded-3xl bg-white shadow-[0_14px_44px_rgba(15,23,42,0.08)] transition-transform duration-300 dark:bg-slate-900/70 dark:shadow-[0_18px_50px_rgba(2,6,23,0.55)] sm:rounded-4xl sm:border sm:border-slate-200/70 sm:hover:-translate-y-1 dark:sm:border-slate-700/70 md:row-span-1 aspect-4/5 md:aspect-auto">
  //       <div className="absolute inset-0">
  //         <img
  //           decoding="async"
  //           data-nimg="fill"
  //           className="h-full w-full object-cover"
  //           style={{
  //             position: "absolute",
  //             height: "100%",
  //             width: "100%",
  //             left: 0,
  //             top: 0,
  //             right: 0,
  //             bottom: 0,
  //             color: "transparent",
  //           }}
  //           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  //           src={recipe.image_url}
  //           alt={recipe.name}
  //         />
  //         {/* <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-slate-900/10 to-transparent transition-opacity duration-300 group-hover:from-slate-900/80"></div> */}
  //       </div>
  //       <Link
  //         href={`/recipes/${recipe.slug}`}
  //         className="absolute inset-0 z-20"
  //         aria-label={`View details for ${recipe.name}`}
  //       >
  //         <span className="sr-only">View details for {recipe.name}</span>
  //       </Link>

  //       {/* Like count / button */}
  //       {/* <div className="pointer-events-auto absolute right-6 top-6 z-30">
  //         <div className="group relative">
  //           <button
  //             type="button"
  //             translate="no"
  //             aria-pressed="false"
  //             className="inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-black/20 text-white hover:bg-black/30 focus:ring-white/50 backdrop-blur-sm px-2 py-1 text-xs"
  //             aria-label="Like this prompt"
  //           >
  //             <svg
  //               className="pointer-events-none h-3 w-3"
  //               fill="none"
  //               stroke="currentColor"
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               strokeWidth="1.8"
  //               viewBox="0 0 24 24"
  //               aria-hidden="true"
  //             >
  //               <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
  //             </svg>
  //             <span className="pointer-events-none tabular-nums">1.3k</span>
  //           </button>
  //           <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-100 dark:text-slate-900">
  //             Like
  //           </span>
  //         </div>
  //       </div> */}

  //       <div className="pointer-events-none relative z-30 flex h-full flex-col gap-6 p-6">
  //         {/* Main pill */}
  //         {/* <div className="flex flex-col gap-3 text-sm font-medium text-white/80">
  //           <div className="flex min-w-0 flex-wrap items-center gap-2 pr-16">
  //             <span className="pointer-events-none inline-flex max-w-full shrink items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
  //               <span className="truncate">{recipe.name}</span>
  //             </span>
  //           </div>
  //         </div> */}

  //         <div className="mt-auto flex flex-col gap-4 pointer-events-none">
  //           {/* Description */}
  //           {/* <p
  //             className="text-[15px] leading-relaxed text-white/85"
  //             title="Dramatic, ultra-realistic close-up in black and white with high-contrast cinematic lighting from the side, highlighting the contours of his face and beard, casting deep shadows. He wears round, reflective sunglasses. He gazes confidently upward into a dark void. The sunglasses reflect a city's towering skyline. The atmosphere is mysterious with a minimalist black background. Details in 4K. Keep the subject's exact facial structure, hair texture, the original photo."
  //           >
  //             Dramatic, ultra-realistic close-up in black and white with
  //             high-contrast cinematic lighting from the side, highlighting the
  //             contours of his face an...
  //           </p> */}

  //           {/*  */}
  //           <div className="flex flex-wrap items-center gap-3 text-xs text-white/65 sm:text-sm">
  //             <span className="ml-auto text-xs text-white/70 sm:text-sm">
  //               by{" "}
  //               <a
  //                 className="pointer-events-auto underline hover:text-white/90 transition-colors"
  //                 href="/creator/18973a18-e495-4d7c-b8aa-a7fc55767459"
  //               >
  //                 @tariqHasanSyed
  //               </a>
  //             </span>
  //           </div>
  //         </div>
  //       </div>
  //     </article>
  //   )
}
