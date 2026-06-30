"use client"

import { useState } from "react"
import { IconShare, IconPrinter, IconCheck } from "@tabler/icons-react"
import { sileo } from "sileo"

interface RecipeActionsProps {
  title: string
}

export default function RecipeActions({ title }: RecipeActionsProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = window.location.href

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // User cancelled — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      sileo.warning({
        title: "No se pudo copiar",
        description: "Copia el enlace manualmente desde la barra de direcciones.",
      })
    }
  }

  function handlePrint() {
    window.print()
  }

  const btnClass =
    "no-print inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/60 px-3 py-1.5 text-xs font-medium text-slate-600 backdrop-blur-sm transition hover:bg-white hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-400 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={handleShare} className={btnClass}>
        {copied ? (
          <IconCheck className="h-3.5 w-3.5 text-green-300" />
        ) : (
          <IconShare className="h-3.5 w-3.5" />
        )}
        {copied ? "¡Copiado!" : "Compartir"}
      </button>

      <button type="button" onClick={handlePrint} className={btnClass}>
        <IconPrinter className="h-3.5 w-3.5" />
        Imprimir
      </button>
    </div>
  )
}
