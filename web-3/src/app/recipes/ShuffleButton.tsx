"use client"

import { useRef, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { IconArrowsShuffle } from "@tabler/icons-react"

const THROTTLE_MS = 2000

export default function ShuffleButton() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [busy, setBusy] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleShuffle() {
    if (busy) {
      return
    }
    setBusy(true)

    const params = new URLSearchParams(searchParams.toString())
    params.set("seed", Math.random().toString(36).slice(2))
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)

    timeoutRef.current = setTimeout(() => {
      setBusy(false)
      timeoutRef.current = null
    }, THROTTLE_MS)
  }

  return (
    <button
      type="button"
      onClick={handleShuffle}
      disabled={busy}
      aria-label="Mezclar recetas"
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
    >
      <IconArrowsShuffle className="h-4 w-4" />
      Mezclar
    </button>
  )
}
