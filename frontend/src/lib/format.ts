const currency = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

const longDate = new Intl.DateTimeFormat('en-NG', {
  weekday: 'short',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const shortDate = new Intl.DateTimeFormat('en-NG', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export function formatCurrency(amount: number): string {
  return currency.format(amount)
}

/** "Fri, 12 June 2026" — for confirmations and booking summaries. */
export function formatDate(iso: string): string {
  return longDate.format(parseIsoDate(iso))
}

/** "12 Jun 2026" — for tables and compact rows. */
export function formatDateShort(iso: string): string {
  return shortDate.format(parseIsoDate(iso))
}

/**
 * Date-only strings are parsed as UTC by the Date constructor, which shifts them a
 * day in western timezones. Splitting the parts keeps a check-in date on its date.
 */
function parseIsoDate(iso: string): Date {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (dateOnly) {
    return new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
  }
  return new Date(iso)
}

/** Returns today + `days` as an ISO date string, for date input min values. */
export function isoDate(days = 0): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return toIso(date)
}

export function addDays(iso: string, days: number): string {
  const date = parseIsoDate(iso)
  date.setDate(date.getDate() + days)
  return toIso(date)
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const start = parseIsoDate(checkIn).getTime()
  const end = parseIsoDate(checkOut).getTime()
  return Math.max(0, Math.round((end - start) / 86_400_000))
}

export function pluralise(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`
}

/** GUEST -> "Guest", CORPORATE_RETREAT -> "Corporate retreat". */
export function titleCase(value: string): string {
  const words = value.toLowerCase().replaceAll('_', ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function toIso(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
