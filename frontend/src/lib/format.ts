const currency = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

export function formatCurrency(amount: number): string {
  return currency.format(amount)
}

/** Returns today + `days` as an ISO date string, for date input min values. */
export function isoDate(days = 0): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}
