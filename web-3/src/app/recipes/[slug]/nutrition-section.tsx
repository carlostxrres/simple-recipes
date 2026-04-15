"use client"

import { useState } from "react"
import { IconFlame, IconInfoCircle } from "@tabler/icons-react"
import CollapsibleSection from "@/components/CollapsibleSection"

interface NutritionSectionProps {
  energyKj: number
  energyKcal: number
  fat: number
  fatSaturated: number
  carbs: number
  carbsSugar: number
  fiber: number
  protein: number
  sodium: number
  /** Gram weight of one serving, used for per-serving calculation */
  servingGrams?: number
}

interface NutritionItem {
  label: string
  valuePer100g: number
  unit: string
  subLabelKey?: string
  subValuePer100g?: number
  subUnit?: string
}

export function NutritionSection({
  energyKj,
  energyKcal,
  fat,
  fatSaturated,
  carbs,
  carbsSugar,
  fiber,
  protein,
  sodium,
  servingGrams = 300,
}: NutritionSectionProps) {
  const [perServing, setPerServing] = useState(false)

  const scale = perServing ? servingGrams / 100 : 1

  function fmt(val: number, unit: string): string {
    const v = val * scale
    const rounded = unit === "kcal" || unit === "kJ"
      ? Math.round(v)
      : Math.round(v * 10) / 10
    return `${rounded} ${unit}`
  }

  const nutritionItems: NutritionItem[] = [
    { label: "Energía", valuePer100g: energyKcal, unit: "kcal",
      subLabelKey: "kJ", subValuePer100g: energyKj, subUnit: "kJ" },
    { label: "Grasas", valuePer100g: fat, unit: "g",
      subLabelKey: "saturadas", subValuePer100g: fatSaturated, subUnit: "g" },
    { label: "Carbohidratos", valuePer100g: carbs, unit: "g",
      subLabelKey: "azúcares", subValuePer100g: carbsSugar, subUnit: "g" },
    { label: "Fibra", valuePer100g: fiber, unit: "g" },
    { label: "Proteínas", valuePer100g: protein, unit: "g" },
    { label: "Sodio", valuePer100g: sodium, unit: "mg" },
  ]

  return (
    <CollapsibleSection
      title="Información nutricional"
      icon={<IconFlame className="w-5 h-5" />}
      defaultOpen={false}
    >
      {/* Per 100g / Per serving toggle */}
      <div className="mb-4 flex items-center gap-1 rounded-lg border border-slate-200 bg-white/50 p-0.5 w-fit dark:border-slate-700 dark:bg-slate-800/50">
        <button
          type="button"
          onClick={() => setPerServing(false)}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
            !perServing
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          Por 100g
        </button>
        <button
          type="button"
          onClick={() => setPerServing(true)}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
            perServing
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          Por ración
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {nutritionItems.map((item) => (
          <div key={item.label} className="p-4 rounded-xl text-center bg-white/50 dark:bg-slate-800/30">
            <div className="text-xl font-bold text-text-primary">
              {fmt(item.valuePer100g, item.unit)}
            </div>
            <div className="text-sm font-medium text-text-secondary mt-1">{item.label}</div>
            {item.subValuePer100g !== undefined && item.subUnit && (
              <div className="text-xs text-text-muted mt-1">
                {item.subLabelKey}: {fmt(item.subValuePer100g, item.subUnit)}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-3 p-4 bg-gray-50 rounded-xl dark:bg-slate-800/50">
        <IconInfoCircle className="w-5 h-5 text-text-secondary shrink-0 mt-0.5" />
        <p className="text-sm text-text-secondary">
          La información nutricional es aproximada y puede variar según los
          productos exactos que uses.{" "}
          {perServing && `Ración estimada: ${servingGrams} g.`}
        </p>
      </div>
    </CollapsibleSection>
  )
}
