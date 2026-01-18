"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditUsageChart } from "./components/chart"
import { CreditUsageTable } from "./components/table"
import { useUsageData, type UsageItem } from "@/lib/hooks/use-usage-data"
import { useState } from "react"

type TimeRange = "1d" | "3d" | "7d"

export function CreditUsageDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("1d")
  
  const { data: usageData, isLoading, error } = useUsageData()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Credit Usage Dashboard</h1>
          <p className="text-muted-foreground">Track your credit consumption across messages and reports</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading usage data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Credit Usage Dashboard</h1>
          <p className="text-muted-foreground">Track your credit consumption across messages and reports</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading usage data. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!usageData || usageData.length === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Credit Usage Dashboard</h1>
          <p className="text-muted-foreground">Track your credit consumption across messages and reports</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No usage data available.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalCredits = usageData.reduce((sum: number, item) => sum + item.credits_used, 0)
  const avgCredits = totalCredits / usageData.length

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Credit Usage Dashboard</h1>
        <p className="text-muted-foreground">Track your credit consumption across messages and reports</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total Credits Used</CardDescription>
            <CardTitle className="text-2xl">{totalCredits.toFixed(1)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Messages</CardDescription>
            <CardTitle className="text-2xl">{usageData.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Average Credits/Message</CardDescription>
            <CardTitle className="text-2xl">{avgCredits.toFixed(1)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-base font-medium">Usage Over Time</CardTitle>
            <CardDescription className="text-xs">Credit consumption per message</CardDescription>
          </div>
          
          <div className="inline-flex items-center rounded-lg bg-muted p-1">
            <TimeRangeButton timeRange="1d" setTimeRange={setTimeRange} currentTimeRange={timeRange} />
            <TimeRangeButton timeRange="3d" setTimeRange={setTimeRange} currentTimeRange={timeRange} />
            <TimeRangeButton timeRange="7d" setTimeRange={setTimeRange} currentTimeRange={timeRange} />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <CreditUsageChart data={usageData} timeRange={timeRange} setTimeRange={setTimeRange} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage Details</CardTitle>
          <CardDescription>Detailed breakdown of credit usage by message</CardDescription>
        </CardHeader>
        <CardContent>
          <CreditUsageTable data={usageData} />
        </CardContent>
      </Card>
    </div>
  )
}



const TimeRangeButton = ({ timeRange, setTimeRange, currentTimeRange }: { timeRange: TimeRange, setTimeRange: (timeRange: TimeRange) => void, currentTimeRange: TimeRange }) => {
  return (
    <button
      onClick={() => setTimeRange(timeRange)}
      className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-md cursor-pointer ${
        timeRange === currentTimeRange
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {timeRange}
    </button>
  )
} 