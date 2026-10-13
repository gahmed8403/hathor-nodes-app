/**
 * Deterministic pseudo-random helpers. All mock data is generated from a seed
 * so the server-rendered HTML and the client always agree, and numbers stay
 * stable between visits.
 */
export type Rng = () => number

export function createRng(seed: string | number): Rng {
  let h = typeof seed === 'number' ? seed : hashString(seed)
  // mulberry32
  return () => {
    h |= 0
    h = (h + 0x6d2b79f5) | 0
    let t = Math.imul(h ^ (h >>> 15), 1 | h)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(s: string) {
  let h = 1779033703 ^ s.length
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return h >>> 0
}

export const between = (rng: Rng, min: number, max: number) => min + rng() * (max - min)
export const intBetween = (rng: Rng, min: number, max: number) => Math.floor(between(rng, min, max + 1))
export const pick = <T,>(rng: Rng, items: readonly T[]) => items[Math.floor(rng() * items.length)]

/** Box–Muller normal sample */
export function normal(rng: Rng, mean = 0, sd = 1) {
  const u = Math.max(rng(), 1e-9)
  const v = rng()
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

/** A smooth random walk, useful for time series */
export function walk(rng: Rng, length: number, start: number, drift = 0, volatility = 0.04) {
  const out: number[] = []
  let v = start
  for (let i = 0; i < length; i++) {
    out.push(v)
    v = Math.max(0, v * (1 + drift + normal(rng, 0, volatility)))
  }
  return out
}

export const round = (n: number, digits = 0) => {
  const f = 10 ** digits
  return Math.round(n * f) / f
}

/** Sample skewness and (non-excess) kurtosis */
export function moments(values: number[]) {
  const n = values.length
  const mean = values.reduce((a, b) => a + b, 0) / n
  const m2 = values.reduce((a, b) => a + (b - mean) ** 2, 0) / n
  const m3 = values.reduce((a, b) => a + (b - mean) ** 3, 0) / n
  const m4 = values.reduce((a, b) => a + (b - mean) ** 4, 0) / n
  const sorted = [...values].sort((a, b) => a - b)
  const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2
  return { mean, median, skew: m3 / m2 ** 1.5, kurtosis: m4 / m2 ** 2 }
}
