import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { LogoMark } from '@/components/logo'
import { Badge, Card, ChartCard, Container } from '@/components/ui/primitives'
import { fmtPostDate, getPost, posts } from '@/lib/blog'

export function Article({ slug, children }: { slug: string; children: ReactNode }) {
  const post = getPost(slug)
  const more = posts.filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <article>
      <header className="relative overflow-hidden border-b border-white/5">
        <div className="bg-starfield pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-sun-500/10 blur-3xl" />
        <Container className="relative max-w-3xl pb-14 pt-12 sm:pt-16">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-mist-400 transition hover:text-mist-50">
            <ArrowLeft className="h-4 w-4" />
            All posts
          </Link>
          <div className="mt-8 flex animate-rise flex-wrap items-center gap-3">
            <Badge>{post.tag}</Badge>
            <span className="font-mono text-xs text-mist-500">
              {fmtPostDate(post.date)} · {post.readingTime}
            </span>
          </div>
          <h1 className="mt-5 animate-rise font-display text-4xl leading-[1.05] tracking-tight text-mist-50 [animation-delay:60ms] sm:text-6xl">
            {post.title}
          </h1>
          <div className="mt-8 flex animate-rise items-center gap-3 [animation-delay:120ms]">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
              <LogoMark className="h-6 w-6" />
            </span>
            <div className="text-sm">
              <p className="font-medium text-mist-50">Hathor Nodes</p>
              <p className="text-mist-500">Blockchain Insights</p>
            </div>
          </div>
        </Container>
      </header>

      <Container className="max-w-3xl py-14">
        <div className="prose-hathor">{children}</div>
      </Container>

      <Container className="max-w-5xl">
        <div className="border-t border-white/5 pt-12">
          <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-mist-500">More from the blog</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {more.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
                <Card className="h-full p-6 transition group-hover:border-white/15">
                  <p className="font-mono text-xs text-mist-500">{fmtPostDate(p.date)}</p>
                  <h3 className="mt-3 flex items-start justify-between gap-4 font-display text-2xl leading-tight text-mist-50">
                    {p.title}
                    <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-mist-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sun-300" />
                  </h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </article>
  )
}

/** The article's standfirst paragraph */
export function Lede({ children }: { children: ReactNode }) {
  return <p className="font-display text-2xl leading-snug text-mist-100 sm:text-[1.7rem]">{children}</p>
}

/** A figure wrapper for charts inside the prose column */
export function Figure({
  title,
  caption,
  children,
  wide = false,
}: {
  title: string
  caption?: string
  children: ReactNode
  wide?: boolean
}) {
  return (
    <figure className={wide ? 'lg:-mx-20' : undefined}>
      <ChartCard title={title} description={caption}>
        {children}
      </ChartCard>
    </figure>
  )
}

/** A formula / worked-calculation block */
export function Formula({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-sun-400/20 bg-sun-400/[0.04] px-5 py-4">
      {label && <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-sun-300">{label}</p>}
      <div className="whitespace-nowrap font-mono text-[0.95rem] leading-relaxed text-mist-50">{children}</div>
    </div>
  )
}

/** Big-number callouts */
export function Callouts({ items }: { items: { label: string; value: string; note?: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((it) => (
        <Card key={it.label} className="p-5">
          <p className="text-xs uppercase tracking-wider text-mist-500">{it.label}</p>
          <p className="mt-2 font-mono text-3xl text-mist-50 tabular-nums">{it.value}</p>
          {it.note && <p className="mt-1 text-sm text-mist-400">{it.note}</p>}
        </Card>
      ))}
    </div>
  )
}

/** A simple bordered list of pool compositions etc. */
export function DataList({ rows }: { rows: { label: string; value: string; note?: string }[] }) {
  return (
    <ul className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/5 !pl-0 [list-style:none]">
      {rows.map((r) => (
        <li key={r.label} className="!mt-0 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 py-3">
          <span className="text-sm text-mist-400">{r.label}</span>
          <span className="font-mono text-sm text-mist-50">
            {r.value}
            {r.note && <span className="ml-2 text-mist-500">{r.note}</span>}
          </span>
        </li>
      ))}
    </ul>
  )
}
