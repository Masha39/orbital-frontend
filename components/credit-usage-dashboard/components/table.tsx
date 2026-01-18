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
          {data.map((item, index) => (
            <tr
              key={item.message_id}
              className="border-b border-border/30 transition-colors hover:bg-muted/20 last:border-0"
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
  )
}
