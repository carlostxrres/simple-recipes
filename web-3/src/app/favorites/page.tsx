import type { Metadata } from "next"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import FavoritesContent from "@/app/favorites/FavoritesContent"
import RecentlyViewedSection from "@/app/favorites/RecentlyViewedSection"

export const metadata: Metadata = {
  title: "Favoritos | Simple Eats",
  description: "Tus recetas guardadas en Simple Eats.",
}

export default function FavoritesPage() {
  return (
    <main className="flex flex-col gap-8 pb-16">
      <Link
        href="/recipes"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-slate-100 w-fit"
      >
        <IconArrowLeft className="w-4 h-4" />
        Todas las recetas
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl dark:text-slate-100">
          Favoritos
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Las recetas que has guardado
        </p>
      </div>

      <FavoritesContent />
      <RecentlyViewedSection />
    </main>
  )
}
