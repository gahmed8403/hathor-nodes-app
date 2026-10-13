import { Plus } from 'lucide-react'

export const faqs = [
  {
    q: 'What does an AI consulting engagement look like?',
    a: 'Usually it starts with a short discovery call about the decisions you’re trying to make and the data behind them. From there we either run a workshop for your team or build a prototype workflow on your real data in a few weeks. If it proves its value, we harden it and hand it over, or keep running it with you.',
  },
  {
    q: 'Is it safe to use AI for financial and risk analysis?',
    a: 'It is when it’s set up properly. Our integrations are read-only by default and never need private keys. AI answers are grounded in data pulled straight from chain and your systems, every workflow ships with evaluations, and an analyst reviews the outputs that matter.',
  },
  {
    q: 'Do we need an in-house data team to work with you?',
    a: 'No. Many clients don’t have one. We can build and run the whole workflow, or work alongside your engineers and analysts and train them to own it.',
  },
  {
    q: 'Can you provide me this piece of data or analysis?',
    a: 'Of course! We’re always looking for future pieces of analytics to work on, as well as other blockchains to validate for. Just fill out our contact page and we’ll get back to you ASAP.',
  },
  {
    q: 'What’s the hardest part of being a validator?',
    a: 'The hardest — yet most fun — part is staying up to date on community concerns and needs. Knowing what our delegators focus on so we can make educated decisions on proposals is a never-ending effort. Each community has its own unique culture and members that are a joy to interact with!',
  },
  {
    q: 'Are you planning on expanding out of the Cosmos ecosystem?',
    a: 'Currently, we’re focused on expansion within the Cosmos. At some point it’d be interesting to also run nodes and pools on Ethereum, Cardano, and other blockchains.',
  },
  {
    q: 'I’m making a blockchain — would you validate for it?',
    a: 'Definitely! Just reach out through the contact page with information about your chain, and a link to a white paper if possible. We’re always interested in finding new projects to support.',
  },
]

export function Faq() {
  return (
    <div className="divide-y divide-white/5 border-y border-white/5">
      {faqs.map((f) => (
        <details key={f.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-lg py-5 text-left text-base font-medium text-mist-50 focus-visible:outline-2 focus-visible:outline-sun-300 sm:text-lg">
            {f.q}
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-mist-400 transition group-open:rotate-45 group-open:border-sun-400/40 group-open:text-sun-300">
              <Plus className="h-4 w-4" />
            </span>
          </summary>
          <p className="max-w-3xl pb-6 pr-12 leading-relaxed text-mist-400">{f.a}</p>
        </details>
      ))}
    </div>
  )
}
