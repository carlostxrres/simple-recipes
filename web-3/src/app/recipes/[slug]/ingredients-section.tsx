"use client"

import { useState } from "react"
import Image from "next/image"
import {
  IconUsers,
  IconMinus,
  IconPlus,
  IconAlertTriangle,
  IconCheck,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { formatQuantity } from "@/lib/api"
import type { RecipeIngredient, AllergenEntry } from "@/lib/types"

// ─── Types ───────────────────────────────────────────────────────────────────

interface AllergenBadge {
  id: string
  index: number
  tracesOf: boolean
}

// ─── AllergenBadges ──────────────────────────────────────────────────────────
// ≤2 badges → inline row.  ≥3 → collapsed pill; tap expands below the row.

const STACK_THRESHOLD = 3

function BadgeButton({
  badge,
  onClick,
}: {
  badge: AllergenBadge
  onClick: (id: string) => void
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick(badge.id)
      }}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-transform hover:scale-110 ${
        badge.tracesOf
          ? "border-yellow-300 bg-yellow-100 text-yellow-700"
          : "border-red-300 bg-red-100 text-red-700"
      }`}
      title={badge.tracesOf ? "Puede contener trazas" : "Contiene"}
    >
      {badge.index}
    </button>
  )
}

function AllergenBadges({
  badges,
  onAllergenClick,
}: {
  badges: AllergenBadge[]
  onAllergenClick: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)

  if (badges.length === 0) return null

  if (badges.length < STACK_THRESHOLD) {
    return (
      <div className="flex shrink-0 gap-1">
        {badges.map((b) => (
          <BadgeButton key={b.id} badge={b} onClick={onAllergenClick} />
        ))}
      </div>
    )
  }

  // Collapsed pill
  if (!expanded) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          setExpanded(true)
        }}
        className="inline-flex shrink-0 items-center gap-1 rounded-full border border-orange-300 bg-orange-100 px-1.5 py-0.5 text-[11px] font-semibold text-orange-700 transition hover:bg-orange-200"
        title="Ver alérgenos"
      >
        <IconAlertTriangle className="h-3 w-3" />
        {badges.length}
      </button>
    )
  }

  // Expanded: inline row with a collapse button
  return (
    <div
      className="flex shrink-0 flex-wrap items-center gap-1"
      onClick={(e) => e.stopPropagation()}
    >
      {badges.map((b) => (
        <BadgeButton key={b.id} badge={b} onClick={onAllergenClick} />
      ))}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setExpanded(false)
        }}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-slate-500 transition hover:bg-slate-200"
        title="Colapsar"
        aria-label="Colapsar alérgenos"
      >
        ×
      </button>
    </div>
  )
}

// ─── IngredientItem ───────────────────────────────────────────────────────────

interface IngredientItemProps {
  ingredient: RecipeIngredient
  servings: number
  allergenBadges: AllergenBadge[]
  onAllergenClick: (id: string) => void
  checked: boolean
  onToggle: () => void
}

function IngredientItem({
  ingredient,
  servings,
  allergenBadges,
  onAllergenClick,
  checked,
  onToggle,
}: IngredientItemProps) {
  const [imgVisible, setImgVisible] = useState(true)

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && onToggle()}
      className={`flex cursor-pointer select-none items-center gap-4 rounded-xl p-4 transition-all duration-200 ${
        checked
          ? "bg-slate-100/70 opacity-50 dark:bg-slate-800/40"
          : "bg-white/50 hover:bg-white/80"
      }`}
    >
      {/* Ingredient image */}
      {imgVisible && !checked && (
        <div className="relative h-8 w-8 shrink-0 overflow-visible">
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://xwpzmtcjxfyncnltgnmc.supabase.co"}/storage/v1/object/public/images/ingredients/${ingredient.slug}.png`}
            alt=""
            width={48}
            height={48}
            className="absolute left-1/2 top-1/2 max-h-15 max-w-15 -translate-x-1/2 -translate-y-1/2 scale-110 rotate-6 object-contain drop-shadow-lg/50"
            onError={() => setImgVisible(false)}
          />
        </div>
      )}

      {/* Checkmark replaces image when checked */}
      {checked && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-300/60 text-slate-500">
          <IconCheck className="h-4 w-4" />
        </span>
      )}

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <span
            className={`font-medium text-text-primary truncate transition-all ${
              checked ? "line-through text-slate-400" : ""
            }`}
          >
            {ingredient.name}
          </span>
          <AllergenBadges badges={allergenBadges} onAllergenClick={onAllergenClick} />
        </div>
        <span className={`text-sm transition-all ${checked ? "text-slate-400" : "text-text-secondary"}`}>
          {formatQuantity(ingredient.quantity_amount, ingredient.quantity_unit, servings)}
        </span>
      </div>
    </div>
  )
}

// ─── IngredientsSection ───────────────────────────────────────────────────────

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
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())

  function toggleChecked(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Unchecked items first (original order), checked items last (original order)
  function sorted(list: RecipeIngredient[]): RecipeIngredient[] {
    return [
      ...list.filter((i) => !checkedIds.has(i.ingredient_id)),
      ...list.filter((i) => checkedIds.has(i.ingredient_id)),
    ]
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

  function renderGrid(list: RecipeIngredient[]) {
    return sorted(list).map((ingredient) => (
      <IngredientItem
        key={ingredient.ingredient_id}
        ingredient={ingredient}
        servings={servings}
        allergenBadges={getAllergenBadges(ingredient)}
        onAllergenClick={scrollToAllergen}
        checked={checkedIds.has(ingredient.ingredient_id)}
        onToggle={() => toggleChecked(ingredient.ingredient_id)}
      />
    ))
  }

  const totalChecked = checkedIds.size
  const totalIngredients = regularIngredients.length + pantryIngredients.length

  return (
    <section>
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-baseline gap-3">
            <h2 className="text-xl font-bold text-text-primary">Ingredientes</h2>
            {totalChecked > 0 && (
              <span className="text-sm text-slate-400">
                {totalChecked}/{totalIngredients}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 glass-light rounded-xl p-2">
            <IconUsers className="w-5 h-5 text-text-secondary" />
            <span className="text-sm text-text-secondary">Raciones:</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon-sm" onClick={() => setServings((s) => Math.max(1, s - 1))} disabled={servings <= 1}>
                <IconMinus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center font-semibold text-lg">{servings}</span>
              <Button variant="ghost" size="icon-sm" onClick={() => setServings((s) => Math.min(6, s + 1))} disabled={servings >= 6}>
                <IconPlus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {renderGrid(regularIngredients)}
        </div>

        {pantryIngredients.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary-300 rounded-full" />
              De tu despensa
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {renderGrid(pantryIngredients)}
            </div>
          </div>
        )}
      </Card>
    </section>
  )
}
