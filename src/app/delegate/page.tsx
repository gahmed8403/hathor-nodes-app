import type { Metadata } from 'next'
import { ArrowUpRight } from 'lucide-react'
import { CopyButton } from '@/components/copy-button'
import { Card, ChainMark, Container, PageHeader } from '@/components/ui/primitives'
import { validatedChains } from '@/lib/chains'
import { getGovernance } from '@/lib/mock/governance'

export const metadata: Metadata = {
  title: 'Delegate',
  description: 'Stake with Hathor Nodes on Osmosis, Stargaze, Bitsong and Lum.',
}

export default function DelegatePage() {
  return (
    <>
      <PageHeader
        eyebrow="Delegate"
        title={
          <>
            Put your stake behind <em className="text-gradient-sun">informed governance.</em>
          </>
        }
        description="Hathor Nodes validates on four Cosmos chains. Pick a network to delegate through its wallet or explorer."
      />
      <section className="py-16">
        <Container className="grid gap-5 md:grid-cols-2">
          {validatedChains.map((chain) => {
            const gov = chain.hasResources ? getGovernance(chain.slug) : null
            const hathor = gov?.validators.find((v) => v.moniker === 'Hathor Nodes')
            return (
              <Card key={chain.slug} className="group relative flex flex-col overflow-hidden p-7">
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-20 blur-3xl transition group-hover:opacity-35"
                  style={{ background: chain.color }}
                />
                <div className="relative flex items-center gap-4">
                  <ChainMark name={chain.name} color={chain.color} size="lg" />
                  <div>
                    <h2 className="font-display text-3xl text-mist-50">{chain.name}</h2>
                    <p className="font-mono text-xs uppercase tracking-wider text-mist-500">${chain.token}</p>
                  </div>
                </div>
                <p className="relative mt-5 flex-1 leading-relaxed text-mist-400">{chain.blurb}</p>

                {hathor && (
                  <dl className="relative mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                      <dt className="text-xs text-mist-500">Governance participation</dt>
                      <dd className="mt-1 font-mono text-lg text-turquoise-300">{hathor.participationRate}%</dd>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                      <dt className="text-xs text-mist-500">Share of voting power</dt>
                      <dd className="mt-1 font-mono text-lg text-mist-50">{hathor.votingPowerShare}%</dd>
                    </div>
                  </dl>
                )}

                {chain.validatorAddress && (
                  <div className="relative mt-4 flex items-center gap-2 rounded-xl border border-white/5 bg-ink-950/60 px-3 py-2">
                    <code className="min-w-0 flex-1 truncate font-mono text-xs text-mist-400">{chain.validatorAddress}</code>
                    <CopyButton value={chain.validatorAddress} />
                  </div>
                )}

                <a
                  href={chain.delegateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="relative mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.06] px-5 py-3 text-sm font-medium text-mist-50 transition hover:bg-sun-400 hover:text-ink-950"
                >
                  Delegate on {chain.name} <ArrowUpRight className="h-4 w-4" />
                </a>
              </Card>
            )
          })}
        </Container>
      </section>
    </>
  )
}
