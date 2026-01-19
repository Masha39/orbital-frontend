"use client"

import { useState, useMemo, useEffect, useCallback, useRef, startTransition } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { UsageItem } from "@/hooks/use-usage-data"
import { formatDate } from "@/utils/format-date"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Pagination } from "@/components/ui/pagination"

const ITEMS_PER_PAGE = 10

type SortState = "asc" | "desc" | null
type SortableColumn = "report_name" | "credits_used"

const getNextSortState = (current: SortState): SortState => {
  if (current === null) return "asc"
  if (current === "asc") return "desc"
  return null
}

const getSortIcon = (sortState: SortState) => {
  if (sortState === "asc") return <ArrowUp className="ml-1.5 h-3.5 w-3.5" />
  if (sortState === "desc") return <ArrowDown className="ml-1.5 h-3.5 w-3.5" />
  return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-40" />
}

export function CreditUsageTable({ data }: { data: UsageItem[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isUpdatingRef = useRef(false)
  const lastSyncedPageRef = useRef<number | null>(null)

  const reportNameSort = (searchParams.get("sort_report") as SortState) || null
  const creditsSort = (searchParams.get("sort_credits") as SortState) || null
  
  const urlPage = searchParams.get("page")
  const initialPage = urlPage ? Math.max(1, parseInt(urlPage, 10)) : 1
  const [currentPage, setCurrentPage] = useState(initialPage)
  
  if (lastSyncedPageRef.current === null) {
    lastSyncedPageRef.current = initialPage
  }

  const updateURL = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    isUpdatingRef.current = true
    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false })
    })
  }, [searchParams, router])

  const handleSort = (column: SortableColumn) => {
    const currentSort = column === "report_name" ? reportNameSort : creditsSort
    const nextSort = getNextSortState(currentSort)
    const paramKey = column === "report_name" ? "sort_report" : "sort_credits"
    
    setCurrentPage(1)
    updateURL({ [paramKey]: nextSort, page: "1" })
  }

  const totalItems = data.length
  const totalPages = useMemo(() => Math.ceil(totalItems / ITEMS_PER_PAGE), [totalItems])

  // Sync page from URL and validate
  useEffect(() => {
    if (isUpdatingRef.current) {
      isUpdatingRef.current = false
      return
    }
    
    const urlPage = searchParams.get("page")
    const page = urlPage ? Math.max(1, parseInt(urlPage, 10)) : 1
    const validPage = page > totalPages && totalPages > 0 ? 1 : page
    
    if (validPage !== lastSyncedPageRef.current) {
      setCurrentPage(validPage)
      lastSyncedPageRef.current = validPage
      if (page > totalPages && totalPages > 0) {
        isUpdatingRef.current = true
        updateURL({ page: "1" })
      }
    }
  }, [searchParams, totalPages, updateURL])
  
  // Keep ref in sync with state when we update it directly
  useEffect(() => {
    lastSyncedPageRef.current = currentPage
  }, [currentPage])

  const paginationData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return {
      paginatedData: data.slice(startIndex, endIndex),
      startItem: totalItems === 0 ? 0 : startIndex + 1,
      endItem: Math.min(endIndex, totalItems),
    }
  }, [data, currentPage, totalItems])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    updateURL({ page: page.toString() })
  }, [updateURL])

  return (
    <div className="space-y-4">
      <div className="overflow-auto rounded-lg border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-muted/30">
              <th className="h-10 px-4 text-left font-medium text-muted-foreground text-xs tracking-wider">
                Message ID
              </th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground text-xs tracking-wider">
                Date & Time
              </th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">
                <button
                  onClick={() => handleSort("report_name")}
                  className="flex items-center hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Sort by report name"
                >
                  Report
                  {getSortIcon(reportNameSort)}
                </button>
              </th>
              <th className="h-10 px-4 text-right font-medium text-muted-foreground text-xs uppercase tracking-wider">
                <button
                  onClick={() => handleSort("credits_used")}
                  className="flex items-center justify-end ml-auto hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Sort by credits used"
                >
                  Credits
                  {getSortIcon(creditsSort)}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginationData.paginatedData.map((item) => (
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
                <td className="p-4 text-right font-mono text-sm font-medium tabular-nums">
                  {item.credits_used.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          startItem={paginationData.startItem}
          endItem={paginationData.endItem}
          totalItems={totalItems}
        />
      )}
    </div>
  )
}