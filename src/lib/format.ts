export { clsx as cn } from 'clsx'

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
const whole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const usdCompact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
})
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export const fmtCompact = (n: number) => compact.format(n)
export const fmtInt = (n: number) => whole.format(n)
export const fmtUsd = (n: number) => usd.format(n)
export const fmtUsdCompact = (n: number) => usdCompact.format(n)
export const fmtPct = (n: number, digits = 1) => `${n.toFixed(digits)}%`
export const fmtSignedPct = (n: number, digits = 1) => `${n >= 0 ? '+' : ''}${n.toFixed(digits)}%`
