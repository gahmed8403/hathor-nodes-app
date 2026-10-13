/** Demo chart data for the 2025–2026 blog posts. */
import { createRng, normal, round, walk } from './random'

/* LP stress test ------------------------------------------------------- */

/** Impermanent loss for a 50/50 pool when one asset moves by `pct` percent */
const impermanentLoss = (pct: number) => {
  const r = 1 + pct / 100
  return (2 * Math.sqrt(r)) / (1 + r) - 1
}

export function getLpStressTest() {
  const shocks = [-60, -40, -20, -10, 10, 20, 40, 60]
  const scenarios = shocks.map((s) => ({
    shock: `${s > 0 ? '+' : ''}${s}%`,
    il: round(impermanentLoss(s) * 100, 2),
    feesOffset: round(impermanentLoss(s) * 100 + 2.4, 2),
  }))

  // Monte Carlo of 90-day outcomes, bucketed into a histogram
  const rng = createRng('blog:lp-stress')
  const outcomes = Array.from({ length: 10_000 }, () => {
    const move = normal(rng, 0, 28)
    return impermanentLoss(Math.max(-95, move)) * 100 + 2.4 + normal(rng, 0, 0.6)
  })
  const edges = Array.from({ length: 17 }, (_, i) => -14 + i)
  const histogram = edges.map((e) => ({
    bucket: `${e}%`,
    paths: outcomes.filter((o) => o >= e && o < e + 1).length,
  }))
  const sorted = [...outcomes].sort((a, b) => a - b)
  return {
    scenarios,
    histogram,
    p5: round(sorted[Math.floor(sorted.length * 0.05)], 1),
    median: round(sorted[Math.floor(sorted.length * 0.5)], 1),
    lossProbability: round((outcomes.filter((o) => o < 0).length / outcomes.length) * 100, 0),
  }
}

/* AI governance analyst --------------------------------------------------- */

export function getGovernanceAnalyst() {
  const iterations = [
    { version: 'v1 · prompt only', accuracy: 71, flagged: 46 },
    { version: 'v2 · + proposal text', accuracy: 84, flagged: 31 },
    { version: 'v3 · + on-chain params', accuracy: 92, flagged: 18 },
    { version: 'v4 · + analyst review', accuracy: 98, flagged: 6 },
  ]
  const rng = createRng('blog:gov-analyst')
  const weeks = 20
  const manual = walk(rng, weeks, 95, 0, 0.06)
  const assisted = walk(rng, weeks, 70, -0.045, 0.07)
  const time = Array.from({ length: weeks }, (_, i) => ({
    week: `W${i + 1}`,
    manual: Math.round(manual[i]),
    assisted: Math.max(18, Math.round(assisted[i])),
  }))
  return { iterations, time }
}

/* Validator concentration follow-up -------------------------------------- */

export function getConcentrationSince2022() {
  const rng = createRng('blog:concentration-2026')
  const quarters: string[] = []
  for (let y = 2022; y <= 2026; y++) for (let q = 1; q <= 4; q++) if (!(y === 2026 && q > 2)) quarters.push(`Q${q} ${y}`)
  let nak = 5
  let top10 = 52
  const series = quarters.map((quarter, i) => {
    nak = Math.max(4, nak + (rng() < 0.38 ? 1 : 0) - (rng() < 0.12 ? 1 : 0))
    top10 = Math.max(31, top10 - 1.1 + normal(rng, 0, 1.4))
    return {
      quarter,
      nakamoto: i === quarters.length - 1 ? Math.max(nak, 11) : nak,
      top10: round(top10, 1),
    }
  })
  return { series, first: series[0], last: series[series.length - 1] }
}

/* Grounding experiment ----------------------------------------------------- */

export function getGroundingResults() {
  return {
    setups: [
      { setup: 'Prompt only', error: 38, unverifiable: 41 },
      { setup: 'Pasted data', error: 17, unverifiable: 22 },
      { setup: 'Tool access', error: 6, unverifiable: 4 },
      { setup: 'Tools + checks', error: 1.5, unverifiable: 1 },
    ],
    questions: 250,
  }
}

/* DAO treasury risk -------------------------------------------------------- */

export function getTreasuryRisk() {
  const composition = [
    { name: 'Native token', value: 64, color: '#e8b44c' },
    { name: 'Stablecoins', value: 18, color: '#3cc6b5' },
    { name: 'ATOM', value: 9, color: '#7193ff' },
    { name: 'LP positions', value: 6, color: '#a879ff' },
    { name: 'Other', value: 3, color: '#3b4459' },
  ]
  const months = 24
  const burn = 0.031
  const runway = Array.from({ length: months + 1 }, (_, m) => ({
    month: `M${m}`,
    base: round(Math.max(0, 100 - m * burn * 100 * 0.9), 1),
    drawdown: round(Math.max(0, 100 * (1 - 0.45 * Math.min(1, m / 3)) - m * burn * 100 * 0.9), 1),
    diversified: round(Math.max(0, 100 * (1 - 0.2 * Math.min(1, m / 3)) - m * burn * 100 * 0.9), 1),
  }))
  return { composition, runway }
}
