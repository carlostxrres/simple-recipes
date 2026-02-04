export default function () {
  return (
    <section
      id="collections"
      className="grid gap-6 rounded border border-slate-200 bg-white/90 p-4 shadow-[0_12px_36px_rgba(15,23,42,0.08)] sm:grid-cols-2 sm:p-8 dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-[0_20px_60px_rgba(15,23,42,0.55)]"
    >
      <div className="flex flex-col gap-4">
        <span className="inline-flex w-fit rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white dark:bg-slate-100 dark:text-slate-900">
          Community resources
        </span>
        <h3 className="text-2xl font-semibold text-slate-900 sm:text-3xl dark:text-slate-100">
          Why we share every prompt
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Banana Prompts exists to make the craft behind AI visuals transparent.
          We publish settings, pacing notes, and lessons learned so
          everyone—from curious fans to pro directors—can turn inspiration into
          their own story.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <span className="inline-flex w-fit rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-900 dark:bg-amber-300">
          Share your art
        </span>
        <h3 className="text-2xl font-semibold text-slate-900 sm:text-3xl dark:text-slate-100">
          Submit your prompt and teach the community
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Send your latest render with the prompt, settings, and story behind
          it. We feature the most helpful breakdowns and credit every creator.
        </p>
        <a
          className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-slate-100"
          href="/submit"
        >
          Submit to the gallery
        </a>
      </div>
    </section>
  )
}
