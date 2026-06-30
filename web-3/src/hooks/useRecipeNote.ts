"use client"

import { useState, useEffect } from "react"
import { sileo } from "sileo"

export function useRecipeNote(recipeId: string) {
  const key = `recipe-note-${recipeId}`
  const [note, setNoteState] = useState("")
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      setNoteState(localStorage.getItem(key) ?? "")
    } catch {}
    setHydrated(true)
  }, [key])

  function setNote(content: string) {
    setNoteState(content)
    try {
      if (content.trim()) {
        localStorage.setItem(key, content)
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
