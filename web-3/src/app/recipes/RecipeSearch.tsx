"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { IconSearch, IconX } from "@tabler/icons-react"

export default function RecipeSearch() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const current = searchParams.get("search") ?? ""
  const [value, setValue] = useState(current)

  // Keep input in sync when URL changes externally (e.g. filter panel clears search)
  useEffect(() => {
    setValue(current)
  }, [current])

  function navigate(term: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (term.trim()) params.set("search", term.trim())
    else params.delete("search")
    params.delete("page")
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate(value)
  }

  function handleClear() {
    setValue("")
    navigate("")
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-md">
      <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar recetas..."
        className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm text-slate-700 outline-none placeholder:text-slate-400 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-800"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Borrar búsqueda"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <IconX className="h-3.5 w-3.5" />
        </button>
      )}
    </form>
  )
}
