"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { IconClock } from "@tabler/icons-react"
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed"

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return "ahora mismo"
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.floor(hours / 24)
  return `hace ${days} d`
}

export default function RecentlyViewedSection() {
  const { recent, clearAll } = useRecentlyViewed()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated || recent.length === 0) return null

  return (
    <div className="mt-12">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
          <IconClock className="h-5 w-5 text-slate-400" />
          Vistas recientemente
        </h2>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
        >
          Limpiar
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {recent.map((entry) => (
          <Link
            key={entry.slug}
            href={`/recipes/${entry.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
          >
            <span className="max-w-[12rem] truncate">{entry.name}</span>
            <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
              {timeAgo(entry.viewedAt)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
