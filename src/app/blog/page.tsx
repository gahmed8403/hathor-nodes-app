import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Badge, Card, Container, PageHeader } from '@/components/ui/primitives'
import { fmtPostDate, posts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Deep dives from Hathor Nodes on AI workflows, risk, governance and on-chain data, plus our Osmosis in Graphs archive.',
}

export default function BlogPage() {
  const [featured, ...rest] = posts

  return (
    <>
      <PageHeader
        eyebrow="Press"
        title={
          <>
            Field notes on <span className="text-gradient-sun italic">AI &amp; on-chain data.</span>
          </>
        }
        description="Long-form analysis from the Hathor Nodes team: AI workflows, risk, governance, and the numbers behind Cosmos liquidity and staking."
      />

      <Container className="py-14">
        <Link href={`/blog/${featured.slug}`} className="group block">
          <Card className="relative overflow-hidden p-7 transition group-hover:border-white/15 sm:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sun-400/10 blur-3xl transition group-hover:bg-sun-400/15" />
            <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>Latest</Badge>
                  <span className="font-mono text-xs text-mist-500">
                    {fmtPostDate(featured.date)} · {featured.readingTime}
                  </span>
                </div>
                <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight text-mist-50 sm:text-5xl">
                  {featured.title}
                </h2>
              </div>
              <div>
                <p className="leading-relaxed text-mist-300">{featured.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-sun-300">
                  Read full story
                  <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Card>
        </Link>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <Card className="flex h-full flex-col p-7 transition group-hover:border-white/15">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-mist-300">{post.tag}</span>
                  <span className="font-mono text-xs text-mist-500">
                    {fmtPostDate(post.date)} · {post.readingTime}
                  </span>
                </div>
                <h2 className="mt-5 font-display text-2xl leading-tight tracking-tight text-mist-50 sm:text-3xl">{post.title}</h2>
                <p className="mt-4 line-clamp-4 flex-1 text-sm leading-relaxed text-mist-400">{post.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-sun-300">
                  Read full story
                  <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </>
  )
}
