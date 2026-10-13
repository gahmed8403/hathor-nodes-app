'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button, Container } from '@/components/ui/primitives'
import { cn } from '@/lib/format'

const NAV = [
  { href: '/services', label: 'Services', match: ['/services'] },
  { href: '/resources/osmosis', label: 'Resources', match: ['/resources', '/governance', '/liquidity_provider', '/super_fluid_staking', '/validator_voting_history', '/value_accrual', '/incentives_research'] },
  { href: '/blog', label: 'Blog', match: ['/blog'] },
  { href: '/about_us', label: 'About', match: ['/about_us'] },
  { href: '/delegate', label: 'Delegate', match: ['/delegate'] },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (match: string[]) => match.some((m) => pathname.startsWith(m))

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-300',
        scrolled || open ? 'border-white/5 bg-ink-950/80 backdrop-blur-xl' : 'border-transparent bg-transparent',
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="Hathor Nodes home" className="rounded-lg focus-visible:outline-2 focus-visible:outline-sun-300">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/5 bg-white/[0.02] p-1 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm transition',
                isActive(item.match) ? 'bg-white/[0.08] text-mist-50' : 'text-mist-400 hover:text-mist-50',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button href="/contact_us" className="px-4 sm:px-5">
            Work with us
          </Button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-mist-100 md:hidden"
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </Container>

      {open && (
        <nav className="border-t border-white/5 md:hidden" aria-label="Mobile">
          <Container className="flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-xl px-3 py-3 text-base',
                  isActive(item.match) ? 'bg-white/[0.06] text-mist-50' : 'text-mist-300',
                )}
              >
                {item.label}
              </Link>
            ))}
            <Button href="/contact_us" className="mt-2">
              Work with us
            </Button>
          </Container>
        </nav>
      )}
    </header>
  )
}
