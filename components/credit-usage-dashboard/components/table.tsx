"use client"

import { useState } from "react"
import type { UsageItem } from "@/lib/usage-data"
import { formatDate } from "@/utils/format-date"

const ITEMS_PER_PAGE = 10

export function CreditUsageTable({ data }: { data: UsageItem[] }) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedData = data.slice(startIndex, endIndex)

  const startItem = totalItems === 0 ? 0 : startIndex + 1
  const endItem = Math.min(endIndex, totalItems)

  return (
    <div className="space-y-4">
      <div className="overflow-auto rounded-lg border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-muted/30">
              <th className="h-10 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">
                ID
              </th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">
                Timestamp
              </th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">
                Report
              </th>
              <th className="h-10 px-4 text-right font-medium text-muted-foreground text-xs uppercase tracking-wider">
                Credits
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={item.message_id}
                className="border-b border-border/30 transition-colors hover:bg-muted/20 last:border-0 h-[57px]"
              >
                <td className="p-4 font-mono text-xs text-muted-foreground">#{item.message_id}</td>
                <td className="p-4 text-muted-foreground text-xs">{formatDate(item.timestamp)}</td>
                <td className="p-4">
                  {item.report_name ? (
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                      {item.report_name}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/50">—</span>
                  )}
                </td>
                <td className="p-4 text-right font-mono text-sm font-medium tabular-nums">{item.credits_used}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center flex-col gap-4 pt-4">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const showPage =
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)

                if (!showPage) {
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span
                        key={page}
                        className="flex h-9 w-9 items-center justify-center text-muted-foreground/60"
                      >
                        ...
                      </span>
                    )
                  }
                  return null
                }

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
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
      )}
    </div>
  )
}
