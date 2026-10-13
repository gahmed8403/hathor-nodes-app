import Link from 'next/link'
import type { ReactNode } from 'react'
import { ChevronRight, Coins, Droplets, FlaskConical, Landmark, Layers, Vote } from 'lucide-react'
import { ChainMark, Container, DemoDataNote } from '@/components/ui/primitives'
import { type Chain, type Dashboard } from '@/lib/chains'
import { cn } from '@/lib/format'

export const dashboardIcons = {
  droplets: Droplets,
  layers: Layers,
  landmark: Landmark,
  vote: Vote,
  flask: FlaskConical,
  coins: Coins,
} satisfies Record<Dashboard['icon'], unknown>

/** Pill switcher for dashboards that exist on several chains (e.g. governance) */
export function ChainSwitcher({ chains, current, basePath }: { chains: Chain[]; current: string; basePath: string }) {
  return (
    <nav aria-label="Select chain" className="flex flex-wrap gap-2">
      {chains.map((c) => {
        const active = c.slug === current
        return (
          <Link
            key={c.slug}
            href={`${basePath}/${c.slug}`}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-4 text-sm transition',
              active ? 'border-white/20 bg-white/[0.07] text-mist-50' : 'border-white/5 text-mist-400 hover:border-white/15 hover:text-mist-100',
            )}
          >
            <ChainMark name={c.name} color={c.color} size="sm" />
            {c.name}
          </Link>
        )
      })}
    </nav>
  )
}

export function DashboardHeader({
  chain,
  title,
  description,
  children,
}: {
  chain: Chain
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="bg-starfield pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute -top-32 right-0 h-72 w-[40rem] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: chain.color }}
      />
      <Container className="relative pb-10 pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-mist-500">
          <Link href={`/resources/${chain.slug}`} className="hover:text-mist-100">
            Resources
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/resources/${chain.slug}`} className="hover:text-mist-100">
            {chain.name}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-mist-300">{title}</span>
        </nav>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <ChainMark name={chain.name} color={chain.color} size="lg" />
            <div>
              <h1 className="font-display text-4xl leading-tight tracking-tight text-mist-50 sm:text-5xl">{title}</h1>
              <p className="mt-1 max-w-2xl text-mist-400">{description}</p>
            </div>
          </div>
          {children}
        </div>
        <DemoDataNote className="mt-6" />
      </Container>
    </section>
  )
}
