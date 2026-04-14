import CollapsibleSection from "@/components/CollapsibleSection"
import { IconAlertTriangle } from "@tabler/icons-react"
import type { AllergenEntry } from "@/lib/types"

interface AllergensSectionProps {
  allergens: AllergenEntry[]
}

export function AllergensSection({ allergens }: AllergensSectionProps) {
  return (
    <CollapsibleSection title="Alérgenos" icon={<IconAlertTriangle className="w-5 h-5" />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {allergens.map((allergen, index) => {
          const containsIngredients = allergen.ingredients.filter((i) => !i.traces_of)
          const tracesIngredients = allergen.ingredients.filter((i) => i.traces_of)

          return (
            <div
              key={allergen.id}
              id={`allergen-${allergen.id}`}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/50 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 font-bold text-sm flex items-center justify-center shrink-0 border border-red-200">
                {index + 1}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-text-primary">{allergen.name}</h3>
                <div className="text-sm text-text-secondary mt-1 space-y-1">
                  {containsIngredients.length > 0 && (
                    <p>
                      <span className="text-red-600 font-medium">Contiene:</span>{" "}
                      {containsIngredients.map((i) => i.name).join(", ")}
                    </p>
                  )}
                  {tracesIngredients.length > 0 && (
                    <p>
                      <span className="text-yellow-600 font-medium">Puede contener trazas:</span>{" "}
                      {tracesIngredients.map((i) => i.name).join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </CollapsibleSection>
  )
}
