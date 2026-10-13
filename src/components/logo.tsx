import { cn } from '@/lib/format'

/** Hathor's emblem: a sun disc cradled between cow horns. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className={cn('h-8 w-8', className)}>
      <defs>
        <linearGradient id="hn-sun" x1="10" y1="8" x2="30" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f8e2a6" />
          <stop offset="0.55" stopColor="#e8b44c" />
          <stop offset="1" stopColor="#a8721a" />
        </linearGradient>
      </defs>
      <path
        d="M5 6c0 9 4.5 15.5 11 17.6M35 6c0 9-4.5 15.5-11 17.6"
        stroke="url(#hn-sun)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="20" cy="21" r="8.5" fill="url(#hn-sun)" />
      <circle cx="20" cy="21" r="8.5" stroke="#07080c" strokeOpacity="0.35" strokeWidth="1" />
      <path d="M20 31.5v4.5M16.5 36h7" stroke="url(#hn-sun)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="font-display text-[1.45rem] leading-none tracking-tight text-mist-50">
        Hathor <span className="text-gradient-sun italic">Nodes</span>
      </span>
    </span>
  )
}
