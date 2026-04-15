"use client"

import Image from "next/image"
import { IconListNumbers, IconCheck } from "@tabler/icons-react"
import CollapsibleSection from "@/components/CollapsibleSection"
import { usePersistedSet } from "@/hooks/usePersistedSet"
import type { Step } from "@/lib/types"

interface StepsSectionProps {
  recipeId: string
  steps: Step[]
}

export function StepsSection({ recipeId, steps }: StepsSectionProps) {
  const { ids: checkedIds, toggle, clear } = usePersistedSet(`recipe-steps-${recipeId}`)

  const completedCount = checkedIds.size

  const title = (
    <>
      Preparación
      {completedCount > 0 && (
        <span className="text-sm font-normal text-slate-400">
          {completedCount}/{steps.length}
        </span>
      )}
    </>
  )

  return (
    <CollapsibleSection title={title} icon={<IconListNumbers className="w-5 h-5" />}>
      {completedCount > 0 && (
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={clear}
            className="text-sm text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
          >
            Reiniciar pasos
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {steps.map((step, index) => {
          const isChecked = checkedIds.has(step.id)
          return (
            <div
              key={step.id}
              role="checkbox"
              aria-checked={isChecked}
              tabIndex={0}
              onClick={() => toggle(step.id)}
              onKeyDown={(e) => (e.key === " " || e.key === "Enter") && toggle(step.id)}
              className={`flex gap-4 cursor-pointer select-none rounded-xl p-3 -m-3 transition-all duration-200 ${
                isChecked ? "opacity-50" : "hover:bg-white/40 dark:hover:bg-white/5"
              }`}
            >
              <div className="flex-1 space-y-3">
                {step.image_url ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={step.image_url}
                      alt={`Paso ${step.step_order}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div
                      className={`absolute z-1 top-1 left-1 rounded-lg px-3 py-1 text-xs uppercase backdrop-blur-sm flex items-center gap-1.5 transition-colors ${
                        isChecked
                          ? "bg-green-600/80 text-white"
                          : "bg-black/40 text-white/80"
                      }`}
                    >
                      {isChecked && <IconCheck className="w-3 h-3 shrink-0" />}
                      <span>{index + 1}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all ${
                        isChecked
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {isChecked ? (
                        <IconCheck className="h-3.5 w-3.5" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span
                      className={`font-semibold transition-colors ${
                        isChecked ? "text-slate-400" : "text-text-primary"
                      }`}
                    >
                      Paso {index + 1}
                    </span>
                  </div>
                )}

                <p
                  className={`leading-relaxed transition-colors ${
                    isChecked ? "text-slate-400" : "text-text-primary"
                  }`}
                >
                  {step.instructions}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </CollapsibleSection>
  )
}
