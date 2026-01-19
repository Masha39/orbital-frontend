"use client"

import { useMemo, memo } from "react"

export interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  startItem: number
  endItem: number
  totalItems: number
}

export const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  startItem,
  endItem,
  totalItems,
}: PaginationControlsProps) {
  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis")[] = []
    
    for (let page = 1; page <= totalPages; page++) {
      const showPage =
        page === 1 ||
        page === totalPages ||
        (page >= currentPage - 1 && page <= currentPage + 1)

      if (showPage) {
        pages.push(page)
      } else {
        // Add ellipsis if needed, but avoid duplicates
        const lastItem = pages[pages.length - 1]
        if (lastItem !== "ellipsis" && (page === currentPage - 2 || page === currentPage + 2)) {
          pages.push("ellipsis")
        }
      }
    }

    return pages
  }, [currentPage, totalPages])

  return (
    <div className="flex items-center flex-col gap-4 pt-4">
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-9 w-9 items-center justify-center text-muted-foreground/60"
                >
                  ...
                </span>
              )
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`inline-flex items-center justify-center h-9 min-w-[36px] px-3 text-sm font-medium rounded-md transition-all active:scale-[0.98] ${
                  page === currentPage
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "border border-border/50 bg-background text-foreground hover:bg-muted/80 hover:border-border"
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            )
          })}
        </div>
      </div>

      <div className="text-xs text-muted-foreground w-full flex justify-end">
        Showing {startItem} - {endItem} of {totalItems} results
      </div>
    </div>
  )
})

