import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FileCheck2, FileX2, Percent, Users } from 'lucide-react'
import { BarChart } from '@/components/charts'
import { palette } from '@/lib/palette'
import { DashboardHeader } from '@/components/dashboard/shell'
import { ValidatorStatsTable } from '@/components/dashboard/tables'
import { VotingMatrix } from '@/components/dashboard/voting-matrix'
import { ChartCard, Container, SectionTitle, StatCard } from '@/components/ui/primitives'
import { getChain } from '@/lib/chains'
import { getGovernance } from '@/lib/mock/governance'

type Props = { params: Promise<{ chain: string }> }

export const dynamicParams = false
export function generateStaticParams() {
  return [{ chain: 'osmosis' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chain = getChain((await params).chain)
  return { title: `Validator Voting History · ${chain?.name}`, description: `How every ${chain?.name} validator voted on every proposal.` }
}

export default async function VotingHistoryPage({ params }: Props) {
  const chain = getChain((await params).chain)
  if (!chain) notFound()
  const gov = getGovernance(chain.slug)

  const passed = gov.proposals.filter((p) => p.status === 'Passed').length
  const avgTurnout = gov.proposals.reduce((a, p) => a + p.turnout, 0) / gov.proposals.length
  const rows = gov.validators.map((v, i) => ({
    moniker: v.moniker,
    participationRate: v.participationRate,
    votingPower: v.votingPower,
    votes: gov.votes[i],
  }))

  const habits = gov.proposals.slice(-30).map((p) => {
    const idx = gov.proposals.indexOf(p)
    const col = gov.votes.map((row) => row[idx])
    return {
      proposal: `#${p.id}`,
      yes: col.filter((v) => v === 'yes').length,
      no: col.filter((v) => v === 'no').length,
      abstain: col.filter((v) => v === 'abstain').length,
      veto: col.filter((v) => v === 'veto').length,
      missed: col.filter((v) => v === 'missed').length,
    }
  })

  return (
    <>
      <DashboardHeader
        chain={chain}
        title="Validator Voting History"
        description="Need help picking a validator? See how every validator voted on every proposal since joining the set."
      />
      <Container className="space-y-6 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Proposals" value={gov.proposals.length} icon={FileCheck2} hint="Tracked since genesis" />
          <StatCard label="Passed" value={passed} icon={FileX2} hint={`${gov.proposals.length - passed} rejected`} />
          <StatCard label="Average turnout" value={`${avgTurnout.toFixed(1)}%`} icon={Percent} hint="Of eligible validators" />
          <StatCard label="Validators" value={gov.validators.length} icon={Users} hint="Current and former" />
        </div>

        <ChartCard title="Votes by proposal" description="Number of validators casting each vote type, last 30 proposals.">
          <BarChart
            data={habits}
            index="proposal"
            stacked
            height={300}
            format="number"
            series={[
              { key: 'yes', name: 'Yes', color: palette.turquoise },
              { key: 'no', name: 'No', color: palette.carnelian },
              { key: 'abstain', name: 'Abstain', color: palette.lapis },
              { key: 'veto', name: 'Veto', color: palette.sun },
              { key: 'missed', name: 'Did not vote', color: palette.slate },
            ]}
          />
        </ChartCard>

        <section className="card-surface p-5 sm:p-6">
          <SectionTitle title="Voting history table" description="Granular, vote-by-vote breakdown for every proposal and validator." />
          <div className="mt-5">
            <VotingMatrix proposals={gov.proposals} rows={rows} />
          </div>
        </section>

        <section className="card-surface p-5 sm:p-6">
          <SectionTitle title="Voting statistics table" description="Aggregate statistics of vote type and participation rate per validator." />
          <div className="mt-5">
            <ValidatorStatsTable data={gov.validators} />
          </div>
        </section>
      </Container>
    </>
  )
}
