"use client"

import { useState } from "react"
import Link from "next/link"
import { IconMenu2, IconX } from "@tabler/icons-react"
import { useFavorites } from "@/hooks/useFavorites"
import Logo from "@/components/Logo"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { favorites } = useFavorites()
  const favCount = favorites.size

  const links: { href: string; label: React.ReactNode }[] = [
    { href: "/recipes", label: "Recetas" },
    {
      href: "/favorites",
      label: (
        <span className="inline-flex items-center gap-1.5">
          Favoritos
          {favCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-slate-100 dark:text-slate-900">
              {favCount}
            </span>
          )}
        </span>
      ),
    },
  ]

  return (
    <header className="flex flex-col gap-3 rounded border border-white/80 bg-white/90 px-4 py-3 shadow-[0_12px_40px_rgba(148,163,184,0.22)] backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-900/80 dark:shadow-[0_12px_40px_rgba(15,23,42,0.55)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          className="flex items-center gap-3 font-semibold uppercase tracking-[0.28em] text-slate-900 dark:text-slate-100"
          href="/"
        >
          <Logo size={32} />
          <span>Simple eats</span>
        </Link>

        <div className="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            className="inline-flex items-center gap-2 rounded-full font-semibold transition focus-visible:outline focus-visible:outline-offset-2 border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800 h-10 w-10 justify-center"
          >
            <span className="sr-only">Toggle menu</span>
            {menuOpen ? <IconX className="w-5 h-5" /> : <IconMenu2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col gap-3 sm:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
            >
              {link.label}
            </Link>
          ))}
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline focus-visible:outline-offset-2 bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-900 dark:hover:bg-slate-700 px-4 py-2 text-sm"
            href="/new"
            onClick={() => setMenuOpen(false)}
          >
            Subir receta
          </Link>
        </div>
      )}

      <nav className="hidden items-center gap-6 sm:flex">
        {links.map((link) => (
          <Link
            className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:text-slate-400 dark:hover:text-slate-100 dark:focus-visible:outline-slate-100"
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="hidden items-center gap-3 text-sm font-medium sm:flex">
        <Link
          className="inline-flex items-center gap-2 rounded-full font-semibold transition focus-visible:outline focus-visible:outline-offset-2 bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-900 dark:hover:bg-slate-700 px-4 py-2 text-sm"
          href="/new"
        >
          Subir receta
        </Link>
      </div>
    </header>
  )
}
