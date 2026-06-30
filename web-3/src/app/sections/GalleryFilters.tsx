"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  IconFilter,
  IconX,
  IconCheck,
  IconSearch,
  IconChevronDown,
  IconPlus,
  IconMinus,
  IconClock,
} from "@tabler/icons-react"
import type { Tag, Cuisine, Ingredient, Allergen, Utensil } from "@/lib/types"
import { getIngredientImageUrl } from "@/lib/imageUrl"
import { formatTime } from "@/lib/format"

// ─── Time slider ────────────────────────────────────────────────────────────

const TIME_OPTIONS = [0, 5, 10, 15, 20, 30, 45, 60, 90, 120]

function formatMaxTime(min: number): string {
  return min === 0 ? "Sin límite" : formatTime(min)
}

// ─── Filter state ────────────────────────────────────────────────────────────

interface FilterState {
  search: string
  tags: string[]
  cuisine: string
  includeIngredients: string[]
  excludeIngredients: string[]
  includeUtensils: string[]
  excludeUtensils: string[]
  excludeAllergens: string[]
  maxTime: number
}

const EMPTY: FilterState = {
  search: "",
  tags: [],
  cuisine: "",
  includeIngredients: [],
  excludeIngredients: [],
  includeUtensils: [],
  excludeUtensils: [],
  excludeAllergens: [],
  maxTime: 0,
}

function parseParams(p: URLSearchParams): FilterState {
  return {
    search: p.get("search") ?? "",
    tags: p.getAll("tag"),
    cuisine: p.get("cuisine") ?? "",
    includeIngredients: p.getAll("includeIngredients"),
    excludeIngredients: p.getAll("excludeIngredients"),
    includeUtensils: p.getAll("includeUtensils"),
    excludeUtensils: p.getAll("excludeUtensils"),
    excludeAllergens: p.getAll("excludeAllergens"),
    maxTime: parseInt(p.get("maxTime") ?? "0") || 0,
  }
}

function toQueryString(f: FilterState): string {
  const p = new URLSearchParams()
  if (f.search) {
    p.set("search", f.search)
  }
  f.tags.forEach((t) => p.append("tag", t))
  if (f.cuisine) {
    p.set("cuisine", f.cuisine)
  }
  f.includeIngredients.forEach((i) => p.append("includeIngredients", i))
  f.excludeIngredients.forEach((i) => p.append("excludeIngredients", i))
  f.includeUtensils.forEach((u) => p.append("includeUtensils", u))
  f.excludeUtensils.forEach((u) => p.append("excludeUtensils", u))
  f.excludeAllergens.forEach((a) => p.append("excludeAllergens", a))
  if (f.maxTime > 0) {
    p.set("maxTime", String(f.maxTime))
  }
  return p.toString()
}

function countFilters(f: FilterState): number {
  return (
    (f.search ? 1 : 0) +
    f.tags.length +
    (f.cuisine ? 1 : 0) +
    f.includeIngredients.length +
    f.excludeIngredients.length +
    f.includeUtensils.length +
    f.excludeUtensils.length +
    f.excludeAllergens.length +
    (f.maxTime > 0 ? 1 : 0)
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FilterSection({
  label,
  activeCount,
  children,
}: {
  label: string
  activeCount: number
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(activeCount > 0)

  // Re-open section when it becomes active (e.g. after a "clear all")
  useEffect(() => {
    if (activeCount > 0) {
      setOpen(true)
    }
  }, [activeCount])

  return (
    <div className="border-b border-slate-100 last:border-0 dark:border-slate-800">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-slate-100 dark:text-slate-900">
              {activeCount}
            </span>
          )}
          <IconChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  )
}

// Generic searchable list used by CheckboxList and ThreeStateList
function ItemSearch({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="relative mb-2">
      <IconSearch className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder="Buscar..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-7 pr-3 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      />
    </div>
  )
}

// Simple multiselect (tags, allergens) or single-select (cuisine)
function CheckboxList({
  items,
  selected,
  onToggle,
  single = false,
  searchable = false,
}: {
  items: { id: string; slug: string; name: string }[]
  selected: string[]
  onToggle: (slug: string) => void
  single?: boolean
  searchable?: boolean
}) {
  const [query, setQuery] = useState("")
  const visible = query
    ? items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))
    : items

  return (
    <div>
      {searchable && <ItemSearch value={query} onChange={setQuery} />}
      <div className="flex max-h-44 flex-col gap-0.5 overflow-y-auto">
        {visible.map((item) => {
          const active = selected.includes(item.slug)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggle(item.slug)}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition ${
                active
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded transition ${
                  active
                    ? "bg-white/20 dark:bg-slate-900/20"
                    : "border border-slate-300 dark:border-slate-600"
                }`}
              >
                {active && <IconCheck className="h-2.5 w-2.5" />}
              </span>
              <span className="truncate">{item.name}</span>
            </button>
          )
        })}
        {visible.length === 0 && (
          <p className="px-2.5 py-2 text-xs text-slate-400">Sin resultados</p>
        )}
      </div>
      {!single && selected.length > 0 && (
        <p className="mt-1.5 text-[10px] text-slate-400">AND — deben cumplirse todos</p>
      )}
    </div>
  )
}

// 3-state item: neutral → include (+) → exclude (−) → neutral
type TriState = "neutral" | "include" | "exclude"

function ThreeStateList({
  items,
  includeList,
  excludeList,
  onCycle,
  searchable = false,
  showImages = false,
}: {
  items: { id: string; slug: string; name: string }[]
  includeList: string[]
  excludeList: string[]
  onCycle: (slug: string) => void
  searchable?: boolean
  showImages?: boolean
}) {
  const [query, setQuery] = useState("")

  function getState(slug: string): TriState {
    if (includeList.includes(slug)) {
      return "include"
    }
    if (excludeList.includes(slug)) {
      return "exclude"
    }
    return "neutral"
  }

  const activeItems = items.filter((i) => getState(i.slug) !== "neutral")
  const visible = query
    ? items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))
    : items
  const neutralVisible = visible.filter((i) => getState(i.slug) === "neutral")

  return (
    <div>
      {searchable && <ItemSearch value={query} onChange={setQuery} />}

      {/* Active items pinned to top when not searching */}
      {!query && activeItems.length > 0 && (
        <div className="mb-1 flex flex-col gap-0.5">
          {activeItems.map((item) => (
            <TriStateButton
              key={item.id}
              item={item}
              state={getState(item.slug)}
              onCycle={onCycle}
              imgUrl={showImages ? getIngredientImageUrl(item.slug) : undefined}
            />
          ))}
          <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />
        </div>
      )}

      <div className="flex max-h-44 flex-col gap-0.5 overflow-y-auto">
        {(query ? visible : neutralVisible).map((item) => (
          <TriStateButton
            key={item.id}
            item={item}
            state={getState(item.slug)}
            onCycle={onCycle}
            imgUrl={showImages ? getIngredientImageUrl(item.slug) : undefined}
          />
        ))}
        {visible.length === 0 && (
          <p className="px-2.5 py-2 text-xs text-slate-400">Sin resultados</p>
        )}
      </div>

      <p className="mt-1.5 text-[10px] text-slate-400">
        Click: neutro → <span className="text-green-600">incluir</span> → <span className="text-red-500">excluir</span>
      </p>
    </div>
  )
}

function TriStateButton({
  item,
  state,
  onCycle,
  imgUrl,
}: {
  item: { id: string; slug: string; name: string }
  state: TriState
  onCycle: (slug: string) => void
  imgUrl?: string
}) {
  const [imgVisible, setImgVisible] = useState(true)

  const cls: Record<TriState, string> = {
    neutral: "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
    include: "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    exclude: "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  }
  const icon: Record<TriState, React.ReactNode> = {
    neutral: (
      <span className="h-4 w-4 rounded border border-slate-300 dark:border-slate-600" />
    ),
    include: <IconPlus className="h-4 w-4 text-green-600 dark:text-green-400" />,
    exclude: <IconMinus className="h-4 w-4 text-red-500 dark:text-red-400" />,
  }
  return (
    <button
      type="button"
      onClick={() => onCycle(item.slug)}
      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition ${cls[state]}`}
    >
      <span className="shrink-0">{icon[state]}</span>
      {imgUrl && imgVisible && (
        <span className="relative h-7 w-7 shrink-0 overflow-visible">
          <Image
            src={imgUrl}
            alt=""
            width={36}
            height={36}
            className="absolute left-1/2 top-1/2 h-auto max-h-9 w-auto max-w-9 -translate-x-1/2 -translate-y-1/2 scale-110 rotate-6 object-contain drop-shadow-sm"
            onError={() => setImgVisible(false)}
          />
        </span>
      )}
      <span className="truncate">{item.name}</span>
    </button>
  )
}

function TimeSlider({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const idx = Math.max(0, TIME_OPTIONS.indexOf(value))
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <IconClock className="h-3.5 w-3.5" />
          <span>Máximo</span>
        </div>
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {formatMaxTime(value)}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={TIME_OPTIONS.length - 1}
        step={1}
        value={idx}
        onChange={(e) => onChange(TIME_OPTIONS[parseInt(e.target.value)])}
        className="w-full accent-slate-900 dark:accent-slate-100"
      />
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>∞</span>
        <span>5</span>
        <span>10</span>
        <span>15</span>
        <span>20</span>
        <span>30</span>
        <span>45</span>
        <span>1h</span>
        <span>1.5h</span>
        <span>2h</span>
      </div>
    </div>
  )
}

// ─── Active filter tags ──────────────────────────────────────────────────────

interface ActiveTag {
  key: string
  label: string
  variant: "default" | "green" | "red" | "amber" | "time"
  onRemove: () => void
}

function buildActiveTags(
  draft: FilterState,
  update: (fn: (d: FilterState) => FilterState) => void,
  lookups: {
    tags: Tag[]
    cuisines: Cuisine[]
    ingredients: Ingredient[]
    allergens: Allergen[]
    utensils: Utensil[]
  }
): ActiveTag[] {
  const result: ActiveTag[] = []

  if (draft.search) {
    result.push({
      key: "search",
      label: `"${draft.search}"`,
      variant: "default",
      onRemove: () => update((d) => ({ ...d, search: "" })),
    })
  }

  draft.tags.forEach((slug) => {
    const name = lookups.tags.find((t) => t.slug === slug)?.name ?? slug
    result.push({
      key: `tag:${slug}`,
      label: name,
      variant: "default",
      onRemove: () => update((d) => ({ ...d, tags: d.tags.filter((t) => t !== slug) })),
    })
  })

  if (draft.cuisine) {
    const name = lookups.cuisines.find((c) => c.slug === draft.cuisine)?.name ?? draft.cuisine
    result.push({
      key: "cuisine",
      label: name,
      variant: "default",
      onRemove: () => update((d) => ({ ...d, cuisine: "" })),
    })
  }

  draft.includeIngredients.forEach((slug) => {
    const name = lookups.ingredients.find((i) => i.slug === slug)?.name ?? slug
    result.push({
      key: `inc-ing:${slug}`,
      label: `+${name}`,
      variant: "green",
      onRemove: () =>
        update((d) => ({ ...d, includeIngredients: d.includeIngredients.filter((i) => i !== slug) })),
    })
  })

  draft.excludeIngredients.forEach((slug) => {
    const name = lookups.ingredients.find((i) => i.slug === slug)?.name ?? slug
    result.push({
      key: `exc-ing:${slug}`,
      label: `−${name}`,
      variant: "red",
      onRemove: () =>
        update((d) => ({ ...d, excludeIngredients: d.excludeIngredients.filter((i) => i !== slug) })),
    })
  })

  draft.includeUtensils.forEach((slug) => {
    const name = lookups.utensils.find((u) => u.slug === slug)?.name ?? slug
    result.push({
      key: `inc-uten:${slug}`,
      label: `+${name}`,
      variant: "green",
      onRemove: () =>
        update((d) => ({ ...d, includeUtensils: d.includeUtensils.filter((u) => u !== slug) })),
    })
  })

  draft.excludeUtensils.forEach((slug) => {
    const name = lookups.utensils.find((u) => u.slug === slug)?.name ?? slug
    result.push({
      key: `exc-uten:${slug}`,
      label: `−${name}`,
      variant: "red",
      onRemove: () =>
        update((d) => ({ ...d, excludeUtensils: d.excludeUtensils.filter((u) => u !== slug) })),
    })
  })

  draft.excludeAllergens.forEach((slug) => {
    const name = lookups.allergens.find((a) => a.slug === slug)?.name ?? slug
    result.push({
      key: `exc-alg:${slug}`,
      label: name,
      variant: "amber",
      onRemove: () =>
        update((d) => ({ ...d, excludeAllergens: d.excludeAllergens.filter((a) => a !== slug) })),
    })
  })

  if (draft.maxTime > 0) {
    result.push({
      key: "maxTime",
      label: formatMaxTime(draft.maxTime),
      variant: "time",
      onRemove: () => update((d) => ({ ...d, maxTime: 0 })),
    })
  }

  return result
}

function ActiveTagPill({ tag }: { tag: ActiveTag }) {
  const cls: Record<ActiveTag["variant"], string> = {
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
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls[tag.variant]}`}
    >
      {tag.label}
      <button
        type="button"
        onClick={tag.onRemove}
        aria-label="Eliminar filtro"
        className="ml-0.5 rounded-full p-0.5 transition hover:bg-black/10 dark:hover:bg-white/10"
      >
        <IconX className="h-2.5 w-2.5" />
      </button>
    </span>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

interface GalleryFiltersProps {
  tags: Tag[]
  cuisines: Cuisine[]
  ingredients: Ingredient[]
  allergens: Allergen[]
  utensils: Utensil[]
}

export default function GalleryFilters({
  tags,
  cuisines,
  ingredients,
  allergens,
  utensils,
}: GalleryFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const panelRef = useRef<HTMLDivElement>(null)

  const applied = parseParams(searchParams)
  const appliedCount = countFilters(applied)

  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState<FilterState>(EMPTY)

  function openPanel() {
    setDraft(parseParams(searchParams))
    setIsOpen(true)
  }

  function closePanel() {
    setIsOpen(false)
  }

  function handleApply() {
    const qs = toQueryString(draft)
    router.push(qs ? `${pathname}?${qs}` : pathname)
    closePanel()
  }

  function handleClearAll() {
    setDraft(EMPTY)
    router.push(pathname)
    closePanel()
  }

  function cycleIngredient(slug: string) {
    setDraft((d) => {
      if (d.includeIngredients.includes(slug)) {
        return {
          ...d,
          includeIngredients: d.includeIngredients.filter((s) => s !== slug),
          excludeIngredients: [...d.excludeIngredients, slug],
        }
      }
      if (d.excludeIngredients.includes(slug)) {
        return { ...d, excludeIngredients: d.excludeIngredients.filter((s) => s !== slug) }
      }
      return { ...d, includeIngredients: [...d.includeIngredients, slug] }
    })
  }

  function cycleUtensil(slug: string) {
    setDraft((d) => {
      if (d.includeUtensils.includes(slug)) {
        return {
          ...d,
          includeUtensils: d.includeUtensils.filter((s) => s !== slug),
          excludeUtensils: [...d.excludeUtensils, slug],
        }
      }
      if (d.excludeUtensils.includes(slug)) {
        return { ...d, excludeUtensils: d.excludeUtensils.filter((s) => s !== slug) }
      }
      return { ...d, includeUtensils: [...d.includeUtensils, slug] }
    })
  }

  // Close on outside click
  useEffect(() => {
    if (!isOpen) {
      return
    }
    function handle(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closePanel()
      }
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) {
      return
    }
    function handle(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closePanel()
      }
    }
    document.addEventListener("keydown", handle)
    return () => document.removeEventListener("keydown", handle)
  }, [isOpen])

  const activeTags = buildActiveTags(draft, setDraft, {
    tags,
    cuisines,
    ingredients,
    allergens,
    utensils,
  })
  const draftCount = countFilters(draft)

  return (
    <div className="relative" ref={panelRef}>
      {/* Toggle button */}
      <button
        type="button"
        onClick={isOpen ? closePanel : openPanel}
        aria-expanded={isOpen}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
      >
        <IconFilter className="h-4 w-4" />
        <span>Filtrar</span>
        {appliedCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white dark:bg-slate-100 dark:text-slate-900">
            {appliedCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          className={[
            // Mobile: fixed, centered, almost full-height
            "fixed inset-x-4 top-28 z-50 max-h-[calc(100dvh-8rem)]",
            // Desktop: absolute dropdown anchored to button
            "sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 sm:max-h-[calc(100dvh-12rem)]",
            // Shared
            "flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900",
          ].join(" ")}
        >
          {/* ── Section 1: Filters ── */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 pt-4">
              {/* Header */}
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Filtros</h2>
                <button
                  type="button"
                  onClick={closePanel}
                  className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  aria-label="Cerrar filtros"
                >
                  <IconX className="h-4 w-4" />
                </button>
              </div>

              {/* Search */}
              <div className="mb-3">
                <div className="relative">
                  <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={draft.search}
                    onChange={(e) => setDraft((d) => ({ ...d, search: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Accordion sections */}
            <div className="px-4 pb-2">
              <FilterSection label="Etiquetas" activeCount={draft.tags.length}>
                <CheckboxList
                  items={tags}
                  selected={draft.tags}
                  onToggle={(slug) =>
                    setDraft((d) => ({
                      ...d,
                      tags: d.tags.includes(slug)
                        ? d.tags.filter((t) => t !== slug)
                        : [...d.tags, slug],
                    }))
                  }
                />
              </FilterSection>

              <FilterSection label="Cocina" activeCount={draft.cuisine ? 1 : 0}>
                <CheckboxList
                  items={cuisines}
                  selected={draft.cuisine ? [draft.cuisine] : []}
                  single
                  onToggle={(slug) =>
                    setDraft((d) => ({ ...d, cuisine: d.cuisine === slug ? "" : slug }))
                  }
                />
              </FilterSection>

              <FilterSection
                label="Ingredientes"
                activeCount={draft.includeIngredients.length + draft.excludeIngredients.length}
              >
                <ThreeStateList
                  items={ingredients}
                  includeList={draft.includeIngredients}
                  excludeList={draft.excludeIngredients}
                  onCycle={cycleIngredient}
                  searchable
                  showImages
                />
              </FilterSection>

              <FilterSection
                label="Utensilios"
                activeCount={draft.includeUtensils.length + draft.excludeUtensils.length}
              >
                <ThreeStateList
                  items={utensils}
                  includeList={draft.includeUtensils}
                  excludeList={draft.excludeUtensils}
                  onCycle={cycleUtensil}
                  searchable
                />
              </FilterSection>

              <FilterSection label="Excluir alérgenos" activeCount={draft.excludeAllergens.length}>
                <CheckboxList
                  items={allergens}
                  selected={draft.excludeAllergens}
                  onToggle={(slug) =>
                    setDraft((d) => ({
                      ...d,
                      excludeAllergens: d.excludeAllergens.includes(slug)
                        ? d.excludeAllergens.filter((a) => a !== slug)
                        : [...d.excludeAllergens, slug],
                    }))
                  }
                />
              </FilterSection>

              <FilterSection label="Tiempo máximo" activeCount={draft.maxTime > 0 ? 1 : 0}>
                <TimeSlider
                  value={draft.maxTime}
                  onChange={(v) => setDraft((d) => ({ ...d, maxTime: v }))}
                />
              </FilterSection>
            </div>

            {/* ── Section 2: Active filter tags ── */}
            {activeTags.length > 0 && (
              <div className="border-t border-slate-100 px-4 py-3 dark:border-slate-800">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Filtros activos
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activeTags.map((tag) => (
                    <ActiveTagPill key={tag.key} tag={tag} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Section 3: Actions ── */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 dark:border-slate-800">
            <button
              type="button"
              onClick={handleClearAll}
              className="text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              Limpiar todo
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {draftCount > 0 ? `Aplicar (${draftCount})` : "Aplicar"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
