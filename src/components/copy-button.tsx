'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        } catch {
          /* clipboard unavailable — ignore */
        }
      }}
      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-mist-400 transition hover:bg-white/5 hover:text-mist-50"
      aria-label={copied ? 'Copied' : 'Copy validator address'}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-turquoise-300" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}
