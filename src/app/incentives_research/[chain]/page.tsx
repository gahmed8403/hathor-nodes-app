import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AlertTriangle, CircleDollarSign, Droplets } from 'lucide-react'
import { ScatterChart } from '@/components/charts'
import { IncentiveSimulator } from '@/components/dashboard/incentive-simulator'
import { DashboardHeader } from '@/components/dashboard/shell'
import { IncentivesTable } from '@/components/dashboard/tables'
import { Badge, Card, ChartCard, Container, SectionTitle, StatCard } from '@/components/ui/primitives'
import { getChain } from '@/lib/chains'
import { fmtUsdCompact } from '@/lib/format'
import { getIncentives } from '@/lib/mock/osmosis'
import { palette } from '@/lib/palette'

type Props = { params: Promise<{ chain: string }> }

export const dynamicParams = false
export function generateStaticParams() {
  return [{ chain: 'osmosis' }]
}

export const metadata: Metadata = {
  title: 'Incentives Optimization Research · Osmosis',
  description: 'How to ensure healthy liquidity on Osmosis while minimizing the cost of incentives.',
}

const findings = [
  {
    title: 'Liquidity shows diminishing returns',
    body: 'Across pools, liquidity grows roughly with the square root of incentive spend. Doubling incentives buys far less than double the depth.',
  },
  {
    title: 'Organic liquidity does the heavy lifting',
    body: 'Most TVL in the major pools would remain without incentives. Spend is best targeted where it moves the needle — newer and long-tail pairs.',
  },
  {
    title: 'Fee coverage is the health metric',
    body: 'Pools whose weekly swap fees cover a large share of their incentives are self-sustaining. Low-coverage pools are candidates for a gradual taper.',
  },
]

export default async function IncentivesPage({ params }: Props) {
  const chain = getChain((await params).chain)
  if (!chain) notFound()
  const inc = getIncentives()

  return (
    <>
      <DashboardHeader
        chain={chain}
        title="Incentives Optimization"
        description="Initial results from our research into keeping Osmosis liquidity healthy while minimizing the cost of incentives."
      >
        <Badge>Research · preliminary</Badge>
      </DashboardHeader>
      <Container className="space-y-6 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Incentives per week" value={fmtUsdCompact(inc.totalIncentives)} hint={`Across ${inc.pools.length} pools`} icon={CircleDollarSign} />
          <StatCard label="Liquidity in studied pools" value={fmtUsdCompact(inc.totalLiquidity)} icon={Droplets} />
          <StatCard
            label="Likely over-incentivized"
            value={inc.overIncentivized}
            hint="Pools with < 25% fee coverage"
            icon={AlertTriangle}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {findings.map((f, i) => (
            <Card key={f.title} className="p-6">
              <span className="font-mono text-xs text-sun-300">Finding 0{i + 1}</span>
              <h2 className="mt-3 font-display text-2xl leading-tight text-mist-50">{f.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-mist-400">{f.body}</p>
            </Card>
          ))}
        </div>

        <ChartCard
          title="Incentives vs liquidity"
          description="Each dot is a pool (log scales). Pools on the upper left get the most liquidity per incentive dollar."
        >
          <ScatterChart
            data={inc.pools}
            x="incentives"
            y="liquidity"
            z="volume"
            name="Pools"
            xLabel="Weekly incentives (USD)"
            yLabel="Liquidity (USD)"
            xFormat="usd"
            yFormat="usd"
            color={palette.sun}
          />
        </ChartCard>

        <ChartCard
          title="Budget simulator"
          description="Projected aggregate liquidity for a given weekly incentive budget, using the fitted diminishing-returns curve."
        >
          <IncentiveSimulator curve={inc.curve} current={inc.totalIncentives} />
        </ChartCard>

        <section className="card-surface p-5 sm:p-6">
          <SectionTitle
            title="Pool efficiency"
            description="Fee coverage = weekly swap fees ÷ weekly incentives. Sorted from least to most efficient."
          />
          <div className="mt-5">
            <IncentivesTable data={inc.pools} />
          </div>
        </section>
      </Container>
    </>
  )
}
