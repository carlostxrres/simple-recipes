import { IconMenu2 } from "@tabler/icons-react"

export default function () {
  const links = [
    {
      href: "/",
      name: "Home",
    },
    {
      href: "/explore",
      name: "Images",
    },
    {
      href: "/videos",
      name: "Videos",
    },
    {
      href: "/studio",
      name: "Studio",
    },
  ]
  return (
    <header className="flex flex-col gap-3 rounded border border-white/80 bg-white/90 px-4 py-3 shadow-[0_12px_40px_rgba(148,163,184,0.22)] backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-900/80 dark:shadow-[0_12px_40px_rgba(15,23,42,0.55)] sm:flex-row sm:items-baseline sm:justify-between sm:px-6">
      <div className="flex items-baseline justify-between gap-3">
        <a
          className="flex items-baseline gap-2 font-semibold uppercase tracking-[0.28em] text-slate-900 dark:text-slate-100"
          href="/"
        >
          <span className="text-xl">🥕</span>
          <span>Simple eats</span>
        </a>

        <div className="flex items-center gap-2 sm:hidden">
          {/* To do: make button work */}
          <button
            type="button"
            aria-expanded="false"
            aria-label="Open navigation"
            className="inline-flex items-center gap-2 rounded-full font-semibold transition focus-visible:outline focus-visible:outline-offset-2 border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800 h-10 w-10 justify-center"
          >
            <span className="sr-only">Toggle menu</span>
            <IconMenu2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <nav className="hidden items-center gap-6 sm:flex">
        {links.map((link) => (
          <a
            className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:text-slate-400 dark:hover:text-slate-100 dark:focus-visible:outline-slate-100"
            href={link.href}
            key={link.name}
          >
            {link.name}
          </a>
        ))}
      </nav>

      <div className="hidden items-center gap-3 text-sm font-medium sm:flex">
        <a
          className="inline-flex items-center gap-2 rounded-full font-semibold transition focus-visible:outline focus-visible:outline-offset-2 bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-900 dark:hover:bg-slate-700 px-4 py-2 text-sm"
          href="/new"
        >
          Upload Recipe
        </a>
      </div>
    </header>
  )
}
