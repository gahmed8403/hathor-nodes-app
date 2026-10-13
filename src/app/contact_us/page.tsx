import type { Metadata } from 'next'
import { BarChart3, Blocks, Bot, ShieldCheck } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { Card, Container, PageHeader } from '@/components/ui/primitives'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Book an AI consulting session, request a risk review or analysis, or ask us to validate your chain.',
}

const reasons = [
  { icon: Bot, title: 'Bring AI into your workflow', body: 'Tell us about the research, reporting or monitoring you’d like to speed up, and we’ll show you what’s possible.' },
  { icon: ShieldCheck, title: 'Get a risk review', body: 'Treasury, LP positions or protocol exposure, stress-tested against real on-chain history.' },
  { icon: BarChart3, title: 'Commission an analysis', body: 'Have a metric, model or dashboard in mind? This kind of data work is what we love doing.' },
  { icon: Blocks, title: 'Validate your chain', body: 'Building a blockchain? Send us the details and a white paper. We’re always keen to support new projects.' },
]

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Let’s put your <em className="text-gradient-sun">data to work.</em>
          </>
        }
        description="Book a consultation or ask us anything. We usually reply within one to two business days."
      />
      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            {reasons.map((r) => (
              <Card key={r.title} className="flex gap-4 p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-sun-400/30 bg-sun-400/10 text-sun-300">
                  <r.icon className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="font-medium text-mist-50">{r.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-mist-400">{r.body}</p>
                </div>
              </Card>
            ))}
          </div>
          <Card className="p-6 sm:p-8">
            <ContactForm />
          </Card>
        </Container>
      </section>
    </>
  )
}
