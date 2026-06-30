import Link from "next/link"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  /** Path to use for links, e.g. "/recipes" */
  basePath: string
  /** Current URL search params — all are preserved except "page" which is replaced */
  searchParams: Record<string, string | string[] | undefined>
}

function buildUrl(
  basePath: string,
  page: number,
  params: Record<string, string | string[] | undefined>,
): string {
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (!v || k === "page") {
      continue
    }
    if (Array.isArray(v)) {
      v.forEach((val) => p.append(k, val))
    } else {
      p.set(k, v)
    }
  }
  if (page > 1) {
    p.set("page", String(page))
  }
  const qs = p.toString()
  return `${basePath}${qs ? `?${qs}` : ""}`
}

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | "…")[] = [1]

  if (current > 3) {
    pages.push("…")
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) {
    pages.push("…")
  }

  pages.push(total)
  return pages
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
}: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages)

  const prevDisabled = currentPage <= 1
  const nextDisabled = currentPage >= totalPages

  const navItemBase =
    "flex h-9 w-9 items-center justify-center rounded-full border text-sm transition"
  const navItemActive =
    "border-transparent bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
  const navItemDefault =
    "border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:text-slate-100"
  const navItemDisabled =
    "pointer-events-none border-slate-100 text-slate-300 dark:border-slate-800 dark:text-slate-700"

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-1">
      <Link
        href={buildUrl(basePath, currentPage - 1, searchParams)}
        aria-label="Página anterior"
        aria-disabled={prevDisabled}
        className={`${navItemBase} ${prevDisabled ? navItemDisabled : navItemDefault}`}
      >
        <IconChevronLeft className="h-4 w-4" />
      </Link>

      {pages.map((page, i) =>
        page === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 text-center text-sm text-slate-400 dark:text-slate-600"
          >
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildUrl(basePath, page, searchParams)}
            aria-label={`Página ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={`${navItemBase} ${
              page === currentPage ? navItemActive : navItemDefault
            }`}
          >
            {page}
          </Link>
        ),
      )}

      <Link
        href={buildUrl(basePath, currentPage + 1, searchParams)}
        aria-label="Página siguiente"
        aria-disabled={nextDisabled}
        className={`${navItemBase} ${nextDisabled ? navItemDisabled : navItemDefault}`}
      >
        <IconChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  )
}
