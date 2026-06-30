"use client"

import { useRef } from "react"
import { IconNotes } from "@tabler/icons-react"
import { useRecipeNote } from "@/hooks/useRecipeNote"

interface NotesButtonProps {
  recipeSlug: string
}

export default function NotesButton({ recipeSlug }: NotesButtonProps) {
  const { note, hydrated } = useRecipeNote(recipeSlug)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  if (!hydrated || !note.trim()) return null

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const popover = popoverRef.current
          const button = buttonRef.current
          if (!popover || !button) return
          const rect = button.getBoundingClientRect()
          popover.style.top = `${rect.top}px`
          popover.style.left = `${rect.left - 8}px`
          popover.style.transform = "translateX(-100%)"
          popover.togglePopover()
        }}
        aria-label="Ver mis notas"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-500 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400 backdrop-blur-sm transition-all duration-200"
      >
        <IconNotes className="h-4 w-4" />
      </button>
      <div
        ref={popoverRef}
        popover="auto"
        onClick={(e) => e.stopPropagation()}
        className="m-0 w-60 rounded-xl border border-white/80 bg-white/95 p-3 shadow-lg backdrop-blur-md text-sm dark:bg-slate-800/95 dark:border-slate-700"
      >
        <p className="mb-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">Mis notas</p>
        <p className="max-h-40 overflow-y-auto whitespace-pre-wrap break-words leading-relaxed text-text-primary">
          {note}
        </p>
      </div>
    </>
  )
}
