import Gallery from "./sections/Gallery"
import Hero from "./sections/Hero"
import type { SearchFilters } from "../lib/types"

type RawParams = {
  search?: string
  tag?: string | string[]
  cuisine?: string
  includeIngredients?: string | string[]
  excludeIngredients?: string | string[]
  includeUtensils?: string | string[]
  excludeUtensils?: string | string[]
  excludeAllergens?: string | string[]
  maxTime?: string
}

interface HomeProps {
  searchParams: Promise<RawParams>
}

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return []
  return Array.isArray(v) ? v : [v]
}

export default async function Home({ searchParams }: HomeProps) {
  const p = await searchParams

  const filters: SearchFilters = {
    search: p.search,
    tag: toArray(p.tag),
    cuisine: p.cuisine,
    includeIngredients: toArray(p.includeIngredients),
    excludeIngredients: toArray(p.excludeIngredients),
    includeUtensils: toArray(p.includeUtensils),
    excludeUtensils: toArray(p.excludeUtensils),
    excludeAllergens: toArray(p.excludeAllergens),
    maxTime: p.maxTime ? parseInt(p.maxTime) || undefined : undefined,
  }

  return (
    <main className="flex flex-col gap-20">
      <Hero />
      <Gallery filters={filters} />
    </main>
  )
}
