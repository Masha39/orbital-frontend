"use client"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import type { UsageItem } from "@/lib/usage-data"

interface CreditUsageChartProps {
  data: UsageItem[]
}

export function CreditUsageChart({ data }: CreditUsageChartProps) {
  const chartData = data.map((item) => ({
    messageId: item.message_id,
    creditsUsed: item.credits_used,
    reportName: item.report_name || "N/A",
  }))

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="messageId"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickFormatter={(value) => `#${value}`}
          />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{data.creditsUsed} credits</span>
                      {data.reportName !== "N/A" && (
                        <span className="text-xs text-muted-foreground">{data.reportName}</span>
                      )}
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="creditsUsed" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
