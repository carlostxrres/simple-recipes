"use client"

import { useState } from "react"
import Image from "next/image"
import {
  IconUsers,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { formatQuantity } from "@/lib/api"
import type { RecipeIngredient, AllergenEntry } from "@/lib/types"

interface AllergenBadge {
  id: string
  index: number
  tracesOf: boolean
}

interface IngredientItemProps {
  ingredient: RecipeIngredient
  servings: number
  allergenBadges: AllergenBadge[]
  onAllergenClick: (id: string) => void
}

function IngredientItem({ ingredient, servings, allergenBadges, onAllergenClick }: IngredientItemProps) {
  const [visible, setVisible] = useState(true)

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/50 hover:bg-white/80 transition-colors">
      {visible && (
        <div className="relative w-8 h-8 overflow-visible shrink-0">
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/ingredients/${ingredient.slug}.png`}
            alt=""
            width={48}
            height={48}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-110 max-w-15 max-h-15 object-contain rotate-6 drop-shadow-lg/50"
            onError={() => setVisible(false)}
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <span className="font-medium text-text-primary truncate">
            {ingredient.name}
          </span>
          {allergenBadges.length > 0 && (
            <div className="flex gap-1 shrink-0">
              {allergenBadges.map((badge) => (
                <button
                  key={badge.id}
                  onClick={() => onAllergenClick(badge.id)}
                  className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center transition-transform hover:scale-110 ${
                    badge.tracesOf
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                      : "bg-red-100 text-red-700 border border-red-300"
                  }`}
                  title={badge.tracesOf ? "Puede contener trazas" : "Contiene"}
                >
                  {badge.index}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="text-sm text-text-secondary">
          {formatQuantity(ingredient.quantity_amount, ingredient.quantity_unit, servings)}
        </span>
      </div>
    </div>
  )
}

interface IngredientsSectionProps {
  regularIngredients: RecipeIngredient[]
  pantryIngredients: RecipeIngredient[]
  allAllergens: AllergenEntry[]
}

export function IngredientsSection({
  regularIngredients,
  pantryIngredients,
  allAllergens,
}: IngredientsSectionProps) {
  const [servings, setServings] = useState(2)

  const decreaseServings = () => {
    if (servings > 1) setServings(servings - 1)
  }

  const increaseServings = () => {
    if (servings < 6) setServings(servings + 1)
  }

  const getAllergenBadges = (ingredient: RecipeIngredient): AllergenBadge[] =>
    ingredient.allergens.flatMap((allergen) => {
      const index = allAllergens.findIndex((a) => a.id === allergen.id)
      return index !== -1
        ? [{ id: allergen.id, index: index + 1, tracesOf: allergen.traces_of }]
        : []
    })

  const scrollToAllergen = (allergenId: string) => {
    const element = document.getElementById(`allergen-${allergenId}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
      element.classList.add("allergen-highlight")
      setTimeout(() => element.classList.remove("allergen-highlight"), 1500)
    }
  }

  return (
    <section>
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-text-primary">Ingredientes</h2>

          <div className="flex items-center gap-3 glass-light rounded-xl p-2">
            <IconUsers className="w-5 h-5 text-text-secondary" />
            <span className="text-sm text-text-secondary">Raciones:</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon-sm" onClick={decreaseServings} disabled={servings <= 1}>
                <IconMinus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center font-semibold text-lg">{servings}</span>
              <Button variant="ghost" size="icon-sm" onClick={increaseServings} disabled={servings >= 6}>
                <IconPlus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {regularIngredients.map((ingredient) => (
            <IngredientItem
              key={ingredient.ingredient_id}
              ingredient={ingredient}
              servings={servings}
              allergenBadges={getAllergenBadges(ingredient)}
              onAllergenClick={scrollToAllergen}
            />
          ))}
        </div>

        {pantryIngredients.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary-300 rounded-full" />
              De tu despensa
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {pantryIngredients.map((ingredient) => (
                <IngredientItem
                  key={ingredient.ingredient_id}
                  ingredient={ingredient}
                  servings={servings}
                  allergenBadges={getAllergenBadges(ingredient)}
                  onAllergenClick={scrollToAllergen}
                />
              ))}
            </div>
          </div>
        )}
      </Card>
    </section>
  )
}
