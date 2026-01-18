"use client"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import type { UsageItem } from "@/lib/usage-data"

export function CreditUsageChart({ data }: { data: UsageItem[] }) {
  const chartData = data.map((item) => ({
    messageId: item.message_id,
    creditsUsed: item.credits_used,
    reportName: item.report_name || "N/A",
    timestamp: item.timestamp,
  })).slice(0, 10)

  // TODO: create a util fn 
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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
