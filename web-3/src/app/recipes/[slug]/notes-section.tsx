"use client"

import { IconNotes, IconTrash } from "@tabler/icons-react"
import CollapsibleSection from "@/components/CollapsibleSection"
import { useRecipeNote, NOTE_MAX_LENGTH } from "@/hooks/useRecipeNote"
interface NotesSectionProps {
  recipeId: string
}

export function NotesSection({ recipeId }: NotesSectionProps) {
  const { note, setNote, clearNote, hydrated } = useRecipeNote(recipeId)
  

  if (!hydrated) {
    return null
  }

  return (
    <CollapsibleSection
      title="Mis notas"
      icon={<IconNotes className="w-5 h-5" />}
      defaultOpen={!!note}
    >
      <div className="space-y-2">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Escribe tus notas aquí..."
          rows={4}
          maxLength={NOTE_MAX_LENGTH}
          className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-3 text-sm text-text-primary placeholder-text-secondary resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 dark:border-gray-700 dark:bg-white/5"
        />
        <div className="flex items-center gap-4 justify-between text-xs text-text-secondary">
          <span className="hidden sm:inline mr-auto">Guardado localmente</span>
            <span className={note.length >= NOTE_MAX_LENGTH ? "text-red-500" : note.length >= NOTE_MAX_LENGTH * 0.9 ? "text-amber-500" : ""}>
              {note.length}/{NOTE_MAX_LENGTH}
              <span className="hidden sm:inline"> caracteres</span>
            </span>
            {note.trim() && (
              <button type="button" onClick={clearNote} className="hover:text-red-500 transition-colors flex gap-1">
                <IconTrash className="w-3.5 h-3.5" />
                Borrar nota
              </button>
            )}
        </div>
      </div>
    </CollapsibleSection>
  )
}
