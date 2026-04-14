import Image from "next/image"
import { IconListNumbers } from "@tabler/icons-react"
import CollapsibleSection from "@/components/CollapsibleSection"
import type { Step } from "@/lib/types"

interface StepsSectionProps {
  steps: Step[]
}

export function StepsSection({ steps }: StepsSectionProps) {
  return (
    <CollapsibleSection title="Preparación" icon={<IconListNumbers className="w-5 h-5" />}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div className="flex gap-4" key={step.id}>
            <div className="flex-1 space-y-4">
              {step.image_url ? (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={step.image_url}
                    alt={`Paso ${step.step_order}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute z-1 top-1 left-1 rounded-lg px-3 py-1 text-xs uppercase bg-black/40 text-white/80 backdrop-blur-sm">
                    <span className="truncate">{index + 1}</span>
                  </div>
                </div>
              ) : (
                <div className="text-text-primary font-semibold">
                  Paso {index + 1}
                </div>
              )}

              <p className="text-text-primary leading-relaxed">
                {step.instructions}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  )
}
