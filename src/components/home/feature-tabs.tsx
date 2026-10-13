'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Droplets, Landmark, Layers, Vote as VoteIcon } from 'lucide-react'
import { AreaChart, BarChart, DonutChart, palette } from '@/components/charts'
import { cn } from '@/lib/format'
import type { Vote } from '@/lib/mock/governance'

type Props = {
  participation: { bucket: string; validators: number }[]
  underlying: { name: string; value: number; color: string }[]
  sfsOverTime: { date: string; staked: number; superfluid: number }[]
  voteGrid: { moniker: string; votes: Vote[] }[]
}

const voteColor: Record<Vote, string> = {
  yes: 'bg-turquoise-400',
  no: 'bg-carnelian-400',
  abstain: 'bg-lapis-400',
  veto: 'bg-sun-500',
  missed: 'bg-white/15',
  inactive: 'bg-white/[0.04]',
}

export function FeatureTabs({ participation, underlying, sfsOverTime, voteGrid }: Props) {
  const features = [
    {
      key: 'governance',
      icon: Landmark,
      title: 'Governance Dashboard',
      body: 'Up-to-date information on validator voting habits and participation rate.',
      href: '/governance/osmosis',
      preview: (
        <BarChart
          data={participation}
          index="bucket"
          series={[{ key: 'validators', name: 'Validators', color: palette.sun }]}
          height={260}
          format="number"
        />
      ),
      caption: 'Active validators by participation rate · Osmosis',
    },
    {
      key: 'liquidity',
      icon: Droplets,
      title: 'Liquidity Provider Dashboard',
      body: 'The mainstay of Osmosis, its liquidity pools, contain a variety of assets from the Cosmos and beyond. Track the liquidity of tokens and their impact on the OSMO here.',
      href: '/liquidity_provider/osmosis',
      preview: <DonutChart data={underlying} height={240} format="usd" centerLabel="Non-OSMO TVL" />,
      caption: "OSMO's underlying assets",
    },
    {
      key: 'superfluid',
      icon: Layers,
      title: 'SuperFluid Staking Dashboard',
      body: 'Providing the ability to both provide liquidity and stake, SuperFluid Staking (SFS) has been a game changer for Osmosis. Track its adoption by both pools and users here.',
      href: '/super_fluid_staking/osmosis',
      preview: (
        <AreaChart
          data={sfsOverTime}
          index="date"
          stacked
          height={260}
          series={[
            { key: 'staked', name: 'Staked', color: palette.lapis },
            { key: 'superfluid', name: 'SuperFluid', color: palette.sun },
          ]}
        />
      ),
      caption: 'Delegation types over time',
    },
    {
      key: 'history',
      icon: VoteIcon,
      title: 'Validator Voting History',
      body: 'Our validator voting history lays out how validators have voted on every proposal.',
      href: '/validator_voting_history/osmosis',
      preview: (
        <div className="space-y-1.5" role="img" aria-label="Grid of recent validator votes">
          {voteGrid.map((row) => (
            <div key={row.moniker} className="flex items-center gap-3">
              <span className="w-28 shrink-0 truncate text-xs text-mist-400">{row.moniker}</span>
              <div className="flex flex-1 gap-1">
                {row.votes.map((v, i) => (
                  <span key={i} className={cn('h-4 flex-1 rounded-[3px]', voteColor[v])} />
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-3 text-[0.7rem] text-mist-500">
            {(['yes', 'no', 'abstain', 'veto', 'missed'] as Vote[]).map((v) => (
              <span key={v} className="flex items-center gap-1.5 capitalize">
                <span className={cn('h-2 w-2 rounded-sm', voteColor[v])} />
                {v}
              </span>
            ))}
          </div>
        </div>
      ),
      caption: 'Last 18 proposals · top validators',
    },
  ]
  const [active, setActive] = useState(features[0].key)
  const current = features.find((f) => f.key === active)!

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
      <div role="tablist" aria-label="Dashboards" aria-orientation="vertical" className="flex flex-col gap-2">
        {features.map((f) => {
          const selected = f.key === active
          return (
            <button
              key={f.key}
              role="tab"
              id={`tab-${f.key}`}
              aria-selected={selected}
              aria-controls={`panel-${f.key}`}
              onClick={() => setActive(f.key)}
              className={cn(
                'group rounded-2xl border p-5 text-left transition duration-300',
                selected
                  ? 'border-sun-400/30 bg-gradient-to-br from-sun-400/[0.09] to-transparent'
                  : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]',
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'grid h-9 w-9 place-items-center rounded-xl border transition',
                    selected ? 'border-sun-400/40 bg-sun-400 text-ink-950' : 'border-white/10 text-mist-400',
                  )}
                >
                  <f.icon className="h-4 w-4" />
                </span>
                <h3 className={cn('font-medium', selected ? 'text-mist-50' : 'text-mist-300')}>{f.title}</h3>
              </div>
              <p
                className={cn(
                  'grid text-sm leading-relaxed text-mist-400 transition-all duration-300',
                  selected ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 lg:opacity-0',
                )}
              >
                <span className="overflow-hidden">{f.body}</span>
              </p>
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${current.key}`}
        aria-labelledby={`tab-${current.key}`}
        className="card-surface relative overflow-hidden p-5 sm:p-7"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sun-500/10 blur-3xl" />
        <div className="relative flex items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-wider text-mist-500">{current.caption}</p>
          <span className="flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-turquoise-300">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-turquoise-400" /> Preview
          </span>
        </div>
        <div key={current.key} className="relative mt-6 min-h-[260px] animate-rise">
          {current.preview}
        </div>
        <Link
          href={current.href}
          className="relative mt-6 inline-flex items-center gap-2 text-sm font-medium text-sun-300 hover:text-sun-200"
        >
          Open {current.title.replace(' Dashboard', '').toLowerCase()} dashboard <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
