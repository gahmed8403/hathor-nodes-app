import type { Metadata } from 'next'
import { Database, Landmark, Scale, Users } from 'lucide-react'
import { Button, Card, Container, Eyebrow, PageHeader } from '@/components/ui/primitives'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Friends that blockchain together, stay together. Meet the team behind Hathor Nodes.',
}

const pillars = [
  {
    icon: Scale,
    title: 'Decentralization',
    body: 'Hathor Nodes monitors its voting power relative to the rest of the validator set, and will increase or decrease its self-bond should we become an outlier.',
  },
  {
    icon: Landmark,
    title: 'Governance',
    body: 'We actively participate in governance by voting on proposals and making our reasoning available — by request or right here on our website.',
  },
  {
    icon: Users,
    title: 'Community',
    body: 'We actively engage with our delegators and the broader community of each blockchain. Fostering a sense of community with our fellow Cosmonauts is critical to us.',
  },
  {
    icon: Database,
    title: 'Data integrity',
    body: 'We hold ourselves to the highest standards of data integrity. Every analysis has its extraction, massaging and methodology vetted by an experienced data scientist and engineer.',
  },
]

const timeline = [
  { label: 'Investing & following crypto', detail: 'Years of watching the space as enthusiasts.' },
  { label: 'Building professional skills', detail: 'Engineering, DevOps and analytics in the industry.' },
  { label: 'Hathor Nodes is born', detail: 'Giving back to the crypto world as a validator.' },
  { label: 'Osmosis in Graphs', detail: 'Deep dives and governance metrics for the Cosmos.' },
  { label: 'AI consulting', detail: 'Bringing AI-powered analysis to crypto teams.' },
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title={
          <>
            Friends that blockchain together, <em className="text-gradient-sun">stay together.</em>
          </>
        }
        description="A small team of engineers, DevOps folks and analysts who decided to give back to the crypto world."
      />

      <section className="py-20 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-6 text-lg leading-relaxed text-mist-300">
            <p>
              As blockchain enthusiasts, the team at Hathor Nodes has been investing in and following the crypto space for
              years. After developing our engineering, DevOps and analytical skills in the professional world, we decided to
              give back to the crypto world. From there, <span className="text-mist-50">Hathor Nodes was born.</span>
            </p>
            <p>
              Aiming to take validating and blockchain analytics to the next level, we’ve been tirelessly working to
              understand the Cosmos SDK and the needs of its community so we can provide analytics solutions.
            </p>
            <p>
              From <span className="text-mist-50">Osmosis in Graphs</span> to our validator governance metrics, we hope to
              equip members of the Cosmos ecosystem to make educated governance decisions and steer this ecosystem
              toward the bright future it has ahead of it.
            </p>
            <p>
              Today, that same data expertise powers our <span className="text-mist-50">AI consulting practice</span>.
              We help crypto teams bring AI into their workflows for risk analysis, research, reporting and data
              science, built on the on-chain tooling we’ve refined while running validators.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button href="/services">Our services</Button>
              <Button href="/delegate" variant="secondary">
                Delegate
              </Button>
            </div>
          </div>

          <Card className="p-6 sm:p-8">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-mist-500">Our story</p>
            <ol className="relative mt-6 space-y-7 border-l border-white/10 pl-6">
              {timeline.map((t, i) => (
                <li key={t.label} className="relative">
                  <span
                    className={`absolute -left-[1.95rem] top-1 h-3 w-3 rounded-full border-2 ${
                      i === timeline.length - 1 ? 'border-sun-400 bg-sun-400' : 'border-ink-500 bg-ink-950'
                    }`}
                  />
                  <p className="font-medium text-mist-50">{t.label}</p>
                  <p className="mt-1 text-sm text-mist-400">{t.detail}</p>
                </li>
              ))}
            </ol>
          </Card>
        </Container>
      </section>

      <section>
        <Container>
          <Eyebrow>What we stand for</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight tracking-tight text-mist-50">
            Four commitments to our delegators.
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {pillars.map((p, i) => (
              <Card key={p.title} className="group p-7 transition hover:border-sun-400/25">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl border border-sun-400/30 bg-sun-400/10 text-sun-300">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-xs text-mist-500">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-mist-50">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-mist-400">{p.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
