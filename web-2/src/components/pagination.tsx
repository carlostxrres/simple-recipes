"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
}

export function Pagination({ currentPage, totalPages, total }: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `/?${params.toString()}`;
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4"
      aria-label="Paginación"
    >
      <p className="text-sm text-text-secondary">
        Mostrando página <span className="font-medium">{currentPage}</span> de{" "}
        <span className="font-medium">{totalPages}</span> ({total} recetas)
      </p>

      <div className="flex items-center gap-1">
        {/* Previous button */}
        <Button
          variant="ghost"
          size="icon-sm"
          asChild={currentPage > 1}
          disabled={currentPage <= 1}
        >
          {currentPage > 1 ? (
            <Link href={createPageUrl(currentPage - 1)} aria-label="Página anterior">
              <IconChevronLeft className="w-4 h-4" />
            </Link>
          ) : (
            <span>
              <IconChevronLeft className="w-4 h-4" />
            </span>
          )}
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) =>
            page === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-text-secondary"
              >
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "ghost"}
                size="icon-sm"
                asChild={page !== currentPage}
                className={cn(
                  page === currentPage && "pointer-events-none"
                )}
              >
                {page === currentPage ? (
                  <span>{page}</span>
                ) : (
                  <Link href={createPageUrl(page)}>{page}</Link>
                )}
              </Button>
            )
          )}
        </div>

        {/* Next button */}
        <Button
          variant="ghost"
          size="icon-sm"
          asChild={currentPage < totalPages}
          disabled={currentPage >= totalPages}
        >
          {currentPage < totalPages ? (
            <Link href={createPageUrl(currentPage + 1)} aria-label="Página siguiente">
              <IconChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span>
              <IconChevronRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </div>
    </motion.nav>
  );
}
