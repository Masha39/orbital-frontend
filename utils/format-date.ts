import { format } from "date-fns" 

export const formatDate = (timestamp: string) => {
  return format(new Date(timestamp), "dd-MM-yyyy HH:mm")
}