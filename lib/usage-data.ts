export interface UsageItem {
    message_id: number
    timestamp: string
    report_name?: string
    credits_used: number
  }
  
  export const usageData: UsageItem[] = [
    {
      message_id: 1000,
      timestamp: "2024-04-29T02:08:29.375Z",
      report_name: "Tenant Obligations Report",
      credits_used: 79,
    },
    {
      message_id: 1001,
      timestamp: "2024-04-29T03:25:03.613Z",
      credits_used: 5.8,
    },
    {
      message_id: 1002,
      timestamp: "2024-04-29T07:27:34.985Z",
      credits_used: 4.3,
    },
    {
      message_id: 1003,
      timestamp: "2024-04-29T10:22:13.926Z",
      credits_used: 3.4,
    },
    {
      message_id: 1004,
      timestamp: "2024-04-29T11:54:18.493Z",
      credits_used: 3.6,
    },
    {
      message_id: 1005,
      timestamp: "2024-04-29T14:12:45.123Z",
      report_name: "Usage Report",
      credits_used: 12.5,
    },
    {
      message_id: 1006,
      timestamp: "2024-04-29T16:33:21.987Z",
      credits_used: 6.2,
    },
    {
      message_id: 1007,
      timestamp: "2024-04-29T18:45:09.456Z",
      report_name: "Usage Report",
      credits_used: 8.9,
    },
  ]