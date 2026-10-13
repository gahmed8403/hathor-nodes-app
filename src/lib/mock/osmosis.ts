import { createRng, between, intBetween, normal, walk, round } from './random'
import { getGovernance } from './governance'

import { DAY, END, dateLabel } from './dates'

/** SuperFluid Staking went live on Osmosis in early 2022 */
const SFS_START = new Date('2022-02-15T00:00:00Z').getTime()

/* ------------------------------------------------------------------ */
/* Liquidity provider                                                 */
/* ------------------------------------------------------------------ */

const TOKENS: { symbol: string; name: string; price: number; tvl: number; color: string }[] = [
  { symbol: 'ATOM', name: 'Cosmos Hub', price: 7.2, tvl: 38_400_000, color: '#7193ff' },
  { symbol: 'USDC', name: 'USD Coin', price: 1, tvl: 21_700_000, color: '#3cc6b5' },
  { symbol: 'WETH', name: 'Wrapped Ether', price: 3420, tvl: 9_800_000, color: '#9db4ff' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', price: 97_200, tvl: 7_900_000, color: '#e8b44c' },
  { symbol: 'TIA', name: 'Celestia', price: 5.1, tvl: 6_300_000, color: '#a879ff' },
  { symbol: 'stATOM', name: 'Stride Staked ATOM', price: 10.1, tvl: 5_200_000, color: '#f0705a' },
  { symbol: 'AKT', name: 'Akash', price: 3.4, tvl: 3_100_000, color: '#ff9f8a' },
  { symbol: 'JUNO', name: 'Juno', price: 0.21, tvl: 1_900_000, color: '#ff5fa2' },
  { symbol: 'STARS', name: 'Stargaze', price: 0.006, tvl: 1_450_000, color: '#7fe3d3' },
  { symbol: 'SCRT', name: 'Secret', price: 0.42, tvl: 1_200_000, color: '#b8b4aa' },
  { symbol: 'HUAHUA', name: 'Chihuahua', price: 0.00004, tvl: 610_000, color: '#f2cd72' },
  { symbol: 'BTSG', name: 'Bitsong', price: 0.0042, tvl: 380_000, color: '#d4962a' },
  { symbol: 'REGEN', name: 'Regen', price: 0.031, tvl: 290_000, color: '#a3c76b' },
  { symbol: 'XPRT', name: 'Persistence', price: 0.13, tvl: 240_000, color: '#6d6b68' },
]

export type TokenLiquidity = {
  symbol: string
  name: string
  color: string
  rank: number
  tvl: number
  today: number
  d7: number
  d30: number
  d90: number
  change7d: number
}

export function getLiquidity() {
  const rng = createRng('osmosis:liquidity')
  const osmoPrice = 0.52

  const tokens: TokenLiquidity[] = TOKENS.map((t) => {
    const amount = t.tvl / t.price
    const d7 = amount * (1 + normal(rng, 0, 0.06))
    const d30 = amount * (1 + normal(rng, 0.03, 0.12))
    const d90 = amount * (1 + normal(rng, 0.08, 0.2))
    return {
      symbol: t.symbol,
      name: t.name,
      color: t.color,
      rank: 0,
      tvl: t.tvl,
      today: amount,
      d7,
      d30,
      d90,
      change7d: round(((amount - d7) / d7) * 100, 1),
    }
  })
    .sort((a, b) => b.tvl - a.tvl)
    .map((t, i) => ({ ...t, rank: i + 1 }))

  const nonOsmoTvl = tokens.reduce((a, t) => a + t.tvl, 0)
  const osmoInPools = nonOsmoTvl / osmoPrice

  // Underlying assets — top 6 plus "Other"
  const top = tokens.slice(0, 6)
  const otherTvl = tokens.slice(6).reduce((a, t) => a + t.tvl, 0)
  const underlying = [
    ...top.map((t) => ({ name: t.symbol, value: t.tvl, color: t.color })),
    { name: 'Other', value: otherTvl, color: '#3b4459' },
  ]

  // 120-day exposure history, stacked by token (top 5 + other)
  const days = 180
  const series = top.slice(0, 5).map((t) => ({
    symbol: t.symbol,
    values: walk(rng, days, t.tvl * between(rng, 0.7, 0.9), 0.0025, 0.025),
  }))
  const otherSeries = walk(rng, days, (otherTvl + top[5].tvl) * 0.8, 0.002, 0.03)
  const exposure = Array.from({ length: days }, (_, i) => {
    const row: Record<string, number | string> = { date: dateLabel(END - (days - 1 - i) * DAY) }
    series.forEach((s) => (row[s.symbol] = Math.round(s.values[i])))
    row.Other = Math.round(otherSeries[i])
    return row
  })

  // Pools for fun facts
  const pools = [
    { id: 1, name: 'ATOM/OSMO', sfsBonded: 61.2, osmoChange: 1_240_000 },
    { id: 678, name: 'USDC/OSMO', sfsBonded: 38.4, osmoChange: 2_960_000 },
    { id: 704, name: 'WETH/OSMO', sfsBonded: 27.9, osmoChange: -410_000 },
    { id: 803, name: 'stATOM/OSMO', sfsBonded: 44.6, osmoChange: 780_000 },
  ]
  const biggestMover = [...tokens].sort((a, b) => Math.abs(b.change7d) - Math.abs(a.change7d))[0]
  const largestSfs = [...pools].sort((a, b) => b.sfsBonded - a.sfsBonded)[0]
  const largestOsmoChange = [...pools].sort((a, b) => Math.abs(b.osmoChange) - Math.abs(a.osmoChange))[0]

  return {
    osmoPrice,
    nonOsmoTvl,
    nonOsmoTvlChange: 4.8,
    assetsInPools: 1_482,
    osmoInPools,
    osmoInPoolsChange: -1.9,
    tokens,
    underlying,
    exposure,
    exposureKeys: [...series.map((s) => s.symbol), 'Other'],
    exposureColors: [...top.slice(0, 5).map((t) => t.color), '#3b4459'],
    funFacts: [
      { label: 'Token with most TVL', value: `${tokens[0].symbol} · $${(tokens[0].tvl / 1e6).toFixed(1)}M` },
      { label: 'Largest % change in liquidity (7d)', value: `${biggestMover.symbol} · ${biggestMover.change7d > 0 ? '+' : ''}${biggestMover.change7d}%` },
      { label: 'Pool with largest % SFS bonded', value: `#${largestSfs.id} ${largestSfs.name} · ${largestSfs.sfsBonded}%` },
      {
        label: 'Largest change in OSMO bonded',
        value: `#${largestOsmoChange.id} ${largestOsmoChange.name} · ${largestOsmoChange.osmoChange > 0 ? '+' : ''}${(largestOsmoChange.osmoChange / 1e6).toFixed(2)}M`,
      },
    ],
  }
}

/* ------------------------------------------------------------------ */
/* SuperFluid staking                                                 */
/* ------------------------------------------------------------------ */

export function getSuperfluid() {
  const rng = createRng('osmosis:sfs')
  const gov = getGovernance('osmosis')
  const epochs = Math.round((END - SFS_START) / DAY)

  const pools = [
    { name: '#1 ATOM/OSMO', staked: 18_400_000 },
    { name: '#678 USDC/OSMO', staked: 9_100_000 },
    { name: '#803 stATOM/OSMO', staked: 6_300_000 },
    { name: '#704 WETH/OSMO', staked: 4_800_000 },
    { name: '#712 WBTC/OSMO', staked: 3_900_000 },
    { name: '#1093 TIA/OSMO', staked: 2_700_000 },
    { name: '#3 AKT/OSMO', staked: 1_450_000 },
    { name: '#497 JUNO/OSMO', staked: 820_000 },
    { name: '#604 STARS/OSMO', staked: 610_000 },
    { name: '#584 SCRT/OSMO', staked: 380_000 },
  ]
  const totalSfs = pools.reduce((a, p) => a + p.staked, 0)

  const validators = gov.validators
    .filter((v) => v.status === 'Active')
    .map((v) => {
      const total = v.votingPower * 4.2
      const pct = Math.min(78, Math.max(0.4, rng() ** 1.6 * 55))
      return {
        moniker: v.moniker,
        delegators: intBetween(rng, 40, 9_000),
        sfsStaked: Math.round((total * pct) / 100),
        totalStaked: Math.round(total),
        sfsShare: round(pct, 1),
      }
    })
    .sort((a, b) => b.sfsStaked - a.sfsStaked)

  // Validator stake was scaled for display; rescale so the SFS column sums to the pools total
  const scale = totalSfs / validators.reduce((a, v) => a + v.sfsStaked, 0)
  validators.forEach((v) => {
    v.sfsStaked = Math.round(v.sfsStaked * scale)
    v.totalStaked = Math.round(v.totalStaked * scale)
  })
  const totalStaked = validators.reduce((a, v) => a + v.totalStaked, 0)

  const weeks = Math.floor((END - SFS_START) / (7 * DAY)) + 1
  const sfsWalk = walk(rng, weeks, totalSfs * 0.08, 0.009, 0.02)
  const stakedWalk = walk(rng, weeks, (totalStaked - totalSfs) * 0.7, 0.0012, 0.01)
  // Scale both walks so the latest snapshot matches the headline numbers
  const sfsScale = totalSfs / sfsWalk[weeks - 1]
  const stakedScale = (totalStaked - totalSfs) / stakedWalk[weeks - 1]
  const overTime = Array.from({ length: weeks }, (_, i) => ({
    date: dateLabel(END - (weeks - 1 - i) * 7 * DAY),
    staked: Math.round(stakedWalk[i] * stakedScale),
    superfluid: Math.round(sfsWalk[i] * sfsScale),
  }))

  const majority = validators.filter((v) => v.sfsShare > 50)
  const topShare = [...validators].sort((a, b) => b.sfsShare - a.sfsShare)[0]
  const topDelegations = [...validators].sort((a, b) => b.delegators - a.delegators)[0]

  return {
    totalSfs,
    totalStaked,
    sfsShareOfStake: round((totalSfs / totalStaked) * 100, 1),
    poolsEnabled: pools.length + 24,
    poolsEnabledChange: 6.3,
    epochs,
    pools,
    validators,
    overTime,
    byType: [
      { name: 'Standard staking', value: totalStaked - totalSfs, color: '#7193ff' },
      { name: 'SuperFluid staking', value: totalSfs, color: '#e8b44c' },
    ],
    funFacts: [
      { label: 'Largest # of OSMO SuperFluid staked', value: `${validators[0].moniker} · ${(validators[0].sfsStaked / 1e6).toFixed(2)}M` },
      { label: 'Largest # of SFS delegations', value: `${topDelegations.moniker} · ${topDelegations.delegators.toLocaleString('en-US')}` },
      { label: 'Largest % of stake from SFS', value: `${topShare.moniker} · ${topShare.sfsShare}%` },
      { label: 'Validators with majority SFS stake', value: String(majority.length) },
    ],
  }
}

/* ------------------------------------------------------------------ */
/* Incentives optimization research                                   */
/* ------------------------------------------------------------------ */

export function getIncentives() {
  const rng = createRng('osmosis:incentives')
  const names = [
    'ATOM/OSMO', 'USDC/OSMO', 'WETH/OSMO', 'WBTC/OSMO', 'TIA/OSMO', 'stATOM/OSMO', 'AKT/OSMO', 'JUNO/OSMO',
    'STARS/OSMO', 'SCRT/OSMO', 'HUAHUA/OSMO', 'BTSG/OSMO', 'REGEN/OSMO', 'XPRT/OSMO', 'stOSMO/OSMO',
    'DYDX/OSMO', 'INJ/OSMO', 'NTRN/OSMO', 'KAVA/OSMO', 'EVMOS/OSMO', 'CRO/OSMO', 'UMEE/OSMO',
  ]
  const pools = names.map((name, i) => {
    const incentives = Math.exp(normal(rng, 9.4, 1.1)) // USD / week
    // diminishing returns: liquidity ≈ k * incentives^0.55, plus organic base
    const organic = Math.exp(normal(rng, 12.6, 1.3))
    const k = between(rng, 900, 2600)
    const liquidity = organic + k * incentives ** 0.55
    const volume = 3 * liquidity * between(rng, 0.04, 0.6) ** 1.3
    const fees = volume * 0.003
    return {
      pool: name,
      id: [1, 678, 704, 712, 1093, 803, 3, 497, 604, 584, 605, 573, 42, 15, 833, 1246, 725, 1408, 730, 722, 9, 641][i],
      incentives: Math.round(incentives),
      liquidity: Math.round(liquidity),
      volume: Math.round(volume),
      efficiency: round(liquidity / incentives, 0),
      feeCoverage: round((fees * 7) / incentives * 100, 1),
      organic,
    }
  })
  const totalIncentives = pools.reduce((a, p) => a + p.incentives, 0)
  const totalLiquidity = pools.reduce((a, p) => a + p.liquidity, 0)
  const over = pools.filter((p) => p.feeCoverage < 25).length
  // Fit an aggregate diminishing-returns curve: liquidity = organic + k * budget^0.55
  const organic = pools.reduce((a, p) => a + p.organic, 0)
  const k = (totalLiquidity - organic) / totalIncentives ** 0.55
  return {
    pools: pools.map(({ organic: _o, ...p }) => p),
    totalIncentives,
    totalLiquidity,
    overIncentivized: over,
    curve: { organic, k, exponent: 0.55 },
  }
}

/** Projected liquidity (USD) for a weekly incentive budget, from the fitted curve */
export function projectLiquidity(curve: { organic: number; k: number; exponent: number }, budget: number) {
  return curve.organic + curve.k * Math.max(0, budget) ** curve.exponent
}
