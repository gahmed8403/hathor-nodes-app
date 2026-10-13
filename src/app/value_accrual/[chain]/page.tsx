import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeftRight, FileCode2, Receipt } from 'lucide-react'
import { AreaChart, DonutChart } from '@/components/charts'
import { DashboardHeader } from '@/components/dashboard/shell'
import { ContractsTable } from '@/components/dashboard/tables'
import { Badge, ChartCard, Container, SectionTitle, StatCard } from '@/components/ui/primitives'
import { getChain } from '@/lib/chains'
import { fmtSignedPct, fmtUsd, fmtUsdCompact } from '@/lib/format'
import { getValueAccrual } from '@/lib/mock/juno'
import { palette } from '@/lib/palette'

type Props = { params: Promise<{ chain: string }> }

export const dynamicParams = false
export function generateStaticParams() {
  return [{ chain: 'juno' }]
}

export const metadata: Metadata = {
  title: 'Value Accrual · Juno',
  description: 'Breakdown of Juno transaction fees from IBC transfers and smart contracts.',
}

export default async function ValueAccrualPage({ params }: Props) {
  const chain = getChain((await params).chain)
  if (!chain) notFound()
  const va = getValueAccrual()

  return (
    <>
      <DashboardHeader
        chain={chain}
        title="Value Accrual"
        description="Where Juno’s transaction fees come from: IBC transfers, smart contracts, and everything else."
      >
        <Badge>Beta</Badge>
      </DashboardHeader>
      <Container className="space-y-6 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Fees collected · 30d"
            value={fmtUsd(va.total30)}
            change={fmtSignedPct(va.totalChange)}
            tone={va.totalChange >= 0 ? 'up' : 'down'}
            hint="vs prior 30 days"
            icon={Receipt}
          />
          <StatCard label="From smart contracts" value={fmtUsdCompact(va.contractFees30)} hint={`${va.contractShare}% of fees`} icon={FileCode2} />
          <StatCard label="From IBC transfers" value={fmtUsdCompact(va.ibcFees30)} hint={`${va.ibcShare}% of fees`} icon={ArrowLeftRight} />
        </div>

        <ChartCard title="Daily fees by source" description="USD value of fees paid per day, last 90 days.">
          <AreaChart
            data={va.daily}
            index="date"
            stacked
            height={320}
            format="usd"
            series={[
              { key: 'contracts', name: 'Smart contracts', color: palette.carnelian },
              { key: 'ibc', name: 'IBC transfers', color: palette.lapis },
              { key: 'other', name: 'Other', color: palette.slate },
            ]}
          />
        </ChartCard>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          <ChartCard title="IBC fees by counterparty" description="Which chains Juno’s IBC traffic flows to and from.">
            <DonutChart data={va.ibc} format="usd" centerValue={fmtUsdCompact(va.ibcFees30)} centerLabel="IBC · 30d" />
          </ChartCard>
          <section className="card-surface p-5 sm:p-6">
            <SectionTitle title="Top contracts by fees" description="Smart contracts generating the most fees over the last 30 days." />
            <div className="mt-5">
              <ContractsTable data={va.contracts} />
            </div>
          </section>
        </div>
      </Container>
    </>
  )
}
