import { format } from 'date-fns'

export function formatDate(date, pattern = 'MMM dd, yyyy') {
  return format(date, pattern)
}
