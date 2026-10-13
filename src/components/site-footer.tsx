import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Container } from '@/components/ui/primitives'
import { resourceChains } from '@/lib/chains'

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  )
}

const columns = [
  {
    title: 'Services',
    links: [
      { href: '/services#risk-analysis', label: 'Risk analysis' },
      { href: '/services#ai-integration', label: 'AI integration' },
      { href: '/services#data-science', label: 'Data science' },
      { href: '/services#governance-intelligence', label: 'Governance intelligence' },
    ],
  },
  {
    title: 'Resources',
    links: resourceChains.map((c) => ({ href: `/resources/${c.slug}`, label: c.name })),
  },
  {
    title: 'Dashboards',
    links: [
      { href: '/governance/osmosis', label: 'Governance' },
      { href: '/liquidity_provider/osmosis', label: 'Liquidity Provider' },
      { href: '/super_fluid_staking/osmosis', label: 'SuperFluid Staking' },
      { href: '/validator_voting_history/osmosis', label: 'Voting History' },
    ],
  },
  {
    title: 'Hathor Nodes',
    links: [
      { href: '/about_us', label: 'About Us' },
      { href: '/blog', label: 'Blog' },
      { href: '/delegate', label: 'Delegate' },
      { href: '/contact_us', label: 'Contact' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-white/5">
      <Container className="grid gap-12 py-14 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist-400">
            AI consulting for crypto teams: risk analysis, on-chain data science and automated workflows, from a team that
            runs validators across the Cosmos.
          </p>
          <a
            href="https://twitter.com/HathorNodes"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-2 text-sm text-mist-300 transition hover:border-white/20 hover:text-mist-50"
          >
            <XIcon className="h-3.5 w-3.5" />
            @HathorNodes
          </a>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-mist-500">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-mist-300 transition hover:text-sun-200">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-white/5 py-6 text-xs text-mist-500 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Hathor Nodes. All rights reserved.</p>
        <p>Dashboards on this site use illustrative demo data.</p>
      </Container>
    </footer>
  )
}
