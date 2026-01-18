"use client"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import type { UsageItem } from "@/lib/usage-data"
import { formatDate } from "@/utils/format-date"
import { useMemo } from "react"

type TimeRange = "1d" | "3d" | "7d"

export function CreditUsageChart({ data, timeRange, setTimeRange }: { data: UsageItem[], timeRange: TimeRange, setTimeRange: (timeRange: TimeRange) => void }) {
  const { chartData, xAxisTicks } = useMemo(() => {
    if (!data || data.length === 0) return { chartData: [], xAxisTicks: [] }

    const sortedData = [...data].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    const mostRecentDate = new Date(sortedData[0].timestamp)
    
    // Calculate days to filter
    const daysAgo = timeRange === "1d" ? 1 : timeRange === "3d" ? 3 : timeRange === "7d" ? 7 : 0 
    const cutoffDate = new Date(mostRecentDate.getTime() - daysAgo * 24 * 60 * 60 * 1000)

    const filtered = sortedData.filter((item) => {
      const itemDate = new Date(item.timestamp)
      return itemDate >= cutoffDate
    })

    const mapped = filtered
      .reverse()
      .map((item) => ({
        messageId: item.message_id,
        creditsUsed: item.credits_used,
        reportName: item.report_name || "N/A",
        timestamp: item.timestamp,
      }))

    let ticks: string[] = []
    if (mapped.length > 0) {
      const desiredTickCount = Math.min(5, Math.max(4, mapped.length))
      
      if (mapped.length <= desiredTickCount) {
        ticks = mapped.map(item => item.timestamp)
      } else {
        const step = (mapped.length - 1) / (desiredTickCount - 1)
        ticks = []
        for (let i = 0; i < desiredTickCount; i++) {
          const index = Math.round(i * step)
          ticks.push(mapped[index].timestamp)
        }
      }
    }

    return { chartData: mapped, xAxisTicks: ticks }
  }, [data, timeRange])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="timestamp"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickFormatter={(value) => formatDate(value)}
            ticks={xAxisTicks}
          />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.6 }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border border-border/50 bg-popover px-3 py-2 shadow-xl">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-muted-foreground">Message #{data.messageId}</span>
                      <span className="text-sm font-semibold text-primary">{data.creditsUsed} credits</span>
                      {data.reportName !== "N/A" && (
                        <span className="text-xs text-muted-foreground">{data.reportName}</span>
                      )}
                      <span className="text-xs text-muted-foreground">{formatDate(data.timestamp)}</span>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="creditsUsed" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}