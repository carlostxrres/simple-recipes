"use client"

import Image from "next/image"
// import { motion } from "framer-motion"
import { IconToolsKitchen2 } from "@tabler/icons-react"
import { Card } from "@/components/ui/Card"
import type { Utensil } from "@/lib/types"

interface UtensilsSectionProps {
  utensils: Utensil[]
}

// Placeholder utensil image
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7'/%3E%3C/svg%3E"

export function UtensilsSection({ utensils }: UtensilsSectionProps) {
  return (
    <section>
      <Card className="p-6">
        <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
          <IconToolsKitchen2 className="w-5 h-5 text-primary-500" />
          Utensilios
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {utensils.map((utensil, index) => (
            // <motion.div
            //   key={utensil.id}
            //   initial={{ opacity: 0, scale: 0.9 }}
            //   animate={{ opacity: 1, scale: 1 }}
            //   transition={{ duration: 0.3, delay: index * 0.05 }}
            //   className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-colors text-center"
            // >
            <div
              key={utensil.id}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-colors text-center"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={PLACEHOLDER_IMAGE}
                  alt={utensil.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <span className="text-sm font-medium text-text-primary">
                {utensil.name}
              </span>
              {/* </motion.div> */}
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}
