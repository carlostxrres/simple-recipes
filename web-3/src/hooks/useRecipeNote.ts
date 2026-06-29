"use client"

import { useState, useEffect } from "react"

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
    } catch {}
  }

  return { note, setNote, clearNote: () => setNote(""), hydrated }
}
