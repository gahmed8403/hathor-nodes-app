import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Boxes, CircleDollarSign, Coins } from 'lucide-react'
import { AreaChart, BarChart, DonutChart } from '@/components/charts'
import { DashboardHeader } from '@/components/dashboard/shell'
import { TokenLiquidityTable } from '@/components/dashboard/tables'
import { ChartCard, Container, FunFacts, SectionTitle, StatCard } from '@/components/ui/primitives'
import { getChain } from '@/lib/chains'
import { fmtCompact, fmtInt, fmtSignedPct, fmtUsdCompact } from '@/lib/format'
import { getLiquidity } from '@/lib/mock/osmosis'
import { palette } from '@/lib/palette'

type Props = { params: Promise<{ chain: string }> }

export const dynamicParams = false
export function generateStaticParams() {
  return [{ chain: 'osmosis' }]
}

export const metadata: Metadata = {
  title: 'Liquidity Provider · Osmosis',
  description: 'Token liquidity breakdown across Osmosis pools and its impact on the OSMO.',
}

export default async function LiquidityPage({ params }: Props) {
  const chain = getChain((await params).chain)
  if (!chain) notFound()
  const lp = getLiquidity()

  const change = [...lp.tokens]
    .sort((a, b) => b.change7d - a.change7d)
    .map((t) => ({ token: t.symbol, change: t.change7d }))

  return (
    <>
      <DashboardHeader
        chain={chain}
        title="Token Liquidity Breakdown"
        description="Liquidity pools are the mainstay of Osmosis. Track the liquidity of tokens and their impact on the OSMO."
      />
      <Container className="space-y-6 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Total non-OSMO TVL"
            value={fmtUsdCompact(lp.nonOsmoTvl)}
            change={fmtSignedPct(lp.nonOsmoTvlChange)}
            tone={lp.nonOsmoTvlChange >= 0 ? 'up' : 'down'}
            hint="vs 7 days ago"
            icon={CircleDollarSign}
          />
          <StatCard label="Assets in pools" value={fmtInt(lp.assetsInPools)} hint="Distinct denoms" icon={Boxes} />
          <StatCard
            label="OSMO in pools"
            value={fmtCompact(lp.osmoInPools)}
            change={fmtSignedPct(lp.osmoInPoolsChange)}
            tone={lp.osmoInPoolsChange >= 0 ? 'up' : 'down'}
            hint="vs 7 days ago"
            icon={Coins}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr]">
          <ChartCard title="OSMO’s underlying assets" description="Share of non-OSMO TVL paired against OSMO.">
            <DonutChart data={lp.underlying} format="usd" centerValue={fmtUsdCompact(lp.nonOsmoTvl)} centerLabel="Non-OSMO TVL" />
          </ChartCard>
          <ChartCard title="OSMO token exposure" description="Non-OSMO TVL by token over the last 120 days.">
            <AreaChart
              data={lp.exposure}
              index="date"
              stacked
              height={300}
              format="usd"
              series={lp.exposureKeys.map((k, i) => ({ key: k, name: k, color: lp.exposureColors[i] }))}
            />
          </ChartCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <ChartCard title="7-day % liquidity change" description="Change in the number of each token held in pools.">
            <BarChart
              data={change}
              index="token"
              height={300}
              format="pct"
              series={[{ key: 'change', name: '7d change', color: palette.turquoise }]}
              colorByValue={{ positive: palette.turquoise, negative: palette.carnelian }}
            />
          </ChartCard>
          <FunFacts title="30-day fun facts" facts={lp.funFacts} />
        </div>

        <section className="card-surface p-5 sm:p-6">
          <SectionTitle title="Token liquidity" description="Number of each token in pools today and over time, ranked by TVL." />
          <div className="mt-5">
            <TokenLiquidityTable data={lp.tokens} />
          </div>
        </section>
      </Container>
    </>
  )
}
