import { END } from './dates'
import { createRng, between, intBetween, pick, normal, moments, round, type Rng } from './random'

export type Vote = 'yes' | 'no' | 'abstain' | 'veto' | 'missed' | 'inactive'
export type ValidatorStatus = 'Active' | 'Inactive' | 'Jailed'

export type Proposal = {
  id: number
  title: string
  submitted: string
  status: 'Passed' | 'Rejected'
  turnout: number
}

export type ValidatorStats = {
  moniker: string
  votingPower: number
  votingPowerShare: number
  status: ValidatorStatus
  yes: number
  no: number
  abstain: number
  veto: number
  missed: number
  inactive: number
  participationRate: number
  abstentionRate: number
}

export type GovernanceData = {
  proposals: Proposal[]
  validators: ValidatorStats[]
  /** votes[validatorIndex][proposalIndex] */
  votes: Vote[][]
  kurtosisSeries: { epoch: string; kurtosis: number; skew: number }[]
  distribution: { rank: number; moniker: string; share: number; cumulative: number }[]
  nakamoto: number
  totals: Record<Exclude<Vote, 'inactive'>, number>
}

/** Fictional validator monikers — any resemblance to real operators is coincidental. */
const MONIKERS = [
  'Lapis Labs', 'Obsidian Stake', 'Northwind', 'Cobalt Relay', 'Meridian Node', 'Saffron Stake',
  'Quartzline', 'Atlas Harbor', 'Kestrel Infra', 'Juniper Nodes', 'Sable Systems', 'Driftwood',
  'Basalt Works', 'Halcyon Hall', 'Ember Validator', 'Zenith Stake', 'Pinecone', 'Monsoon',
  'Tidewater', 'Granite Peak', 'Aurora Bay', 'Larkspur', 'Copperline', 'Bluefin Ops', 'Cinder',
  'Wren & Co', 'Mosaic Staking', 'Foxglove', 'Vantage Ridge', 'Ironbark', 'Ridgeline Labs',
  'Starling', 'Orchard Row', 'Lantern Keep', 'Fathom Five', 'Silverleaf', 'Harbor Lights',
  'Thistle', 'Coral Shelf', 'Pebblestone', 'Nimbus Nine', 'Marigold', 'Keystone Arc', 'Equinox',
  'Solstice Node', 'Cairn', 'Delta Shoal', 'Obelisk', 'Papyrus Labs', 'Scarab Stake',
  'Sphinx Validator', 'Ankh Infra', 'Blue Lotus', 'Oasis Relay', 'Dune Collective', 'Falconet',
  'Cartouche', 'Senet Staking', 'Ibis Works', 'Jackal Labs', 'Sistrum', 'Khepri', 'Reedboat',
  'Faience', 'Carnelian', 'Natron', 'Sycamore', 'Moonwell', 'Glasswing', 'Ostrakon', 'Hieratic',
  'Sundial', 'Nightjar', 'Kingfisher', 'Brightwater', 'Umber', 'Verdigris', 'Wolfram',
]

const TOPICS: Record<string, string[]> = {
  osmosis: [
    'Match External Incentives for {pool}',
    'Enable Superfluid Staking for {pool}',
    'Adjust Swap Fee on Pool #{n}',
    'Increase Max Validator Set to {v}',
    'Osmosis v{ver} Software Upgrade',
    'Community Pool Spend: {thing}',
    'Signaling: {thing}',
    'Rebalance Liquidity Incentives (Epoch {n})',
  ],
  juno: [
    'Juno v{ver} Software Upgrade',
    'Whitelist Contract Code ID {n}',
    'Community Pool Spend: {thing}',
    'Parameter Change: Gas Price Floor',
    'Signaling: {thing}',
    'Increase Max Validator Set to {v}',
  ],
  bitsong: [
    'Bitsong v{ver} Software Upgrade',
    'Fantoken Module Parameter Update',
    'Community Pool Spend: {thing}',
    'Signaling: {thing}',
    'Create BTSG/{token} Liquidity Pool',
  ],
  stargaze: [
    'Stargaze v{ver} Software Upgrade',
    'Update Marketplace Trading Fee',
    'Community Pool Spend: {thing}',
    'Signaling: {thing}',
    'Whitelist Minter Contract {n}',
  ],
}
const POOLS = ['ATOM/OSMO', 'JUNO/OSMO', 'STARS/OSMO', 'BTSG/OSMO', 'AKT/OSMO', 'USDC/OSMO', 'SCRT/OSMO', 'HUAHUA/OSMO']
const THINGS = [
  'Developer Grants Round', 'Block Explorer Funding', 'Relayer Subsidy', 'Security Audit',
  'Community Education Fund', 'Wallet Integration', 'Validator Decentralization Program', 'Hackathon Prizes',
  'Documentation Overhaul', 'Bug Bounty Program',
]
const TOKENS = ['OSMO', 'ATOM', 'STARS', 'JUNO']

const CHAIN_SHAPE: Record<string, { validators: number; proposals: number; startDate: string }> = {
  osmosis: { validators: 72, proposals: 96, startDate: '2021-07-01' },
  juno: { validators: 58, proposals: 64, startDate: '2021-10-15' },
  bitsong: { validators: 44, proposals: 40, startDate: '2021-09-01' },
  stargaze: { validators: 50, proposals: 52, startDate: '2021-11-01' },
}

function shuffle<T>(rng: Rng, arr: T[]) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function fillTemplate(rng: Rng, t: string) {
  return t
    .replace('{pool}', pick(rng, POOLS))
    .replace('{thing}', pick(rng, THINGS))
    .replace('{token}', pick(rng, TOKENS))
    .replace('{v}', String(pick(rng, [100, 120, 125, 150])))
    .replace('{ver}', `${intBetween(rng, 3, 14)}`)
    .replace('{n}', String(intBetween(rng, 1, 900)))
}

const cache = new Map<string, GovernanceData>()

export function getGovernance(chain: string): GovernanceData {
  const hit = cache.get(chain)
  if (hit) return hit
  const shape = CHAIN_SHAPE[chain] ?? CHAIN_SHAPE.osmosis
  const rng = createRng(`gov:${chain}`)

  // Proposals, oldest first
  // Spread proposals evenly from chain launch up to the end of the demo data window
  const start = new Date(shape.startDate).getTime()
  const spacing = (END - 5 * 86_400_000 - start) / (shape.proposals - 1)
  const proposals: Proposal[] = Array.from({ length: shape.proposals }, (_, i) => {
    const date = new Date(start + i * spacing + rng() * 4 * 86_400_000)
    return {
      id: i + 1,
      title: fillTemplate(rng, pick(rng, TOPICS[chain] ?? TOPICS.osmosis)),
      submitted: date.toISOString().slice(0, 10),
      status: rng() < 0.84 ? 'Passed' : 'Rejected',
      turnout: 0,
    }
  })

  // Validators: Hathor Nodes plus a shuffled cast of fictional operators
  // (Hathor Nodes doesn't validate on Juno, so it only appears on the other chains.)
  const includeHathor = chain !== 'juno'
  const cast = shuffle(rng, MONIKERS).slice(0, shape.validators - (includeHathor ? 1 : 0))
  const names = includeHathor ? ['Hathor Nodes', ...cast] : cast
  const raw = names.map((moniker, i) => {
    const isHathor = includeHathor && i === 0
    // heavy-tailed (log-normal) voting power → realistic skew
    const power = Math.exp(normal(rng, 12.2, 1.15))
    const diligence = isHathor ? 0.99 : Math.min(0.995, Math.max(0.02, between(rng, 0.1, 1.25)) ** 0.6)
    const abstainBias = isHathor ? 0.06 : rng() ** 2.5 * 0.6
    const joinedAt = isHathor ? 2 : rng() < 0.35 ? 0 : intBetween(rng, 0, Math.floor(shape.proposals * 0.75))
    const status: ValidatorStatus = isHathor ? 'Active' : rng() < 0.82 ? 'Active' : rng() < 0.7 ? 'Inactive' : 'Jailed'
    return { moniker, power, diligence, abstainBias, joinedAt, status }
  })

  const votes: Vote[][] = raw.map((v) =>
    proposals.map((p, pi) => {
      if (pi < v.joinedAt) return 'inactive'
      if (rng() > v.diligence) return 'missed'
      const r = rng()
      if (r < v.abstainBias) return 'abstain'
      const yesBias = p.status === 'Passed' ? 0.9 : 0.35
      const r2 = rng()
      if (r2 < yesBias) return 'yes'
      return rng() < 0.85 ? 'no' : 'veto'
    }),
  )

  const totalPower = raw.reduce((a, v) => a + v.power, 0)
  const validators: ValidatorStats[] = raw.map((v, i) => {
    const counts = { yes: 0, no: 0, abstain: 0, veto: 0, missed: 0, inactive: 0 }
    votes[i].forEach((vote) => counts[vote]++)
    const eligible = proposals.length - counts.inactive
    const voted = eligible - counts.missed
    return {
      moniker: v.moniker,
      votingPower: Math.round(v.power),
      votingPowerShare: round((v.power / totalPower) * 100, 2),
      status: v.status,
      ...counts,
      participationRate: eligible ? round((voted / eligible) * 100, 1) : 0,
      abstentionRate: voted ? round((counts.abstain / voted) * 100, 1) : 0,
    }
  })

  proposals.forEach((p, pi) => {
    const eligible = votes.filter((row) => row[pi] !== 'inactive').length
    const voted = votes.filter((row) => row[pi] !== 'inactive' && row[pi] !== 'missed').length
    p.turnout = eligible ? round((voted / eligible) * 100, 1) : 0
  })

  // Voting-power distribution and Nakamoto coefficient
  const byPower = [...validators].sort((a, b) => b.votingPower - a.votingPower)
  let cum = 0
  const distribution = byPower.map((v, i) => {
    cum += v.votingPowerShare
    return { rank: i + 1, moniker: v.moniker, share: v.votingPowerShare, cumulative: round(cum, 2) }
  })
  const nakamoto = distribution.findIndex((d) => d.cumulative > 33.4) + 1

  // Kurtosis/skew of voting power over time (sampled every ~25k blocks)
  const base = moments(raw.map((v) => v.power))
  let drift = 1.18
  const kurtosisSeries = Array.from({ length: 30 }, (_, i) => {
    drift = Math.max(0.85, drift - 0.008 + normal(rng, 0, 0.025))
    return {
      epoch: `${((i + 1) * 25_000).toLocaleString('en-US')}`,
      kurtosis: round(base.kurtosis * drift, 2),
      skew: round(base.skew * Math.sqrt(drift), 2),
    }
  })

  const totals = { yes: 0, no: 0, abstain: 0, veto: 0, missed: 0 }
  validators.forEach((v) => {
    totals.yes += v.yes
    totals.no += v.no
    totals.abstain += v.abstain
    totals.veto += v.veto
    totals.missed += v.missed
  })

  const data = { proposals, validators, votes, kurtosisSeries, distribution, nakamoto, totals }
  cache.set(chain, data)
  return data
}

export function governanceHighlights(data: GovernanceData) {
  const active = data.validators.filter((v) => v.status === 'Active')
  const avg = active.reduce((a, v) => a + v.participationRate, 0) / active.length
  const voters = active.filter((v) => v.yes + v.no + v.veto + v.abstain > 0)
  const mostLikelyToVote = [...active].sort((a, b) => b.participationRate - a.participationRate || b.votingPower - a.votingPower)[0]
  const mostLikelyToAbstain = [...voters].sort((a, b) => b.abstentionRate - a.abstentionRate)[0]
  const leastLikelyToAbstain = [...voters]
    .filter((v) => v.participationRate > 60)
    .sort((a, b) => a.abstentionRate - b.abstentionRate || b.participationRate - a.participationRate)[0]
  return {
    regularVoters: active.filter((v) => v.participationRate >= 75).length,
    rareVoters: active.filter((v) => v.participationRate <= 25).length,
    averageParticipation: round(avg, 1),
    activeCount: active.length,
    mostLikelyToVote,
    mostLikelyToAbstain,
    leastLikelyToAbstain,
    nonVoting: active.filter((v) => v.participationRate === 0).length,
  }
}
