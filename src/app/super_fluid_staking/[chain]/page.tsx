import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Clock, FlaskConical, Layers } from 'lucide-react'
import { AreaChart, BarChart, DonutChart } from '@/components/charts'
import { DashboardHeader } from '@/components/dashboard/shell'
import { SfsValidatorsTable } from '@/components/dashboard/tables'
import { ChartCard, Container, FunFacts, SectionTitle, StatCard } from '@/components/ui/primitives'
import { getChain } from '@/lib/chains'
import { fmtCompact, fmtInt, fmtSignedPct } from '@/lib/format'
import { getSuperfluid } from '@/lib/mock/osmosis'
import { palette } from '@/lib/palette'

type Props = { params: Promise<{ chain: string }> }

export const dynamicParams = false
export function generateStaticParams() {
  return [{ chain: 'osmosis' }]
}

export const metadata: Metadata = {
  title: 'SuperFluid Staking · Osmosis',
  description: 'Adoption of SuperFluid Staking across Osmosis pools, validators and delegators.',
}

export default async function SuperfluidPage({ params }: Props) {
  const chain = getChain((await params).chain)
  if (!chain) notFound()
  const sfs = getSuperfluid()

  return (
    <>
      <DashboardHeader
        chain={chain}
        title="State of Staking"
        description="SuperFluid Staking lets LPs stake the OSMO side of their position. Track its adoption by pools and users."
      />
      <Container className="space-y-6 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="OSMO delegated from pools"
            value={fmtCompact(sfs.totalSfs)}
            change={`${sfs.sfsShareOfStake}% of stake`}
            tone="up"
            icon={Layers}
          />
          <StatCard
            label="Pools with SFS enabled"
            value={sfs.poolsEnabled}
            change={fmtSignedPct(sfs.poolsEnabledChange)}
            tone="neutral"
            hint="vs 90 days ago"
            icon={FlaskConical}
          />
          <StatCard label="Epochs since SFS began" value={fmtInt(sfs.epochs)} hint="One epoch per day" icon={Clock} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr]">
          <ChartCard title="OSMO staked by type" description="Standard delegations vs SuperFluid delegations.">
            <DonutChart data={sfs.byType} centerValue={fmtCompact(sfs.totalStaked)} centerLabel="Total staked" />
          </ChartCard>
          <ChartCard title="Delegation types over time" description="Weekly snapshots of staked OSMO by delegation type.">
            <AreaChart
              data={sfs.overTime}
              index="date"
              stacked
              height={300}
              series={[
                { key: 'staked', name: 'Standard', color: palette.lapis },
                { key: 'superfluid', name: 'SuperFluid', color: palette.sun },
              ]}
            />
          </ChartCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <ChartCard title="OSMO staked by pool" description="SuperFluid-staked OSMO in each eligible pool.">
            <BarChart
              data={sfs.pools}
              index="name"
              layout="vertical"
              height={380}
              yWidth={130}
              series={[{ key: 'staked', name: 'SF staked OSMO', color: palette.sun }]}
            />
          </ChartCard>
          <FunFacts facts={sfs.funFacts} />
        </div>

        <section className="card-surface p-5 sm:p-6">
          <SectionTitle title="SFS delegations by validator" description="How much of each validator’s stake comes from SuperFluid positions." />
          <div className="mt-5">
            <SfsValidatorsTable data={sfs.validators} />
          </div>
        </section>
      </Container>
    </>
  )
}
