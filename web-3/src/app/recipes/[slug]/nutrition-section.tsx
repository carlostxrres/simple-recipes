"use client"

// import { motion } from "framer-motion"
import { IconFlame, IconInfoCircle } from "@tabler/icons-react"
import { Card } from "@/components/ui/Card"

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
  highlight?: boolean
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
      // highlight: true,
    },
    {
      label: "Grasas",
      value: `${fat} g`,
      subLabel: `de las cuales saturadas: ${fatSaturated} g`,
    },
    {
      label: "Carbohidratos",
      value: `${carbs} g`,
      subLabel: `de los cuales azúcares: ${carbsSugar} g`,
    },
    {
      label: "Fibra",
      value: `${fiber} g`,
    },
    {
      label: "Proteínas",
      value: `${protein} g`,
      // highlight: true,
    },
    {
      label: "Sodio",
      value: `${sodium} mg`,
    },
  ]

  return (
    <section>
      <Card className="p-6">
        <h2 className="text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
          <IconFlame className="w-5 h-5 text-primary-500" />
          Información nutricional
        </h2>

        <p className="text-sm text-text-secondary mb-6">Por 100g:</p>

        {/* Nutrition grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {nutritionItems.map((item, index) => (
            // <motion.div
            //   key={item.label}
            //   initial={{ opacity: 0, y: 10 }}
            //   animate={{ opacity: 1, y: 0 }}
            //   transition={{ duration: 0.3, delay: index * 0.05 }}
            //   className={`p-4 rounded-xl text-center ${
            //     item.highlight
            //       ? "bg-primary-50 border border-primary-100"
            //       : "bg-white/50"
            //   }`}
            // >
            <div
              key={item.label}
              className={`p-4 rounded-xl text-center ${
                item.highlight
                  ? "bg-primary-50 border border-primary-100"
                  : "bg-white/50"
              }`}
            >
              <div
                className={`text-2xl font-bold ${
                  item.highlight ? "text-primary-600" : "text-text-primary"
                }`}
              >
                {item.value}
              </div>
              <div className="text-sm font-medium text-text-secondary mt-1">
                {item.label}
              </div>
              {item.subLabel && (
                <div className="text-xs text-text-muted mt-1">
                  {item.subLabel}
                </div>
              )}
              {/* </motion.div> */}
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-6 flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
        > */}
        <div className="mt-6 flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
          <IconInfoCircle className="w-5 h-5 text-text-secondary shrink-0 mt-0.5" />
          <p className="text-sm text-text-secondary">
            La información nutricional por comida es aproximada y puede variar
            dependiendo de los productos exactos que uses.
          </p>
          {/* </motion.div> */}
        </div>
      </Card>
    </section>
  )
}
