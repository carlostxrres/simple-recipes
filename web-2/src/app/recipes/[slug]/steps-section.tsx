"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { IconListNumbers, IconChefHat } from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import type { Step } from "@/lib/types"

interface StepsSectionProps {
  steps: Step[]
}

export function StepsSection({ steps }: StepsSectionProps) {
  return (
    <section>
      <Card className="p-6">
        <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
          <IconListNumbers className="w-5 h-5 text-primary-500" />
          Preparación
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex gap-4"
            >
              {/* Step number. To do: show it on top of the image (next div), at the top-left corner, in a discreet style */}
              {/* <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary-500 text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
                  {step.step_order}
                </div>
              </div> */}

              {/* Step content */}
              <div className="flex-1 space-y-4">
                {/* Step image if available */}
                {step.image_url && (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={step.image_url}
                      alt={`Paso ${step.step_order}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}

                {/* Step instructions */}
                <p className="text-text-primary leading-relaxed">
                  {step.instructions}
                </p>

                {/* Divider (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="border-b border-gray-100 pt-2" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </section>
  )
}
