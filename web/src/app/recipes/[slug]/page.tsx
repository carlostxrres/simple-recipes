/**
 * RECIPE DETAIL PAGE
 *
 * Displays a single recipe with all its details: ingredients, steps, nutrition, etc.
 *
 * The [slug] folder name means this is a dynamic route.
 * For example: /recipes/pasta-carbonara will match this page with slug="pasta-carbonara"
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import {
  getRecipeBySlug,
  getDifficultyLabel,
  RecipeIngredient,
  IngredientAllergen,
} from "@/lib/api"
import { AllergenLink } from "./AllergenLink"

// Build a map of unique allergens with assigned numbers for cross-referencing
function buildAllergenIndex(
  ingredients: RecipeIngredient[],
): Map<string, { number: number; allergen: IngredientAllergen }> {
  const allergenMap = new Map<
    string,
    { number: number; allergen: IngredientAllergen }
  >()
  let nextNumber = 1

  for (const ingredient of ingredients) {
    for (const allergen of ingredient.allergens) {
      if (!allergenMap.has(allergen.id)) {
        allergenMap.set(allergen.id, { number: nextNumber++, allergen })
      }
    }
  }

  return allergenMap
}

// Get allergen numbers for a specific ingredient
function getAllergenNumbers(
  ingredient: RecipeIngredient,
  allergenIndex: Map<string, { number: number; allergen: IngredientAllergen }>,
): number[] {
  return ingredient.allergens
    .map((a) => allergenIndex.get(a.id)!.number)
    .sort((a, b) => a - b)
}

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const recipe = await getRecipeBySlug(slug)

  if (!recipe) {
    return { title: "Receta no encontrada" }
  }

  return {
    title: `${recipe.name} | Recetas`,
    description: recipe.description,
  }
}

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params
  const recipe = await getRecipeBySlug(slug)

  // If recipe not found, show 404 page
  if (!recipe) {
    notFound()
  }

  // Build allergen cross-reference index
  const allergenIndex = buildAllergenIndex(recipe.ingredients)
  const sortedAllergens = Array.from(allergenIndex.values()).sort(
    (a, b) => a.number - b.number,
  )

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Back link */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          ← Volver a recetas
        </Link>
      </div>

      {/* Recipe Image */}
      {recipe.image_url && (
        <div className="max-w-4xl mx-auto px-4">
          <img
            src={recipe.image_url}
            alt={recipe.name}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Recipe Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Cuisines & Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.cuisines.map((cuisine) => (
              <Link
                key={cuisine.id}
                href={`/?cuisine=${cuisine.slug}`}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200"
              >
                {cuisine.name}
              </Link>
            ))}
            {recipe.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/?tag=${tag.slug}`}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm hover:bg-green-200"
              >
                {tag.name}
              </Link>
            ))}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {recipe.name}
          </h1>
          <p className="text-xl text-gray-600 mb-4">{recipe.headline}</p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <span className="flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              {recipe.time_minutes} minutos
            </span>
            <span className="flex items-center gap-2">
              <span className="text-2xl">👨‍🍳</span>
              {getDifficultyLabel(recipe.difficulty)}
            </span>
            <span className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              {recipe.nutrition_energy_kcal} kcal
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Description */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="text-gray-700 leading-relaxed">{recipe.description}</p>
        </section>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Ingredients (sidebar) */}
          <aside className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Ingredientes
              </h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient) => {
                  const allergenNumbers = getAllergenNumbers(
                    ingredient,
                    allergenIndex,
                  )
                  return (
                    <li
                      key={ingredient.ingredient_id}
                      className="flex justify-between items-center border-b border-gray-100 pb-2"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://xwpzmtcjxfyncnltgnmc.supabase.co/storage/v1/object/public/images/ingredients/${ingredient.slug}.png`}
                          alt={ingredient.name}
                          className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                        />
                        <span className="text-gray-700">
                          {ingredient.name}
                          {allergenNumbers.length > 0 && (
                            <span className="text-sm ml-1">
                              {allergenNumbers.map((n) => (
                                <AllergenLink key={n} number={n}>
                                  ({n})
                                </AllergenLink>
                              ))}
                            </span>
                          )}
                        </span>
                      </div>
                      {ingredient.quantity_amount && (
                        <span className="text-gray-500 text-sm ml-2 whitespace-nowrap">
                          {ingredient.quantity_amount}{" "}
                          {ingredient.quantity_unit}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>

              {/* Allergens */}
              {sortedAllergens.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    Alérgenos
                  </h3>
                  <ul className="space-y-1">
                    {sortedAllergens.map(({ number, allergen }) => (
                      <li
                        key={allergen.id}
                        id={`allergen-${number}`}
                        className="allergen-item text-gray-600 text-sm scroll-mt-4 rounded px-1 -mx-1"
                      >
                        <span className="text-orange-600 font-medium">
                          ({number})
                        </span>{" "}
                        {allergen.name}
                        {allergen.traces_of && (
                          <span className="text-gray-400 italic ml-1">
                            (trazas)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Utensils */}
              {recipe.utensils.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    Utensilios
                  </h3>
                  <ul className="space-y-2">
                    {recipe.utensils.map((utensil) => (
                      <li key={utensil.id} className="text-gray-600 text-sm">
                        • {utensil.name}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </aside>

          {/* Steps (main content) */}
          <section className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Preparación
            </h2>
            <ol className="space-y-6">
              {recipe.steps.map((step) => (
                <li
                  key={step.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  {step.image_url && (
                    <img
                      src={step.image_url}
                      alt={`Paso ${step.step_order}`}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                        {step.step_order}
                      </span>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {step.instructions}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Nutrition Info */}
        <section className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Información Nutricional
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <NutritionCard
              label="Energía"
              value={`${recipe.nutrition_energy_kcal} kcal`}
            />
            <NutritionCard
              label="Proteínas"
              value={`${recipe.nutrition_protein}g`}
            />
            <NutritionCard
              label="Carbohidratos"
              value={`${recipe.nutrition_carbs}g`}
            />
            <NutritionCard label="Grasas" value={`${recipe.nutrition_fat}g`} />
            <NutritionCard
              label="Grasas saturadas"
              value={`${recipe.nutrition_fat_saturated}g`}
            />
            <NutritionCard
              label="Azúcares"
              value={`${recipe.nutrition_carbs_sugar}g`}
            />
            <NutritionCard label="Fibra" value={`${recipe.nutrition_fiber}g`} />
            <NutritionCard
              label="Sodio"
              value={`${recipe.nutrition_sodium}g`}
            />
          </div>
        </section>
      </div>
    </main>
  )
}

function NutritionCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  )
}
