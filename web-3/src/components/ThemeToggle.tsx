"use client"

import { useTheme } from "next-themes"
import { IconSun, IconMoon } from "@tabler/icons-react"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => setMounted(true), [])

  return (
    <button
      type="button"
      translate="no"
      aria-label={mounted && theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:focus-visible:outline-slate-100"
    >
      <span className="sr-only">Toggle theme</span>
      {mounted && theme === "dark" ? (
        <IconSun className="w-5 h-5" />
      ) : (
        <IconMoon className="w-5 h-5" />
      )}
    </button>
  )
}
