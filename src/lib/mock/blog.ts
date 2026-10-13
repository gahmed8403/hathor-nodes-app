import { createRng, normal, round } from './random'

const DAY = 86_400_000

/** Linear interpolation through [index, value] anchor points */
function through(anchors: [number, number][], i: number) {
  for (let a = 0; a < anchors.length - 1; a++) {
    const [x0, y0] = anchors[a]
    const [x1, y1] = anchors[a + 1]
    if (i >= x0 && i <= x1) return y0 + ((i - x0) / (x1 - x0)) * (y1 - y0)
  }
  return anchors[anchors.length - 1][1]
}

/* ------------------------------------------------------------------ */
/* Validator parity                                                    */
/* ------------------------------------------------------------------ */

export function getValidatorParitySeries() {
  const rng = createRng('blog:validator-parity')
  const samples = 110 // every 25,000 blocks → block 2,750,000
  const rows = Array.from({ length: samples }, (_, i) => {
    const t = i / (samples - 1)
    const block = (i + 1) * 25_000
    const skew = 4.15 - 0.35 * t + normal(rng, 0, 0.12) + (i < 6 ? 0.6 - i * 0.1 : 0)
    const kurtosis = 31 - 10 * t + normal(rng, 0, 1.1) + (i < 6 ? 6 - i : 0)
    return { block: block.toLocaleString('en-US'), skew: round(skew, 2), kurtosis: round(kurtosis, 1), normal: 3 }
  })
  return { rows, mean: 681_939, median: 184_210 }
}

/* ------------------------------------------------------------------ */
/* Impermanent loss — GAMM-573 (BTSG/OSMO)                             */
/* ------------------------------------------------------------------ */

export function getGamm573Series() {
  const rng = createRng('blog:gamm-573')
  const startBlock = 1_800_000
  const endBlock = 2_620_000
  const step = 20_000
  const n = (endBlock - startBlock) / step + 1

  // Endpoints from the article table (per 1 GAMM share, in micro-denoms)
  const start = { btsg: 0.822, osmo: 0.0735, pBtsg: 0.483, pOsmo: 5.4 }
  const end = { btsg: 0.977, osmo: 0.0636, pBtsg: 0.42, pOsmo: 6.46 }
  const k0 = start.btsg * start.osmo
  const k1 = end.btsg * end.osmo

  // Bridged noise so both endpoints land exactly on the table values
  let wBtsg = 0
  let wOsmo = 0
  const rows = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1)
    const bridge = Math.sin(Math.PI * t)
    wBtsg += normal(rng, 0, 0.035)
    wOsmo += normal(rng, 0, 0.03)
    // BTSG dips harder mid-period, then partially recovers
    const pBtsg = (start.pBtsg + (end.pBtsg - start.pBtsg) * t) * (1 - 0.22 * bridge + 0.12 * wBtsg * bridge)
    const pOsmo = (start.pOsmo + (end.pOsmo - start.pOsmo) * t) * (1 + 0.1 * bridge + 0.1 * wOsmo * bridge)
    const k = k0 + (k1 - k0) * t // swap fees slowly grow the pool invariant
    const ratio = pOsmo / pBtsg
    const btsg = Math.sqrt(k * ratio)
    const osmo = Math.sqrt(k / ratio)
    const usd = btsg * pBtsg + osmo * pOsmo // USD per 1,000,000 GAMM shares
    return {
      block: (startBlock + i * step).toLocaleString('en-US'),
      btsg: round(btsg, 4),
      osmo: round(osmo, 5),
      usd: round(usd, 4),
    }
  })
  // Pin endpoints exactly
  rows[0] = { ...rows[0], btsg: start.btsg, osmo: start.osmo, usd: 0.794 }
  rows[n - 1] = { ...rows[n - 1], btsg: end.btsg, osmo: end.osmo, usd: 0.821 }
  return rows
}

/* ------------------------------------------------------------------ */
/* Value of an Osmo                                                    */
/* ------------------------------------------------------------------ */

export function getOsmoValueSeries() {
  const rng = createRng('blog:value-of-osmo')
  const start = new Date('2021-10-01T00:00:00Z').getTime()
  const days = 136 // → Feb 13, 2022 epoch
  const price = Array.from({ length: days }, (_, i) => {
    const base = through(
      [
        [0, 4.9],
        [35, 6.6],
        [55, 10.2],
        [80, 8.3],
        [105, 6.9],
        [135, 8.4],
      ],
      i,
    )
    const date = new Date(start + i * DAY).toISOString().slice(0, 10)
    const actual = Math.max(3, base * (1 + normal(rng, 0, 0.035)))
    const full = 1.45 + 0.21 * Math.min(1, i / 55) // 100% of non-OSMO TVL migrates
    const bear = 0.78 - 0.07 * (i / days) // TVL leaves, adoption slows
    return {
      date,
      actual: round(actual, 2),
      bullish: round(base * full, 2),
      half: round(base * (1 + (full - 1) / 2), 2),
      bearish: round(base * bear, 2),
    }
  })

  const tvlStart = new Date('2021-10-25T00:00:00Z').getTime()
  const weeks = 17
  const pairedShare = Array.from({ length: weeks }, (_, i) => ({
    date: new Date(tvlStart + i * 7 * DAY).toISOString().slice(0, 10),
    paired: round(50 + (14.6 * i) / (weeks - 1) + normal(rng, 0, 0.7), 1),
  }))
  pairedShare[0].paired = 50.2
  pairedShare[weeks - 1].paired = 64.8

  return { price, pairedShare }
}
