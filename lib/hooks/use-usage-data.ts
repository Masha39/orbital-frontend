import { useQuery } from "@tanstack/react-query"

export type UsageItem = {
  message_id: number
  timestamp: string
  report_name?: string
  credits_used: number
}

type UsageResponse = {
  usage: UsageItem[]
}

async function fetchUsageData(): Promise<UsageItem[]> {
  const response = await fetch("/api/usage")
  if (!response.ok) {
    throw new Error("Failed to fetch usage data")
  }
  const data: UsageResponse = await response.json()
  return data.usage
}

export function useUsageData() {
  return useQuery({
    queryKey: ["usage"],
    queryFn: fetchUsageData,
    staleTime: 60 * 1000, // 1 minute
  })
}

