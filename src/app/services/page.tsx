import type { Metadata } from 'next'
import { ArrowRight, Building2, Coins, KeyRound, LineChart, Lock, Scale, ServerCog, UserCheck } from 'lucide-react'
import { ServicesGrid } from '@/components/services-grid'
import { Button, Card, Container, Eyebrow, PageHeader } from '@/components/ui/primitives'
import { process } from '@/lib/services'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'AI consulting for crypto teams: risk analysis, on-chain data science, governance intelligence and AI integrations for your workflows.',
}

const audiences = [
  {
    icon: Building2,
    title: 'DAOs & treasuries',
    body: 'Monitor treasury risk, summarize proposals for voters, and produce transparent reports for your community.',
  },
  {
    icon: LineChart,
    title: 'Funds & trading desks',
    body: 'Faster research on new pools and tokens, stress tests on positions, and alerts when on-chain conditions change.',
  },
  {
    icon: Coins,
    title: 'Protocols & chains',
    body: 'Understand liquidity, incentives and user behaviour, and give your community self-serve analytics.',
  },
  {
    icon: ServerCog,
    title: 'Validators & infra teams',
    body: 'Governance tracking, delegation analytics and operational reporting, built by people who run validators.',
  },
]

const engagements = [
  {
    name: 'Workshop',
    duration: '1–2 days',
    body: 'A hands-on session for your team: how to use AI for analysis and research, with exercises on your own data.',
    points: ['Tailored to your workflows', 'Prompt & evaluation playbook', 'Follow-up Q&A'],
  },
  {
    name: 'Prototype sprint',
    duration: '2–4 weeks',
    body: 'We pick one high-value workflow, such as a risk report, research assistant or monitor, and ship a working version on your data.',
    points: ['Working prototype', 'Measured against your baseline', 'Roadmap to production'],
    featured: true,
  },
  {
    name: 'Ongoing partnership',
    duration: 'Monthly',
    body: 'An embedded data and AI team that keeps building, maintaining and improving your AI-powered workflows.',
    points: ['Dedicated analysts', 'New workflows each cycle', 'Monitoring & evaluations'],
  },
]

const principles = [
  {
    icon: KeyRound,
    title: 'Read-only by default',
    body: 'We never need your private keys. Integrations read chain data and your systems; anything that acts needs human sign-off.',
  },
  {
    icon: UserCheck,
    title: 'Humans check the numbers',
    body: 'AI speeds up the analysis, and our analysts verify the extraction, method and results before anything reaches you.',
  },
  {
    icon: Lock,
    title: 'Your data stays yours',
    body: 'We follow your data-handling requirements and design workflows so that sensitive information goes only where it should.',
  },
  {
    icon: Scale,
    title: 'Measured, not hyped',
    body: 'Every workflow ships with evaluations, so you can see how accurate it is and where it still needs a person.',
  },
]

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={
          <>
            AI, fluent in <em className="text-gradient-sun">crypto.</em>
          </>
        }
        description="We design, build and run AI-powered workflows for crypto teams. They cover risk analysis, data science and governance research, grounded in on-chain data and checked by experienced analysts."
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/contact_us">
            Book a consultation <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/resources/osmosis" variant="secondary">
            See our data work
          </Button>
        </div>
      </PageHeader>

      <section className="py-20">
        <Container>
          <Eyebrow>Offerings</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight tracking-tight text-mist-50">
            Six ways we put AI to work for you.
          </h2>
          <div className="mt-12">
            <ServicesGrid detailed />
          </div>
        </Container>
      </section>

      <section className="border-y border-white/5 bg-white/[0.012] py-20">
        <Container>
          <Eyebrow>Who we help</Eyebrow>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((a) => (
              <div key={a.title}>
                <a.icon className="h-6 w-6 text-sun-300" />
                <h3 className="mt-4 font-semibold text-mist-50">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-400">{a.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <Eyebrow>Engagements</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight tracking-tight text-mist-50">
            Start small, scale what works.
          </h2>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {engagements.map((e) => (
              <Card
                key={e.name}
                className={`flex flex-col p-7 ${e.featured ? 'border-sun-400/40 bg-gradient-to-b from-sun-400/[0.08] to-transparent' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-3xl text-mist-50">{e.name}</h3>
                  {e.featured && (
                    <span className="rounded-full bg-sun-400 px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-ink-950">
                      Most popular
                    </span>
                  )}
                </div>
                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-mist-500">{e.duration}</p>
                <p className="mt-5 flex-1 leading-relaxed text-mist-400">{e.body}</p>
                <ul className="mt-6 space-y-2 border-t border-white/5 pt-5 text-sm text-mist-300">
                  {e.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-sun-400" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-4">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <Eyebrow>How we work</Eyebrow>
            <h2 className="mt-5 font-display text-4xl leading-tight tracking-tight text-mist-50">
              A clear path from idea to production.
            </h2>
          </div>
          <ol className="space-y-6">
            {process.map((p) => (
              <li key={p.step} className="flex gap-5 border-b border-white/5 pb-6 last:border-0">
                <span className="font-mono text-sm text-sun-300">{p.step}</span>
                <div>
                  <h3 className="font-semibold text-mist-50">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-mist-400">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <Eyebrow>Principles</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight tracking-tight text-mist-50">
            Built for the stakes of financial data.
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {principles.map((p) => (
              <Card key={p.title} className="flex gap-5 p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-sun-300">
                  <p.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-mist-50">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist-400">{p.body}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] border border-sun-400/20 bg-gradient-to-br from-sun-400/[0.12] via-ink-900 to-ink-950 px-6 py-16 text-center sm:px-16">
            <div className="bg-starfield pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-4xl leading-tight tracking-tight text-mist-50 sm:text-5xl">
                Have a question your data should be able to answer?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-mist-300">
                Tell us about it. We’ll come back with a plan for answering it with AI, and what it would take.
              </p>
              <div className="mt-8 flex justify-center">
                <Button href="/contact_us">Book a consultation</Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
