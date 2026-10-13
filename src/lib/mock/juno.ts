import { createRng, between, normal, round } from './random'

import { DAY, END } from './dates'

const CONTRACTS = [
  { name: 'Papyrus AMM Router', kind: 'DEX' },
  { name: 'Scarab NFT Market', kind: 'NFT' },
  { name: 'Lotus Lending Vaults', kind: 'Lending' },
  { name: 'Obelisk DAO Core', kind: 'DAO' },
  { name: 'Ibis Bridge Adapter', kind: 'Bridge' },
  { name: 'Cartouche Name Service', kind: 'Identity' },
  { name: 'Senet Game Hub', kind: 'Gaming' },
  { name: 'Nile Stable Swap', kind: 'DEX' },
  { name: 'Sistrum Payroll', kind: 'Payments' },
  { name: 'Khepri Launchpad', kind: 'Launchpad' },
]

const COUNTERPARTIES = [
  { name: 'Osmosis', color: '#a879ff' },
  { name: 'Cosmos Hub', color: '#7193ff' },
  { name: 'Stargaze', color: '#3cc6b5' },
  { name: 'Neutron', color: '#e8b44c' },
  { name: 'Axelar', color: '#b8b4aa' },
  { name: 'Other', color: '#3b4459' },
]

export function getValueAccrual() {
  const rng = createRng('juno:value-accrual')
  const days = 90
  const daily = Array.from({ length: days }, (_, i) => {
    const weekly = 1 + 0.12 * Math.sin((i / 7) * Math.PI * 2)
    const trend = 1 + i / days / 2.5
    return {
      date: new Date(END - (days - 1 - i) * DAY).toISOString().slice(0, 10),
      contracts: Math.round(Math.max(200, 1_900 * weekly * trend * (1 + normal(rng, 0, 0.14)))),
      ibc: Math.round(Math.max(150, 1_150 * weekly * (1 + normal(rng, 0, 0.18)))),
      other: Math.round(Math.max(40, 380 * (1 + normal(rng, 0, 0.25)))),
    }
  })

  const last30 = daily.slice(-30)
  const prev30 = daily.slice(-60, -30)
  const sum = (rows: typeof daily, k: 'contracts' | 'ibc' | 'other') => rows.reduce((a, r) => a + r[k], 0)
  const total30 = sum(last30, 'contracts') + sum(last30, 'ibc') + sum(last30, 'other')
  const totalPrev = sum(prev30, 'contracts') + sum(prev30, 'ibc') + sum(prev30, 'other')

  const shares = CONTRACTS.map(() => rng() ** 2.2 + 0.03)
  const shareSum = shares.reduce((a, b) => a + b, 0)
  const contractFees30 = sum(last30, 'contracts')
  const contracts = CONTRACTS.map((c, i) => ({
    ...c,
    fees: Math.round((shares[i] / shareSum) * contractFees30),
    txs: Math.round(between(rng, 4_000, 160_000) * shares[i] * 4),
    change: round(normal(rng, 6, 18), 1),
  })).sort((a, b) => b.fees - a.fees)

  const ibcFees30 = sum(last30, 'ibc')
  const cpWeights = [0.46, 0.21, 0.12, 0.09, 0.07, 0.05]
  const ibc = COUNTERPARTIES.map((c, i) => ({ ...c, value: Math.round(ibcFees30 * cpWeights[i]) }))

  return {
    daily,
    total30,
    totalChange: round(((total30 - totalPrev) / totalPrev) * 100, 1),
    contractFees30,
    ibcFees30,
    contractShare: round((contractFees30 / total30) * 100, 1),
    ibcShare: round((ibcFees30 / total30) * 100, 1),
    contracts,
    ibc,
  }
}
