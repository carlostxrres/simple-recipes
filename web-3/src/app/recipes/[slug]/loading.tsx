import { IconChefHat } from "@tabler/icons-react"

export default function RecipeLoading() {
  return (
    <main className="min-h-screen">
      {/* Back link skeleton */}
      <div className="mb-4 h-5 w-36 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />

      {/* Hero skeleton */}
      <section className="relative">
        <div className="h-64 sm:h-80 md:h-96 bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center rounded-xl">
          <IconChefHat className="w-16 h-16 text-slate-300 dark:text-slate-700" />
        </div>

        <div className="container mx-auto px-4">
          <div className="relative -mt-32 sm:-mt-40 glass-frost rounded-2xl p-6 md:p-8 space-y-4">
            {/* Tags skeleton */}
            <div className="flex gap-2">
              <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>

            {/* Title skeleton */}
            <div className="space-y-2">
              <div className="h-9 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-6 w-1/2 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>

            {/* Meta info skeleton */}
            <div className="flex gap-4 pt-2">
              <div className="h-7 w-20 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-7 w-16 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-7 w-24 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Content skeletons */}
      <div className="container mx-auto px-4 mt-8 space-y-4">
        {[220, 320, 180].map((h, i) => (
          <div
            key={i}
            className="rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>
    </main>
  )
}
