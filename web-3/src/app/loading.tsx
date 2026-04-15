export default function HomeLoading() {
  return (
    <main className="flex flex-col gap-20">
      {/* Hero skeleton */}
      <section className="flex flex-col gap-8 mt-12">
        <div className="h-14 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="h-5 w-full rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-5 w-5/6 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-5 w-4/6 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
      </section>

      {/* Gallery skeleton */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="h-9 w-96 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-5 w-2/3 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="mb-4 break-inside-avoid rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 animate-pulse"
              style={{ height: `${220 + (i % 3) * 60}px` }}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
