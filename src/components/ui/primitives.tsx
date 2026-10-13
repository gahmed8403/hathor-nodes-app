import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { ArrowUpRight, TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/format'

export function Container({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)} {...props} />
}

type ButtonProps = {
  href: string
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  children: ReactNode
  external?: boolean
}

export function Button({ href, variant = 'primary', className, children, external }: ButtonProps) {
  const styles = cn(
    'group inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition duration-200',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun-300',
    variant === 'primary' &&
      'bg-sun-400 text-ink-950 shadow-[0_0_0_1px_rgb(255_255_255/0.15)_inset,0_8px_30px_-8px_var(--color-sun-500)] hover:bg-sun-300',
    variant === 'secondary' && 'border border-white/10 bg-white/[0.04] text-mist-50 hover:border-white/20 hover:bg-white/[0.07]',
    variant === 'ghost' && 'text-mist-300 hover:text-mist-50',
    className,
  )
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={styles}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={styles}>
      {children}
    </Link>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-sun-300', className)}>
      <span className="h-px w-6 bg-sun-400/60" />
      {children}
    </p>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="bg-starfield pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-sun-500/10 blur-3xl" />
      <Container className="relative pb-14 pt-16 sm:pt-20">
        {eyebrow && <Eyebrow className="animate-rise">{eyebrow}</Eyebrow>}
        <h1 className="mt-5 max-w-4xl animate-rise font-display text-4xl leading-[1.05] tracking-tight text-mist-50 [animation-delay:60ms] sm:text-6xl">
          {title}
        </h1>
        {description && (
          <div className="mt-5 max-w-2xl animate-rise text-lg leading-relaxed text-mist-300 [animation-delay:120ms]">
            {description}
          </div>
        )}
        {children && <div className="mt-8 animate-rise [animation-delay:180ms]">{children}</div>}
      </Container>
    </section>
  )
}

export function Card({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('card-surface', className)} {...props} />
}

export function SectionTitle({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-mist-50">{title}</h2>
        {description && <p className="mt-1 text-sm text-mist-400">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function ChartCard({
  title,
  description,
  children,
  className,
  action,
}: {
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  className?: string
  action?: ReactNode
}) {
  return (
    <Card className={cn('flex flex-col p-5 sm:p-6', className)}>
      <SectionTitle title={title} description={description} action={action} />
      <div className="mt-5 flex-1">{children}</div>
    </Card>
  )
}

export function StatCard({
  label,
  value,
  change,
  hint,
  icon: Icon,
  tone = 'neutral',
}: {
  label: string
  value: ReactNode
  change?: string
  hint?: string
  icon?: LucideIcon
  tone?: 'up' | 'down' | 'neutral'
}) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-mist-400">{label}</p>
        {Icon && (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-sun-300">
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <p className="mt-3 font-mono text-3xl font-medium tracking-tight text-mist-50 tabular-nums">{value}</p>
      {(change || hint) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono',
                tone === 'up' && 'bg-turquoise-400/10 text-turquoise-300',
                tone === 'down' && 'bg-carnelian-400/10 text-carnelian-300',
                tone === 'neutral' && 'bg-white/5 text-mist-300',
              )}
            >
              {tone === 'up' && <TrendingUp className="h-3 w-3" />}
              {tone === 'down' && <TrendingDown className="h-3 w-3" />}
              {change}
            </span>
          )}
          {hint && <span className="text-mist-500">{hint}</span>}
        </div>
      )}
    </Card>
  )
}

export function FunFacts({ title = 'Fun facts', facts }: { title?: string; facts: { label: string; value: string }[] }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-mist-50">{title}</h2>
      <dl className="mt-4 divide-y divide-white/5">
        {facts.map((f) => (
          <div key={f.label} className="py-3.5 first:pt-0 last:pb-0">
            <dt className="text-xs uppercase tracking-wider text-mist-500">{f.label}</dt>
            <dd className="mt-1 text-sm font-medium text-mist-50">{f.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-sun-400/30 bg-sun-400/10 px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-sun-200',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function ChainMark({ name, color, size = 'md' }: { name: string; color: string; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span
      className={cn(
        'relative grid shrink-0 place-items-center rounded-full font-display text-ink-950',
        size === 'sm' && 'h-7 w-7 text-sm',
        size === 'md' && 'h-10 w-10 text-lg',
        size === 'lg' && 'h-14 w-14 text-2xl',
      )}
      style={{
        background: `radial-gradient(circle at 30% 30%, color-mix(in oklab, ${color} 55%, white), ${color} 60%, color-mix(in oklab, ${color} 60%, black))`,
        boxShadow: `0 0 24px -6px ${color}`,
      }}
      aria-hidden="true"
    >
      {name[0]}
    </span>
  )
}

export function DemoDataNote({ className }: { className?: string }) {
  return (
    <p className={cn('flex items-center gap-2 text-xs text-mist-500', className)}>
      <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-turquoise-400" />
      Illustrative demo data · generated in the browser, not live chain data
    </p>
  )
}

export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-1 text-sm font-medium text-sun-300 hover:text-sun-200">
      {children}
      <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  )
}
