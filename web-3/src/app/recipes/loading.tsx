export default function RecipesLoading() {
  return (
    <main className="flex flex-col gap-8 pb-16">
      {/* Header skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-9 w-56 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>

      {/* Filters skeleton */}
      <div className="flex justify-end">
        <div className="h-10 w-28 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>

      {/* Recipe grid skeleton */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="mb-4 break-inside-avoid rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 animate-pulse"
            style={{ height: `${220 + (i % 3) * 60}px` }}
          />
        ))}
      </div>
    </main>
  )
}
