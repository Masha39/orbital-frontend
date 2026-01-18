export const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-GB", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }