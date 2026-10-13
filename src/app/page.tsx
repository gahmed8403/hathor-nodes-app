import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'
import { FeatureTabs } from '@/components/home/feature-tabs'
import { WorkflowConsole } from '@/components/home/workflow-console'
import { Faq } from '@/components/faq'
import { ServicesGrid } from '@/components/services-grid'
import { Button, ChainMark, Container, Eyebrow } from '@/components/ui/primitives'
import { process } from '@/lib/services'
import { governanceChains, validatedChains } from '@/lib/chains'
import { getGovernance } from '@/lib/mock/governance'
import { getLiquidity, getSuperfluid } from '@/lib/mock/osmosis'

export default function HomePage() {
  const gov = getGovernance('osmosis')
  const liquidity = getLiquidity()
  const sfs = getSuperfluid()

  const active = gov.validators.filter((v) => v.status === 'Active')
  const buckets = ['0–20%', '20–40%', '40–60%', '60–80%', '80–100%']
  const participation = buckets.map((bucket, i) => ({
    bucket,
    validators: active.filter((v) => (i === 4 ? v.participationRate >= 80 : v.participationRate >= i * 20 && v.participationRate < (i + 1) * 20)).length,
  }))
  const topIdx = gov.validators
    .map((v, i) => ({ i, vp: v.votingPower }))
    .sort((a, b) => b.vp - a.vp)
    .slice(0, 9)
    .map((x) => x.i)
  const hathorIdx = gov.validators.findIndex((v) => v.moniker === 'Hathor Nodes')
  const gridIdx = [hathorIdx, ...topIdx.filter((i) => i !== hathorIdx)].slice(0, 9)
  const voteGrid = gridIdx.map((i) => ({ moniker: gov.validators[i].moniker, votes: gov.votes[i].slice(-18) }))

  const totals = governanceChains.map((c) => getGovernance(c.slug))
  const proposalCount = totals.reduce((a, g) => a + g.proposals.length, 0)
  const stats = [
    { value: String(validatedChains.length), label: 'Chains we run validators on' },
    { value: '7', label: 'Dashboards built in-house' },
    { value: String(proposalCount), label: 'Proposals tracked' },
    { value: String(totals.reduce((a, g) => a + g.validators.length, 0)), label: 'Validators analysed' },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative -mt-16 overflow-hidden pt-16">
        <div className="bg-starfield pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute left-1/2 top-[-12rem] h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(232_180_76/0.16),transparent)]" />
        <Container className="relative grid items-center gap-16 pb-24 pt-16 sm:pt-24 lg:grid-cols-[1.1fr_1fr] lg:pb-28">
          <div>
            <Eyebrow className="animate-rise">AI consulting for crypto teams</Eyebrow>
            <h1 className="mt-6 animate-rise font-display text-5xl leading-[0.98] tracking-tight text-mist-50 [animation-delay:60ms] sm:text-7xl lg:text-[5.2rem]">
              Put <em className="text-gradient-sun">AI</em> to work on your on-chain data.
            </h1>
            <p className="mt-6 max-w-xl animate-rise text-lg leading-relaxed text-mist-300 [animation-delay:120ms]">
              We help crypto teams bring AI into their everyday workflows, from risk analysis and treasury
              monitoring to governance research and data science. You get answers grounded in real chain data and
              checked by analysts who run validators themselves.
            </p>
            <div className="mt-9 flex animate-rise flex-wrap gap-3 [animation-delay:180ms]">
              <Button href="/contact_us">
                Book a consultation <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Button>
              <Button href="/services" variant="secondary">
                Explore services
              </Button>
            </div>
          </div>
          <div className="animate-rise [animation-delay:200ms] lg:pl-6">
            <WorkflowConsole />
          </div>
        </Container>
      </section>

      {/* Chain strip */}
      <section className="border-y border-white/5 bg-white/[0.012]">
        <Container className="flex flex-col items-center gap-6 py-8 sm:flex-row sm:justify-between">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-mist-500">Operating validators on</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {validatedChains.map((c) => (
              <li key={c.slug} className="flex items-center gap-2.5 text-mist-300">
                <ChainMark name={c.name} color={c.color} size="sm" />
                <span className="font-medium">{c.name}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Services */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow>What we do</Eyebrow>
              <h2 className="mt-5 font-display text-4xl leading-tight tracking-tight text-mist-50 sm:text-5xl">
                AI that understands your chain, not just your chat window.
              </h2>
              <p className="mt-4 text-lg text-mist-400">
                We pair AI with our own blockchain data tooling and years of hands-on validator experience to
                build workflows your team can actually trust.
              </p>
            </div>
            <Button href="/services" variant="secondary">
              All services <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-14">
            <ServicesGrid />
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="border-y border-white/5 bg-white/[0.012] py-24">
        <Container>
          <Eyebrow>How we work</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight tracking-tight text-mist-50">
            From first call to a workflow your team owns.
          </h2>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <li key={p.step} className="relative border-t border-sun-400/30 pt-6">
                <span className="font-mono text-sm text-sun-300">{p.step}</span>
                <h3 className="mt-3 text-lg font-semibold text-mist-50">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-400">{p.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Proof: in-house dashboards */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Our work</Eyebrow>
            <h2 className="mt-5 font-display text-4xl leading-tight tracking-tight text-mist-50 sm:text-5xl">
              We build the same tools for ourselves.
            </h2>
            <p className="mt-4 text-lg text-mist-400">
              Our public dashboards cover governance, liquidity, staking and every vote cast. They're a sample of the
              data work we bring to client projects.
            </p>
          </div>
          <div className="mt-14">
            <FeatureTabs
              participation={participation}
              underlying={liquidity.underlying}
              sfsOverTime={sfs.overTime}
              voteGrid={voteGrid}
            />
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section>
        <Container>
          <dl className="grid grid-cols-2 overflow-hidden rounded-3xl border border-white/5 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`border-white/5 p-8 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b lg:border-b-0' : ''} ${i === 1 ? 'lg:border-r' : ''}`}
              >
                <dt className="text-sm text-mist-500">{s.label}</dt>
                <dd className="mt-2 font-display text-5xl text-mist-50">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-24 sm:py-32">
        <Container className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-5 font-display text-4xl leading-tight tracking-tight text-mist-50">Frequently asked questions</h2>
            <p className="mt-4 text-mist-400">
              Can’t find what you’re looking for? Reach out and we’ll get back to you within a day or two.
            </p>
            <Link href="/contact_us" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-sun-300 hover:text-sun-200">
              <Mail className="h-4 w-4" /> Contact the team
            </Link>
          </div>
          <Faq />
        </Container>
      </section>

      {/* CTA */}
      <section>
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] border border-sun-400/20 bg-gradient-to-br from-sun-400/[0.12] via-ink-900 to-ink-950 px-6 py-16 text-center sm:px-16">
            <div className="bg-starfield pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-4xl leading-tight tracking-tight text-mist-50 sm:text-5xl">
                Ready to bring AI into your crypto workflows?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-mist-300">
                Tell us what you’re trying to measure, monitor or decide. We’ll show you what an AI-powered
                workflow could look like, usually within a week.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href="/contact_us">Book a consultation</Button>
                <Button href="/delegate" variant="secondary">
                  Or delegate with us
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
