import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  IconArrowLeft,
  IconClock,
  IconFlame,
  IconChefHat,
} from "@tabler/icons-react"
import {
  getRecipes,
  getRecipeBySlug,
  getDifficultyLabel,
  getDifficultyColor,
  formatTime,
} from "@/lib/api"
import { Badge } from "@/components/ui/Badge"
import RecipeActions from "@/components/RecipeActions"
import CookModeButton from "@/components/CookModeButton"
import RecipeTimer from "@/components/RecipeTimer"
import { IngredientsSection } from "./ingredients-section"
import { AllergensSection } from "./allergens-section"
import { UtensilsSection } from "./utensils-section"
import { StepsSection } from "./steps-section"
import { NutritionSection } from "./nutrition-section"
import { RelatedSection } from "./related-section"
import type { Metadata } from "next"
import type { AllergenEntry } from "@/lib/types"

interface RecipePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const data = await getRecipes({ limit: 100, page: 1 })
    return data.data.map((r) => ({ slug: r.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const { data: recipe } = await getRecipeBySlug(slug)
    return {
      title: `${recipe.name} | Simple Eats`,
      description: recipe.headline,
      openGraph: {
        title: recipe.name,
        description: recipe.headline,
        type: "article",
        ...(recipe.image_url && {
          images: [{ url: recipe.image_url, alt: recipe.name }],
        }),
      },
      twitter: {
        card: recipe.image_url ? "summary_large_image" : "summary",
        title: recipe.name,
        description: recipe.headline,
        ...(recipe.image_url && { images: [recipe.image_url] }),
      },
    }
  } catch {
    return {
      title: "Receta no encontrada | Simple Eats",
    }
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params

  let recipe
  try {
    const response = await getRecipeBySlug(slug)
    recipe = response.data
  } catch {
    notFound()
  }

  // Collect all unique allergens from ingredients
  const allAllergens = new Map<
    string,
    {
      name: string
      slug: string
      ingredients: { name: string; traces_of: boolean }[]
    }
  >()

  recipe.ingredients.forEach((ingredient) => {
    ingredient.allergens.forEach((allergen) => {
      const existing = allAllergens.get(allergen.id)
      if (existing) {
        existing.ingredients.push({
          name: ingredient.name,
          traces_of: allergen.traces_of,
        })
      } else {
        allAllergens.set(allergen.id, {
          name: allergen.name,
          slug: allergen.slug,
          ingredients: [
            { name: ingredient.name, traces_of: allergen.traces_of },
          ],
        })
      }
    })
  })

  const allergenList: AllergenEntry[] = Array.from(
    allAllergens,
    ([id, data]) => ({ id, ...data }),
  )

  // Separate pantry and regular ingredients
  const regularIngredients = recipe.ingredients.filter(
    (ing) => !ing.is_pantry_ingredient,
  )
  const pantryIngredients = recipe.ingredients.filter(
    (ing) => ing.is_pantry_ingredient,
  )

  return (
    <main className="min-h-screen">
      {/* Back link */}
      <Link
        href="/recipes"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-slate-100 mb-4"
      >
        <IconArrowLeft className="w-4 h-4" />
        Todas las recetas
      </Link>

      {/* Hero section */}
      <section className="relative">
        {/* Recipe image */}
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-112">
          {recipe.image_url ? (
            <Image
              src={recipe.image_url}
              alt={recipe.name}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-primary-200 to-primary-300 flex items-center justify-center">
              <IconChefHat className="w-24 h-24 text-primary-400" />
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Recipe info overlay */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-32 sm:-mt-40 glass-frost rounded-2xl p-6 md:p-8 space-y-4">
            {/* Tags and cuisines — clickable links to filter gallery */}
            <div className="flex flex-wrap gap-2">
              {recipe.cuisines.map((cuisine) => (
                <Link key={cuisine.id} href={`/recipes?cuisine=${cuisine.slug}`}>
                  <Badge variant="default" className="transition hover:opacity-80 cursor-pointer">
                    {cuisine.name}
                  </Badge>
                </Link>
              ))}
              {recipe.tags.map((tag) => (
                <Link key={tag.id} href={`/recipes?tag=${tag.slug}`}>
                  <Badge variant="secondary" className="transition hover:opacity-80 cursor-pointer">
                    {tag.name}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary text-balance">
              <span>{recipe.name}</span>{" "}
              <span className="text-text-secondary">{recipe.headline}</span>
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-text-primary">
                <IconClock className="w-5 h-5 text-primary-500" />
                <span className="font-medium">
                  {formatTime(recipe.time_minutes)}
                </span>
              </div>

              <Badge
                className={`${getDifficultyColor(recipe.difficulty)} text-sm px-3 py-1`}
              >
                {getDifficultyLabel(recipe.difficulty)}
              </Badge>

              <div className="flex items-center gap-2 text-text-primary">
                <IconFlame className="w-5 h-5 text-primary-500" />
                <span className="font-medium">
                  {Math.round(recipe.nutrition_energy_kcal)} kcal
                </span>
              </div>
            </div>

            {/* Timer */}
            <div className="pt-1">
              <RecipeTimer totalMinutes={recipe.time_minutes} />
            </div>

            {/* Description */}
            {recipe.description && (
              <p className="text-text-secondary pt-2 border-t border-gray-200">
                {recipe.description}
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <RecipeActions title={recipe.name} />
              <CookModeButton />
            </div>
          </div>
        </div>
      </section>

      {/* Content sections */}
      <div className="container mx-auto px-4 mt-8 space-y-8">
        {/* Ingredients */}
        <IngredientsSection
          recipeId={recipe.id}
          regularIngredients={regularIngredients}
          pantryIngredients={pantryIngredients}
          allAllergens={allergenList}
        />

        {/* Steps */}
        <StepsSection recipeId={recipe.id} steps={recipe.steps} />

        {/* Nutrition */}
        <NutritionSection
          energyKj={recipe.nutrition_energy_kj}
          energyKcal={recipe.nutrition_energy_kcal}
          fat={recipe.nutrition_fat}
          fatSaturated={recipe.nutrition_fat_saturated}
          carbs={recipe.nutrition_carbs}
          carbsSugar={recipe.nutrition_carbs_sugar}
          fiber={recipe.nutrition_fiber}
          protein={recipe.nutrition_protein}
          sodium={recipe.nutrition_sodium}
        />

        {/* Utensils */}
        {recipe.utensils.length > 0 && (
          <UtensilsSection utensils={recipe.utensils} />
        )}

        {/* Allergens */}
        {allergenList.length > 0 && <AllergensSection allergens={allergenList} />}

        {/* Related recipes */}
        <RelatedSection
          currentId={recipe.id}
          cuisines={recipe.cuisines}
          tags={recipe.tags}
        />
      </div>
    </main>
  )
}
