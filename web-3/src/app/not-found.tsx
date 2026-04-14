import Link from "next/link"
import { IconChefHat, IconArrowLeft } from "@tabler/icons-react"

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <IconChefHat className="h-12 w-12 text-slate-400 dark:text-slate-500" />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          404
        </p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Página no encontrada
        </h1>
        <p className="max-w-sm text-slate-500 dark:text-slate-400">
          Parece que esta página no existe o ha sido eliminada.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800"
        >
          <IconArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Ver recetas
        </Link>
      </div>
    </main>
  )
}
