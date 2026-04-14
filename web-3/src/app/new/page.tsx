import { IconChefHat } from "@tabler/icons-react"

export default function NewRecipePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-primary-500">
        <IconChefHat className="h-10 w-10" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Subir receta
        </h1>
        <p className="max-w-sm text-slate-500 dark:text-slate-400">
          Esta página está en construcción. Pronto podrás subir tus propias
          recetas.
        </p>
      </div>
      <a
        href="/"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800"
      >
        Volver al inicio
      </a>
    </main>
  )
}
