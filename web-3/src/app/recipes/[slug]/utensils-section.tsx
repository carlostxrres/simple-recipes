import Image from "next/image"
import { IconToolsKitchen2 } from "@tabler/icons-react"
import CollapsibleSection from "@/components/CollapsibleSection"
import type { Utensil } from "@/lib/types"

interface UtensilsSectionProps {
  utensils: Utensil[]
}

// Placeholder utensil image
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7'/%3E%3C/svg%3E"

export function UtensilsSection({ utensils }: UtensilsSectionProps) {
  return (
    <CollapsibleSection title="Utensilios" icon={<IconToolsKitchen2 className="w-5 h-5" />} defaultOpen={false}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {utensils.map((utensil) => (
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
          </div>
        ))}
      </div>
    </CollapsibleSection>
  )
}
