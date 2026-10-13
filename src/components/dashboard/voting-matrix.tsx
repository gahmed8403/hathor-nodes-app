'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/format'
import type { Proposal, Vote } from '@/lib/mock/governance'

const VOTE_STYLE: Record<Vote, { label: string; className: string; short: string }> = {
  yes: { label: 'Yes', short: 'Y', className: 'bg-turquoise-400/20 text-turquoise-300' },
  no: { label: 'No', short: 'N', className: 'bg-carnelian-400/20 text-carnelian-300' },
  abstain: { label: 'Abstain', short: 'A', className: 'bg-lapis-400/20 text-lapis-300' },
  veto: { label: 'No with veto', short: 'V', className: 'bg-sun-400/25 text-sun-200' },
  missed: { label: 'Did not vote', short: '–', className: 'bg-white/[0.06] text-mist-400' },
  inactive: { label: 'Inactive', short: '', className: 'bg-transparent text-mist-500' },
}

type Row = { moniker: string; participationRate: number; votingPower: number; votes: Vote[] }

export function VotingMatrix({ proposals, rows }: { proposals: Proposal[]; rows: Row[] }) {
  const [query, setQuery] = useState('')
  const [voteFilter, setVoteFilter] = useState<Vote | 'all'>('all')
  const [sort, setSort] = useState<'power' | 'participation' | 'name'>('power')

  // newest proposals first
  const ordered = useMemo(() => [...proposals].reverse(), [proposals])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = rows.filter((r) => r.moniker.toLowerCase().includes(q))
    return list.sort((a, b) =>
      sort === 'name'
        ? a.moniker.localeCompare(b.moniker)
        : sort === 'participation'
          ? b.participationRate - a.participationRate
          : b.votingPower - a.votingPower,
    )
  }, [rows, query, sort])

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative flex-1 sm:max-w-xs">
          <span className="sr-only">Filter validators</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter validators…"
            className="w-full rounded-full border border-white/10 bg-white/[0.03] py-2 pl-9 pr-4 text-sm text-mist-50 placeholder:text-mist-500 focus:border-sun-400/50 focus:outline-none focus:ring-2 focus:ring-sun-400/20"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-mist-400">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-full border border-white/10 bg-ink-900 px-3 py-2 text-sm text-mist-100 focus:border-sun-400/50 focus:outline-none"
          >
            <option value="power">Voting power</option>
            <option value="participation">Participation</option>
            <option value="name">Name</option>
          </select>
        </label>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Highlight vote type">
          {(['all', 'yes', 'no', 'abstain', 'veto', 'missed'] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={voteFilter === v}
              onClick={() => setVoteFilter(v)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs capitalize transition',
                voteFilter === v ? 'border-sun-400/50 bg-sun-400/10 text-sun-200' : 'border-white/10 text-mist-400 hover:text-mist-100',
              )}
            >
              {v === 'all' ? 'All votes' : VOTE_STYLE[v].label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 max-h-[640px] overflow-auto rounded-2xl border border-white/5">
        <table className="border-separate border-spacing-0 text-xs">
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 top-0 z-20 min-w-48 border-b border-r border-white/5 bg-ink-900 px-4 py-3 text-left font-medium uppercase tracking-wider text-mist-500"
              >
                Validator
              </th>
              {ordered.map((p) => (
                <th
                  key={p.id}
                  scope="col"
                  title={`#${p.id} · ${p.title} (${p.status})`}
                  className="sticky top-0 z-10 border-b border-white/5 bg-ink-900 px-1 py-3 text-center font-mono font-normal text-mist-500"
                >
                  <span className={cn('block', p.status === 'Rejected' && 'text-carnelian-300')}>#{p.id}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const hathor = r.moniker === 'Hathor Nodes'
              return (
                <tr key={r.moniker} className="group">
                  <th
                    scope="row"
                    className={cn(
                      'sticky left-0 z-10 border-b border-r border-white/5 bg-ink-900 px-4 py-2 text-left font-medium group-hover:bg-ink-800',
                      hathor ? 'text-sun-200' : 'text-mist-100',
                    )}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="truncate">{r.moniker}</span>
                      <span className="font-mono font-normal text-mist-500">{r.participationRate}%</span>
                    </span>
                  </th>
                  {[...r.votes].reverse().map((v, i) => {
                    const style = VOTE_STYLE[v]
                    const dim = voteFilter !== 'all' && v !== voteFilter
                    return (
                      <td key={i} className="border-b border-white/5 px-0.5 py-1.5 text-center group-hover:bg-white/[0.02]">
                        <span
                          title={`${r.moniker} · #${ordered[i].id}: ${style.label}`}
                          className={cn(
                            'mx-auto grid h-6 w-6 place-items-center rounded-md font-mono text-[0.65rem] transition-opacity',
                            style.className,
                            dim && 'opacity-15',
                          )}
                        >
                          {style.short}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="px-4 py-10 text-center text-sm text-mist-500">No validators match “{query}”.</p>}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-mist-400">
        {(Object.keys(VOTE_STYLE) as Vote[]).map((v) => (
          <li key={v} className="flex items-center gap-2">
            <span className={cn('grid h-5 w-5 place-items-center rounded font-mono text-[0.6rem]', VOTE_STYLE[v].className, v === 'inactive' && 'border border-white/10')}>
              {VOTE_STYLE[v].short}
            </span>
            {VOTE_STYLE[v].label}
          </li>
        ))}
        <li className="text-mist-500">Hover a cell for details · red proposal ids were rejected</li>
      </ul>
    </div>
  )
}
