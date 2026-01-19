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

type SortParams = {
  sortBy?: string[]
  order?: string[]
}

async function fetchUsageData(sortParams?: SortParams): Promise<UsageItem[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/usage`)
  
  sortParams?.sortBy?.forEach((sortBy, index) => {
    url.searchParams.append("sort_by", sortBy)
    if (sortParams.order?.[index]) {
      url.searchParams.append("order", sortParams.order[index])
    }
  })
  
  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error("Failed to fetch usage data")
  }
  const data: UsageResponse = await response.json()
  return data.usage
}

export function useUsageData(sortParams?: SortParams) {
  return useQuery({
    queryKey: ["usage", sortParams],
    queryFn: () => fetchUsageData(sortParams),
    staleTime: 60 * 1000,
  })
}

