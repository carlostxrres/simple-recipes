"use client"

import { IconNotes, IconTrash } from "@tabler/icons-react"
import CollapsibleSection from "@/components/CollapsibleSection"
import { useRecipeNote } from "@/hooks/useRecipeNote"

interface NotesSectionProps {
  recipeId: string
}

export function NotesSection({ recipeId }: NotesSectionProps) {
  const { note, setNote, clearNote, hydrated } = useRecipeNote(recipeId)

  if (!hydrated) return null

  return (
    <CollapsibleSection
      title="Mis notas"
      icon={<IconNotes className="w-5 h-5" />}
      defaultOpen={!!note}
    >
      <div className="space-y-3">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Escribe tus notas aquí..."
          rows={4}
          className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-3 text-sm text-text-primary placeholder-text-secondary resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 dark:border-gray-700 dark:bg-white/5"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">Guardado localmente</span>
          {note.trim() && (
            <button
              type="button"
              onClick={clearNote}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              <IconTrash className="w-3.5 h-3.5" />
              Borrar nota
            </button>
          )}
        </div>
      </div>
    </CollapsibleSection>
  )
}
