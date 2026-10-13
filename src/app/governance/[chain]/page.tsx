import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CheckCircle2, Gauge, Network, XCircle } from 'lucide-react'
import { BarChart, DonutChart, LineChart } from '@/components/charts'
import { palette } from '@/lib/palette'
import { ChainSwitcher, DashboardHeader } from '@/components/dashboard/shell'
import { ValidatorStatsTable } from '@/components/dashboard/tables'
import { ChartCard, Container, FunFacts, SectionTitle, StatCard } from '@/components/ui/primitives'
import { getChain, governanceChains } from '@/lib/chains'
import { getGovernance, governanceHighlights } from '@/lib/mock/governance'

type Props = { params: Promise<{ chain: string }> }

export const dynamicParams = false
export function generateStaticParams() {
  return governanceChains.map((c) => ({ chain: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chain = getChain((await params).chain)
  return { title: `Governance · ${chain?.name}`, description: `Validator voting habits and participation on ${chain?.name}.` }
}

export default async function GovernancePage({ params }: Props) {
  const chain = getChain((await params).chain)
  if (!chain) notFound()
  const gov = getGovernance(chain.slug)
  const h = governanceHighlights(gov)

  const topActive = gov.validators
    .filter((v) => v.status === 'Active')
    .sort((a, b) => b.votingPower - a.votingPower)
    .slice(0, 20)
  const habits = topActive.map((v) => {
    const voted = v.yes + v.no + v.abstain + v.veto + v.missed || 1
    return {
      moniker: v.moniker.length > 14 ? v.moniker.slice(0, 13) + '…' : v.moniker,
      yes: +((v.yes / voted) * 100).toFixed(1),
      no: +((v.no / voted) * 100).toFixed(1),
      abstain: +((v.abstain / voted) * 100).toFixed(1),
      veto: +((v.veto / voted) * 100).toFixed(1),
      missed: +((v.missed / voted) * 100).toFixed(1),
    }
  })

  const totals = [
    { name: 'Yes', value: gov.totals.yes, color: palette.turquoise },
    { name: 'No', value: gov.totals.no, color: palette.carnelian },
    { name: 'Abstain', value: gov.totals.abstain, color: palette.lapis },
    { name: 'Veto', value: gov.totals.veto, color: palette.sun },
    { name: 'Missed', value: gov.totals.missed, color: palette.slate },
  ]

  const turnout = gov.proposals.slice(-24).map((p) => ({ proposal: `#${p.id}`, turnout: p.turnout }))

  return (
    <>
      <DashboardHeader
        chain={chain}
        title="Governance"
        description="Validator voting habits and participation rate across every proposal."
      >
        <ChainSwitcher chains={governanceChains} current={chain.slug} basePath="/governance" />
      </DashboardHeader>

      <Container className="space-y-6 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Regularly voting validators"
            value={h.regularVoters}
            hint={`≥ 75% participation · of ${h.activeCount} active`}
            icon={CheckCircle2}
          />
          <StatCard label="Average participation rate" value={`${h.averageParticipation}%`} hint="Active set" icon={Gauge} />
          <StatCard label="Rarely voting validators" value={h.rareVoters} hint="≤ 25% participation" icon={XCircle} />
          <StatCard
            label="Nakamoto coefficient"
            value={gov.nakamoto}
            hint="Validators needed to reach ⅓ of voting power"
            icon={Network}
          />
        </div>

        <ChartCard
          title="Active validator voting habits"
          description="Share of each vote type for the 20 largest active validators."
        >
          <BarChart
            data={habits}
            index="moniker"
            stacked
            layout="vertical"
            height={560}
            format="pct0"
            maxValue={100}
            series={[
              { key: 'yes', name: 'Yes', color: palette.turquoise },
              { key: 'no', name: 'No', color: palette.carnelian },
              { key: 'abstain', name: 'Abstain', color: palette.lapis },
              { key: 'veto', name: 'Veto', color: palette.sun },
              { key: 'missed', name: 'Missed', color: palette.slate },
            ]}
          />
        </ChartCard>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <ChartCard
            title="Centralization of voting power"
            description="Kurtosis of validator delegations over time — lower is healthier. Sampled every 25,000 blocks."
          >
            <LineChart
              data={gov.kurtosisSeries}
              index="epoch"
              rawX
              height={300}
              series={[{ key: 'kurtosis', name: 'Kurtosis of voting power', color: palette.lapis }]}
              reference={{ y: 3, label: 'Normal distribution = 3' }}
            />
          </ChartCard>
          <ChartCard title="Total votes cast by type" description="Every vote from every validator, all proposals.">
            <DonutChart data={totals} format="number" centerValue={gov.proposals.length.toString()} centerLabel="Proposals" />
          </ChartCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <ChartCard title="Turnout by proposal" description="Share of eligible validators that voted, last 24 proposals.">
            <BarChart
              data={turnout}
              index="proposal"
              height={260}
              format="pct0"
              maxValue={100}
              series={[{ key: 'turnout', name: 'Turnout', color: palette.sun }]}
            />
          </ChartCard>
          <FunFacts
            facts={[
              { label: 'Most likely to vote', value: `${h.mostLikelyToVote.moniker} · ${h.mostLikelyToVote.participationRate}%` },
              { label: 'Most likely to abstain', value: `${h.mostLikelyToAbstain.moniker} · ${h.mostLikelyToAbstain.abstentionRate}%` },
              { label: 'Least likely to abstain', value: `${h.leastLikelyToAbstain.moniker} · ${h.leastLikelyToAbstain.abstentionRate}%` },
              { label: '# of non-voting active validators', value: String(h.nonVoting) },
            ]}
          />
        </div>

        <section className="card-surface p-5 sm:p-6">
          <SectionTitle
            title="Voting statistics table"
            description="Aggregate statistics of vote type and participation rate per validator."
          />
          <div className="mt-5">
            <ValidatorStatsTable data={gov.validators} />
          </div>
        </section>
      </Container>
    </>
  )
}
