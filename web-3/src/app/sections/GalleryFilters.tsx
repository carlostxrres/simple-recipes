"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { IconFilter, IconX, IconCheck } from "@tabler/icons-react"
import type { Tag } from "../../lib/types"

interface GalleryFiltersProps {
  tags: Tag[]
  selectedTags: string[]
}

export default function GalleryFilters({ tags, selectedTags }: GalleryFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const activeCount = selectedTags.length

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [isOpen])

  function updateTags(next: string[]) {
    const params = new URLSearchParams()
    next.forEach((slug) => params.append("tag", slug))
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  function toggleTag(slug: string) {
    if (selectedTags.includes(slug)) {
      updateTags(selectedTags.filter((t) => t !== slug))
    } else {
      updateTags([...selectedTags, slug])
    }
  }

  function clearAll() {
    updateTags([])
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
      >
        <IconFilter className="w-4 h-4" />
        <span>Filtrar</span>
        {activeCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white dark:bg-slate-100 dark:text-slate-900">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Etiquetas
            </span>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="flex items-center gap-1 text-xs text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                <IconX className="w-3 h-3" />
                Limpiar
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1">
            {tags.map((tag) => {
              const active = selectedTags.includes(tag.slug)
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.slug)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{tag.name}</span>
                  {active && <IconCheck className="w-4 h-4 shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
