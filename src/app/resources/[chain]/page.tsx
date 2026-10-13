import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import { dashboardIcons } from '@/components/dashboard/shell'
import { Badge, ChainMark, Container, PageHeader } from '@/components/ui/primitives'
import { dashboardsByChain, getChain, resourceChains } from '@/lib/chains'
import { cn } from '@/lib/format'

type Props = { params: Promise<{ chain: string }> }

export const dynamicParams = false
export function generateStaticParams() {
  return resourceChains.map((c) => ({ chain: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chain = getChain((await params).chain)
  return { title: `Resources · ${chain?.name}`, description: `Dashboards and research for ${chain?.name}.` }
}

export default async function ResourcesPage({ params }: Props) {
  const chain = getChain((await params).chain)
  if (!chain) notFound()
  const dashboards = dashboardsByChain[chain.slug] ?? []

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title={
          <>
            Dashboards for <em className="text-gradient-sun">{chain.name}</em>
          </>
        }
        description={chain.blurb}
      />

      <Container className="sticky top-16 z-30 -mt-px border-b border-white/5 bg-ink-950/85 backdrop-blur-xl">
        <nav aria-label="Chains" className="-mb-px flex gap-1 overflow-x-auto">
          {resourceChains.map((c) => {
            const active = c.slug === chain.slug
            return (
              <Link
                key={c.slug}
                href={`/resources/${c.slug}`}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex shrink-0 items-center gap-2.5 border-b-2 px-4 py-4 text-sm transition',
                  active ? 'border-sun-400 text-mist-50' : 'border-transparent text-mist-400 hover:text-mist-100',
                )}
              >
                <ChainMark name={c.name} color={c.color} size="sm" />
                {c.name}
                <span className="rounded-full bg-white/5 px-1.5 font-mono text-[0.65rem] text-mist-500">
                  {dashboardsByChain[c.slug]?.length ?? 0}
                </span>
              </Link>
            )
          })}
        </nav>
      </Container>

      <section className="py-14">
        <Container className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dashboards.map((d, i) => {
            const Icon = dashboardIcons[d.icon]
            return (
              <Link
                key={d.href}
                href={d.href}
                className={cn(
                  'card-surface group relative flex min-h-64 flex-col overflow-hidden p-7 transition duration-300 hover:-translate-y-0.5 hover:border-sun-400/25',
                  i === 0 && dashboards.length > 2 && 'lg:col-span-2',
                )}
              >
                <div
                  className="pointer-events-none absolute -bottom-24 -right-16 h-56 w-56 rounded-full opacity-0 blur-3xl transition duration-500 group-hover:opacity-25"
                  style={{ background: chain.color }}
                />
                <div className="relative flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-sun-300 transition group-hover:border-sun-400/40 group-hover:bg-sun-400 group-hover:text-ink-950">
                    <Icon className="h-5 w-5" />
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-mist-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sun-300" />
                </div>
                <div className="relative mt-auto pt-10">
                  {d.badge && <Badge className="mb-3">{d.badge}</Badge>}
                  <h2 className="font-display text-2xl leading-tight text-mist-50 sm:text-3xl">{d.title}</h2>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-mist-400">{d.description}</p>
                </div>
              </Link>
            )
          })}
        </Container>
      </section>
    </>
  )
}
