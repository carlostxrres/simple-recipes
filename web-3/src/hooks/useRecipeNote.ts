"use client"

import { useState, useEffect } from "react"
import { sileo } from "sileo"

export const NOTE_MAX_LENGTH = 1000

export function useRecipeNote(recipeId: string) {
  const key = `recipe-note-${recipeId}`
  const [note, setNoteState] = useState("")
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      setNoteState((localStorage.getItem(key) ?? "").trim())
    } catch {}
    setHydrated(true)
  }, [key])

  function setNote(content: string) {
    const capped = content.slice(0, NOTE_MAX_LENGTH)
    setNoteState(capped)
    try {
      const trimmed = capped.trim()
      if (trimmed) {
        localStorage.setItem(key, trimmed)
      } else {
        localStorage.removeItem(key)
      }
    } catch {
      sileo.error({
        title: "Error al guardar",
        description: "No se pudo guardar la nota. Puede que el almacenamiento esté lleno.",
      })
    }
  }

  return { note, setNote, clearNote: () => setNote(""), hydrated }
}
