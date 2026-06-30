import Link from "next/link"
import { IconX } from "@tabler/icons-react"
import type { Tag, Cuisine, Ingredient, Allergen, Utensil } from "@/lib/types"
import { toArray } from "@/lib/utils"
import { formatTime } from "@/lib/format"

interface ActiveFilterPillsProps {
  searchParams: Record<string, string | string[] | undefined>
  tags: Tag[]
  cuisines: Cuisine[]
  ingredients: Ingredient[]
  allergens: Allergen[]
  utensils: Utensil[]
}

function buildUrl(
  params: Record<string, string | string[] | undefined>,
  removeKey: string,
  removeValue?: string,
): string {
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (k === "page") {
      continue // reset pagination on filter change
    }
    if (Array.isArray(v)) {
      v.forEach((s) => {
        if (k === removeKey && (removeValue === undefined || s === removeValue)) {
          return
        }
        p.append(k, s)
      })
    } else if (v) {
      if (k !== removeKey) {
        p.set(k, v)
      }
    }
  }
  const qs = p.toString()
  return qs ? `/recipes?${qs}` : "/recipes"
}

interface Pill {
  key: string
  label: string
  removeUrl: string
  variant: "default" | "green" | "red" | "amber" | "time"
}

export default function ActiveFilterPills({
  searchParams: p,
  tags,
  cuisines,
  ingredients,
  allergens,
  utensils,
}: ActiveFilterPillsProps) {
  const pills: Pill[] = []

  if (p.search) {
    pills.push({
      key: "search",
      label: `"${p.search}"`,
      removeUrl: buildUrl(p, "search"),
      variant: "default",
    })
  }

  toArray(p.tag).forEach((slug) => {
    const name = tags.find((t) => t.slug === slug)?.name ?? slug
    pills.push({ key: `tag:${slug}`, label: name, removeUrl: buildUrl(p, "tag", slug), variant: "default" })
  })

  if (p.cuisine) {
    const name = cuisines.find((c) => c.slug === p.cuisine)?.name ?? String(p.cuisine)
    pills.push({ key: "cuisine", label: name, removeUrl: buildUrl(p, "cuisine"), variant: "default" })
  }

  toArray(p.includeIngredients).forEach((slug) => {
    const name = ingredients.find((i) => i.slug === slug)?.name ?? slug
    pills.push({ key: `inc-ing:${slug}`, label: `+${name}`, removeUrl: buildUrl(p, "includeIngredients", slug), variant: "green" })
  })

  toArray(p.excludeIngredients).forEach((slug) => {
    const name = ingredients.find((i) => i.slug === slug)?.name ?? slug
    pills.push({ key: `exc-ing:${slug}`, label: `−${name}`, removeUrl: buildUrl(p, "excludeIngredients", slug), variant: "red" })
  })

  toArray(p.includeUtensils).forEach((slug) => {
    const name = utensils.find((u) => u.slug === slug)?.name ?? slug
    pills.push({ key: `inc-uten:${slug}`, label: `+${name}`, removeUrl: buildUrl(p, "includeUtensils", slug), variant: "green" })
  })

  toArray(p.excludeUtensils).forEach((slug) => {
    const name = utensils.find((u) => u.slug === slug)?.name ?? slug
    pills.push({ key: `exc-uten:${slug}`, label: `−${name}`, removeUrl: buildUrl(p, "excludeUtensils", slug), variant: "red" })
  })

  toArray(p.excludeAllergens).forEach((slug) => {
    const name = allergens.find((a) => a.slug === slug)?.name ?? slug
    pills.push({ key: `exc-alg:${slug}`, label: `sin ${name}`, removeUrl: buildUrl(p, "excludeAllergens", slug), variant: "amber" })
  })

  const maxTime = p.maxTime ? parseInt(String(p.maxTime)) : 0
  if (maxTime > 0) {
    pills.push({
      key: "maxTime",
      label: `≤ ${formatTime(maxTime)}`,
      removeUrl: buildUrl(p, "maxTime"),
      variant: "time",
    })
  }

  if (pills.length === 0) {
    return null
  }

  const cls: Record<Pill["variant"], string> = {
    default:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    green:
      "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
    red: "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    amber:
      "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
    time: "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800",
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pills.map((pill) => (
        <span
          key={pill.key}
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls[pill.variant]}`}
        >
          {pill.label}
          <Link
            href={pill.removeUrl}
            aria-label={`Eliminar filtro ${pill.label}`}
            className="ml-0.5 rounded-full p-0.5 transition hover:bg-black/10 dark:hover:bg-white/10"
          >
            <IconX className="h-2.5 w-2.5" />
          </Link>
        </span>
      ))}
      <Link
        href="/recipes"
        className="text-xs text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
      >
        Limpiar todo
      </Link>
    </div>
  )
}
