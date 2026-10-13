'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { cn } from '@/lib/format'

const topics = ['AI consulting', 'Risk analysis', 'Data science project', 'Validate my chain', 'Something else']

const field =
  'mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-mist-50 placeholder:text-mist-500 focus:border-sun-400/50 focus:outline-none focus:ring-2 focus:ring-sun-400/20'

/** Front-end only: there's no backend, so submission is simulated. */
export function ContactForm() {
  const [topic, setTopic] = useState(topics[0])
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')

  if (state === 'sent') {
    return (
      <div className="grid min-h-[420px] place-content-center text-center" role="status">
        <CheckCircle2 className="mx-auto h-12 w-12 text-turquoise-300" />
        <h2 className="mt-5 font-display text-3xl text-mist-50">Message received</h2>
        <p className="mt-2 text-mist-400">Thanks for reaching out — we’ll get back to you soon.</p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="mx-auto mt-6 text-sm font-medium text-sun-300 hover:text-sun-200"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setState('sending')
        setTimeout(() => setState('sent'), 900)
      }}
      className="space-y-5"
    >
      <fieldset>
        <legend className="text-sm font-medium text-mist-100">What can we help with?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {topics.map((t) => (
            <label
              key={t}
              className={cn(
                'cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sun-400/40',
                topic === t ? 'border-sun-400/50 bg-sun-400/10 text-sun-200' : 'border-white/10 text-mist-400 hover:text-mist-100',
              )}
            >
              <input type="radio" name="topic" value={t} checked={topic === t} onChange={() => setTopic(t)} className="sr-only" />
              {t}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-mist-100">
          Name
          <input required name="name" autoComplete="name" className={field} placeholder="Satoshi" />
        </label>
        <label className="block text-sm font-medium text-mist-100">
          Email
          <input required type="email" name="email" autoComplete="email" className={field} placeholder="you@example.com" />
        </label>
      </div>
      {topic === 'Validate my chain' && (
        <label className="block text-sm font-medium text-mist-100">
          White paper link <span className="font-normal text-mist-500">(optional)</span>
          <input type="url" name="whitepaper" className={field} placeholder="https://" />
        </label>
      )}
      <label className="block text-sm font-medium text-mist-100">
        Message
        <textarea required name="message" rows={6} className={cn(field, 'resize-y')} placeholder="What are you trying to measure, monitor or decide?" />
      </label>
      <button
        type="submit"
        disabled={state === 'sending'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sun-400 px-5 py-3 text-sm font-medium text-ink-950 transition hover:bg-sun-300 disabled:opacity-70 sm:w-auto"
      >
        {state === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {state === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
