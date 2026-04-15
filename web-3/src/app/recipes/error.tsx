"use client"

import Link from "next/link"
import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function RecipesError({ error: _error, reset }: ErrorProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
        <IconAlertTriangle className="h-10 w-10 text-red-400" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Error al cargar las recetas
        </h1>
        <p className="max-w-sm text-slate-500 dark:text-slate-400">
          No se pudo conectar con el servidor. Comprueba tu conexión e
          inténtalo de nuevo.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800"
        >
          <IconRefresh className="h-4 w-4" />
          Reintentar
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Inicio
        </Link>
      </div>
    </main>
  )
}
