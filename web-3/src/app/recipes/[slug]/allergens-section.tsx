"use client"
import { Card } from "@/components/ui/Card"
import { IconAlertTriangle } from "@tabler/icons-react"

interface AllergensSectionProps {
  allergens: Map<
    string,
    {
      name: string
      slug: string
      ingredients: { name: string; traces_of: boolean }[]
    }
  >
}

export function AllergensSection({ allergens }: AllergensSectionProps) {
  const allergenArray = Array.from(allergens.entries())

  return (
    <section>
      <Card className="p-6">
        <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
          <IconAlertTriangle className="w-5 h-5 text-yellow-500" />
          Alérgenos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {allergenArray.map(([id, allergen], index) => {
            const containsIngredients = allergen.ingredients.filter(
              (i) => !i.traces_of,
            )
            const tracesIngredients = allergen.ingredients.filter(
              (i) => i.traces_of,
            )

            return (
              // <motion.div
              //   key={id}
              //   id={`allergen-${id}`}
              //   initial={{ opacity: 0, x: -10 }}
              //   animate={{ opacity: 1, x: 0 }}
              //   transition={{ duration: 0.3, delay: index * 0.05 }}
              //   className="flex items-start gap-3 p-3 rounded-xl bg-white/50 transition-colors"
              // >
              <div
                key={id}
                id={`allergen-${id}`}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/50 transition-colors"
              >
                {/* Number badge */}
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 font-bold text-sm flex items-center justify-center shrink-0 border border-red-200">
                  {index + 1}
                </div>

                {/* Allergen info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">
                    {allergen.name}
                  </h3>
                  <div className="text-sm text-text-secondary mt-1 space-y-1">
                    {containsIngredients.length > 0 && (
                      <p>
                        <span className="text-red-600 font-medium">
                          Contiene:
                        </span>{" "}
                        {containsIngredients.map((i) => i.name).join(", ")}
                      </p>
                    )}
                    {tracesIngredients.length > 0 && (
                      <p>
                        <span className="text-yellow-600 font-medium">
                          Puede contener trazas:
                        </span>{" "}
                        {tracesIngredients.map((i) => i.name).join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                {/* </motion.div> */}
              </div>
            )
          })}
        </div>
      </Card>
    </section>
  )
}
