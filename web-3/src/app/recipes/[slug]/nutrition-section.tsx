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
}

interface NutritionItem {
  label: string
  value: string
  subLabel?: string
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
}: NutritionSectionProps) {
  const nutritionItems: NutritionItem[] = [
    {
      label: "Energía",
      value: `${Math.round(energyKcal)} kcal`,
      subLabel: `${Math.round(energyKj)} kJ`,
    },
    {
      label: "Grasas",
      value: `${fat} g`,
      subLabel: `saturadas: ${fatSaturated} g`,
    },
    {
      label: "Carbohidratos",
      value: `${carbs} g`,
      subLabel: `azúcares: ${carbsSugar} g`,
    },
    {
      label: "Fibra",
      value: `${fiber} g`,
    },
    {
      label: "Proteínas",
      value: `${protein} g`,
    },
    {
      label: "Sodio",
      value: `${sodium} mg`,
    },
  ]

  return (
    <CollapsibleSection
      title="Información nutricional"
      icon={<IconFlame className="w-5 h-5" />}
      defaultOpen={false}
    >
      <p className="text-sm text-text-secondary mb-4">Por 100g:</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {nutritionItems.map((item) => (
          <div key={item.label} className="p-4 rounded-xl text-center bg-white/50">
            <div className="text-2xl font-bold text-text-primary">{item.value}</div>
            <div className="text-sm font-medium text-text-secondary mt-1">{item.label}</div>
            {item.subLabel && (
              <div className="text-xs text-text-muted mt-1">{item.subLabel}</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-3 p-4 bg-gray-50 rounded-xl dark:bg-slate-800/50">
        <IconInfoCircle className="w-5 h-5 text-text-secondary shrink-0 mt-0.5" />
        <p className="text-sm text-text-secondary">
          La información nutricional es aproximada y puede variar según los
          productos exactos que uses.
        </p>
      </div>
    </CollapsibleSection>
  )
}
