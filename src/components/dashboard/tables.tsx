'use client'

import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { cn, fmtCompact, fmtInt, fmtPct, fmtSignedPct, fmtUsd, fmtUsdCompact } from '@/lib/format'
import type { ValidatorStats } from '@/lib/mock/governance'
import type { TokenLiquidity } from '@/lib/mock/osmosis'

const right = { meta: { align: 'right' } }

function Moniker({ name }: { name: string }) {
  const hathor = name === 'Hathor Nodes'
  return (
    <span className={cn('flex items-center gap-2 font-medium', hathor ? 'text-sun-200' : 'text-mist-50')}>
      <span
        className={cn('grid h-6 w-6 place-items-center rounded-full text-[0.65rem]', hathor ? 'bg-sun-400 text-ink-950' : 'bg-white/[0.06] text-mist-300')}
        aria-hidden="true"
      >
        {name[0]}
      </span>
      {name}
    </span>
  )
}

function StatusPill({ status }: { status: ValidatorStats['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs',
        status === 'Active' && 'bg-turquoise-400/10 text-turquoise-300',
        status === 'Inactive' && 'bg-white/5 text-mist-400',
        status === 'Jailed' && 'bg-carnelian-400/10 text-carnelian-300',
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

function Meter({ value, color = 'var(--color-sun-400)' }: { value: number; color?: string }) {
  return (
    <span className="inline-flex items-center justify-end gap-2.5">
      <span className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.06] sm:block">
        <span className="block h-full rounded-full" style={{ width: `${Math.min(100, value)}%`, background: color }} />
      </span>
      {fmtPct(value)}
    </span>
  )
}

/* ---------------- Governance: voting statistics ---------------- */

const vh = createColumnHelper<ValidatorStats>()
const validatorColumns = [
  vh.accessor('moniker', { header: 'Validator', cell: (c) => <Moniker name={c.getValue()} /> }),
  vh.accessor('votingPower', { header: 'Voting power', cell: (c) => fmtCompact(c.getValue()), ...right }),
  vh.accessor('status', { header: 'Status', cell: (c) => <StatusPill status={c.getValue()} /> }),
  vh.accessor('participationRate', { header: 'Participation', cell: (c) => <Meter value={c.getValue()} />, ...right }),
  vh.accessor('abstentionRate', {
    header: 'Abstention',
    cell: (c) => <Meter value={c.getValue()} color="var(--color-lapis-400)" />,
    ...right,
  }),
  vh.accessor('yes', { header: 'Yes', ...right }),
  vh.accessor('no', { header: 'No', ...right }),
  vh.accessor('abstain', { header: 'Abstain', ...right }),
  vh.accessor('veto', { header: 'Veto', ...right }),
  vh.accessor('inactive', { header: 'Inactive', ...right }),
  vh.accessor('missed', { header: 'Missed', ...right }),
]

export function ValidatorStatsTable({ data }: { data: ValidatorStats[] }) {
  return (
    <DataTable
      data={data}
      columns={validatorColumns}
      searchPlaceholder="Search validators…"
      initialSort={[{ id: 'votingPower', desc: true }]}
    />
  )
}

/* ---------------- Liquidity provider: token liquidity ---------------- */

const th = createColumnHelper<TokenLiquidity>()
const tokenColumns = [
  th.accessor('symbol', {
    header: 'Token',
    cell: (c) => (
      <span className="flex items-center gap-2.5">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.row.original.color }} />
        <span className="font-medium text-mist-50">{c.getValue()}</span>
        <span className="hidden text-mist-500 lg:inline">{c.row.original.name}</span>
      </span>
    ),
  }),
  th.accessor('rank', { header: 'Rank (TVL)', cell: (c) => `#${c.getValue()}`, ...right }),
  th.accessor('tvl', { header: 'TVL', cell: (c) => fmtUsdCompact(c.getValue()), ...right }),
  th.accessor('today', { header: 'Today', cell: (c) => fmtCompact(c.getValue()), ...right }),
  th.accessor('d7', { header: '7 days', cell: (c) => fmtCompact(c.getValue()), ...right }),
  th.accessor('d30', { header: '30 days', cell: (c) => fmtCompact(c.getValue()), ...right }),
  th.accessor('d90', { header: '90 days', cell: (c) => fmtCompact(c.getValue()), ...right }),
  th.accessor('change7d', {
    header: '7d Δ',
    cell: (c) => (
      <span className={c.getValue() >= 0 ? 'text-turquoise-300' : 'text-carnelian-300'}>{fmtSignedPct(c.getValue())}</span>
    ),
    ...right,
  }),
]

export function TokenLiquidityTable({ data }: { data: TokenLiquidity[] }) {
  return <DataTable data={data} columns={tokenColumns} searchPlaceholder="Search tokens…" initialSort={[{ id: 'rank', desc: false }]} />
}

/* ---------------- SuperFluid: delegations by validator ---------------- */

type SfsRow = { moniker: string; delegators: number; sfsStaked: number; totalStaked: number; sfsShare: number }
const sh = createColumnHelper<SfsRow>()
const sfsColumns = [
  sh.accessor('moniker', { header: 'Validator', cell: (c) => <Moniker name={c.getValue()} /> }),
  sh.accessor('delegators', { header: '# SFS delegators', cell: (c) => fmtInt(c.getValue()), ...right }),
  sh.accessor('sfsStaked', { header: 'OSMO SF staked', cell: (c) => fmtCompact(c.getValue()), ...right }),
  sh.accessor('totalStaked', { header: 'Total staked', cell: (c) => fmtCompact(c.getValue()), ...right }),
  sh.accessor('sfsShare', { header: '% from SFS', cell: (c) => <Meter value={c.getValue()} />, ...right }),
]

export function SfsValidatorsTable({ data }: { data: SfsRow[] }) {
  return <DataTable data={data} columns={sfsColumns} searchPlaceholder="Search validators…" initialSort={[{ id: 'sfsStaked', desc: true }]} />
}

/* ---------------- Juno value accrual: contracts ---------------- */

type ContractRow = { name: string; kind: string; fees: number; txs: number; change: number }
const ch = createColumnHelper<ContractRow>()
const contractColumns = [
  ch.accessor('name', { header: 'Contract', cell: (c) => <span className="font-medium text-mist-50">{c.getValue()}</span> }),
  ch.accessor('kind', {
    header: 'Category',
    cell: (c) => <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-mist-300">{c.getValue()}</span>,
  }),
  ch.accessor('txs', { header: 'Txs (30d)', cell: (c) => fmtCompact(c.getValue()), ...right }),
  ch.accessor('fees', { header: 'Fees (30d)', cell: (c) => fmtUsd(c.getValue()), ...right }),
  ch.accessor('change', {
    header: 'vs prior 30d',
    cell: (c) => (
      <span className={c.getValue() >= 0 ? 'text-turquoise-300' : 'text-carnelian-300'}>{fmtSignedPct(c.getValue())}</span>
    ),
    ...right,
  }),
]

export function ContractsTable({ data }: { data: ContractRow[] }) {
  return <DataTable data={data} columns={contractColumns} searchPlaceholder="Search contracts…" initialSort={[{ id: 'fees', desc: true }]} />
}

/* ---------------- Incentives research: pools ---------------- */

type IncentiveRow = {
  pool: string
  id: number
  incentives: number
  liquidity: number
  volume: number
  efficiency: number
  feeCoverage: number
}
const ih = createColumnHelper<IncentiveRow>()
const incentiveColumns = [
  ih.accessor('pool', {
    header: 'Pool',
    cell: (c) => (
      <span className="font-medium text-mist-50">
        <span className="mr-2 font-mono text-xs text-mist-500">#{c.row.original.id}</span>
        {c.getValue()}
      </span>
    ),
  }),
  ih.accessor('incentives', { header: 'Incentives / wk', cell: (c) => fmtUsdCompact(c.getValue()), ...right }),
  ih.accessor('liquidity', { header: 'Liquidity', cell: (c) => fmtUsdCompact(c.getValue()), ...right }),
  ih.accessor('volume', { header: 'Volume / day', cell: (c) => fmtUsdCompact(c.getValue()), ...right }),
  ih.accessor('efficiency', { header: '$ liquidity per $1', cell: (c) => fmtInt(c.getValue()), ...right }),
  ih.accessor('feeCoverage', {
    header: 'Fee coverage',
    cell: (c) => (
      <span
        className={cn(
          'rounded-full px-2 py-0.5',
          c.getValue() >= 100 ? 'bg-turquoise-400/10 text-turquoise-300' : c.getValue() < 25 ? 'bg-carnelian-400/10 text-carnelian-300' : 'text-mist-300',
        )}
      >
        {fmtPct(c.getValue())}
      </span>
    ),
    ...right,
  }),
]

export function IncentivesTable({ data }: { data: IncentiveRow[] }) {
  return <DataTable data={data} columns={incentiveColumns} searchPlaceholder="Search pools…" initialSort={[{ id: 'efficiency', desc: false }]} />
}
