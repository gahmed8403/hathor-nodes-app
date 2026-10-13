import { Check, Sparkles } from 'lucide-react'

const steps = [
  { tool: 'query_rpc', detail: 'pool #1 reserves · 30d history' },
  { tool: 'fetch_prices', detail: 'ATOM, OSMO · hourly' },
  { tool: 'run_stress_test', detail: '−40% ATOM shock · 10k paths' },
]

const findings = [
  { label: 'Impermanent loss at −40%', value: '−3.2%', tone: 'text-carnelian-300' },
  { label: 'Exit slippage, full position', value: '0.8%', tone: 'text-sun-200' },
  { label: 'Validator concentration', value: 'Low', tone: 'text-turquoise-300' },
]

/** Illustrative hero visual: an AI-driven risk review of an LP position. */
export function WorkflowConsole() {
  return (
    <div className="relative" aria-hidden="true">
      <div className="pointer-events-none absolute -inset-10 rounded-full bg-sun-500/10 blur-3xl" />
      <div className="card-surface relative overflow-hidden bg-ink-900/80 shadow-2xl backdrop-blur">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-carnelian-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-sun-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-turquoise-400/70" />
          <span className="ml-3 font-mono text-[0.7rem] text-mist-500">risk-desk · treasury workspace</span>
        </div>

        <div className="space-y-4 p-5 text-sm">
          {/* user prompt */}
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-white/[0.06] px-4 py-3 text-mist-100">
            Stress-test our ATOM/OSMO LP position. What happens if ATOM drops 40%?
          </div>

          {/* tool calls */}
          <div className="space-y-1.5">
            {steps.map((s) => (
              <div key={s.tool} className="flex items-center gap-2.5 font-mono text-[0.72rem]">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-turquoise-400/15 text-turquoise-300">
                  <Check className="h-2.5 w-2.5" />
                </span>
                <span className="text-sun-200">{s.tool}</span>
                <span className="truncate text-mist-500">{s.detail}</span>
              </div>
            ))}
          </div>

          {/* answer */}
          <div className="rounded-2xl rounded-tl-md border border-sun-400/20 bg-gradient-to-br from-sun-400/[0.08] to-transparent p-4">
            <p className="flex items-center gap-2 text-xs font-medium text-sun-200">
              <Sparkles className="h-3.5 w-3.5" /> AI · risk summary
            </p>
            <p className="mt-2 leading-relaxed text-mist-300">
              The position survives the shock, but rebalancing leaves you{' '}
              <span className="text-mist-50">heavier in ATOM</span>. Here are the key numbers:
            </p>
            <dl className="mt-3 divide-y divide-white/5 rounded-xl border border-white/5 bg-ink-950/50">
              {findings.map((f) => (
                <div key={f.label} className="flex items-center justify-between px-3 py-2 text-xs">
                  <dt className="text-mist-400">{f.label}</dt>
                  <dd className={`font-mono ${f.tone}`}>{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-mist-500">Suggested next step: hedge 25% of ATOM exposure, then re-run weekly.</p>
          </div>
        </div>
      </div>

      {/* floating chip */}
      <div className="absolute -bottom-5 left-4 rounded-xl border border-white/10 bg-ink-900/90 px-3 py-2 backdrop-blur sm:-left-8">
        <p className="font-mono text-[0.65rem] uppercase tracking-wider text-mist-500">Reviewed by</p>
        <p className="text-xs text-mist-100">a Hathor Nodes analyst</p>
      </div>
    </div>
  )
}
