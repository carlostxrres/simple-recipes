"use client"

import Image from "next/image"
// import { motion } from "framer-motion"
import { IconListNumbers, IconChefHat } from "@tabler/icons-react"
import { Card } from "@/components/ui/Card"
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

        <div
          className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-${steps.length % 3 === 0 ? "3" : "4"} gap-8`}
        >
          {steps.map((step, index) => (
            // <motion.div
            //   key={step.id}
            //   initial={{ opacity: 0, y: 20 }}
            //   animate={{ opacity: 1, y: 0 }}
            //   transition={{ duration: 0.4, delay: index * 0.1 }}
            //   className="flex gap-4"
            // >
            <div className="flex gap-4" key={step.id}>
              {/* Step number */}

              {/* Step content */}
              <div className="flex-1 space-y-4">
                {/* Step image if available */}
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
                      className="absolute z-1 top-1 left-1 rounded-lg px-3 py-1 text-xs uppercase 
               bg-black/40 text-white/80 backdrop-blur-sm"
                    >
                      <span className="truncate">{index + 1}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-text-primary font-semibold">
                    Paso {index + 1}
                  </div>
                )}

                {/* Step instructions */}
                <p className="text-text-primary leading-relaxed">
                  {step.instructions}
                </p>

                {/* Divider (except for last item) */}
                {/* {index < steps.length - 1 && (
                  <div className="border-b border-gray-100 pt-2" />
                )} */}
              </div>
              {/* </motion.div> */}
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}
