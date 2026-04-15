"use client"

import { useState, useEffect } from "react"
import { IconArrowUp } from "@tabler/icons-react"

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function check() {
      setVisible(window.scrollY > 500)
    }
    window.addEventListener("scroll", check, { passive: true })
    return () => window.removeEventListener("scroll", check)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Volver al inicio de la página"
      className="no-print fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 text-white shadow-lg backdrop-blur-sm transition hover:bg-slate-900 dark:bg-slate-100/80 dark:text-slate-900 dark:hover:bg-slate-100"
    >
      <IconArrowUp className="h-5 w-5" />
    </button>
  )
}
