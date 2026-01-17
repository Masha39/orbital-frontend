import type { UsageItem } from "@/lib/usage-data"

interface CreditUsageTableProps {
  data: UsageItem[]
}

export function CreditUsageTable({ data }: CreditUsageTableProps) {
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
    <div className="rounded-md border overflow-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[120px]">Message ID</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Timestamp</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Report Name</th>
            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Credits Used</th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.map((item) => (
            <tr key={item.message_id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-4 align-middle font-medium">#{item.message_id}</td>
              <td className="p-4 align-middle text-muted-foreground">{formatDate(item.timestamp)}</td>
              <td className="p-4 align-middle">
                {item.report_name ? (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                    {item.report_name}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="p-4 align-middle text-right font-medium">{item.credits_used}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
