'use client'

import { useMemo, useState } from 'react'
import { LineChart } from '@/components/charts'
import { fmtUsdCompact } from '@/lib/format'
import { projectLiquidity } from '@/lib/mock/osmosis'
import { palette } from '@/lib/palette'

type Curve = { organic: number; k: number; exponent: number }

export function IncentiveSimulator({ curve, current }: { curve: Curve; current: number }) {
  const [pct, setPct] = useState(100)
  const budget = (current * pct) / 100

  const points = useMemo(
    () =>
      Array.from({ length: 41 }, (_, i) => {
        const p = i * 5
        const b = (current * p) / 100
        return { budget: `${p}%`, liquidity: Math.round(projectLiquidity(curve, b)) }
      }),
    [curve, current],
  )

  const now = projectLiquidity(curve, current)
  const projected = projectLiquidity(curve, budget)
  const marginal = (projectLiquidity(curve, budget + 1000) - projected) / 1000
  const liquidityDelta = ((projected - now) / now) * 100
  const spendDelta = pct - 100

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <label htmlFor="budget" className="text-sm text-mist-400">
          Weekly incentive budget
        </label>
        <p className="mt-2 font-mono text-4xl text-mist-50">{fmtUsdCompact(budget)}</p>
        <p className="mt-1 text-sm text-mist-500">{pct}% of today’s spend</p>
        <input
          id="budget"
          type="range"
          min={0}
          max={200}
          step={5}
          value={pct}
          onChange={(e) => setPct(Number(e.target.value))}
          className="mt-6 w-full accent-[var(--color-sun-400)]"
        />
        <div className="mt-1 flex justify-between font-mono text-[0.65rem] text-mist-500">
          <span>0%</span>
          <span>100%</span>
          <span>200%</span>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <dt className="text-xs text-mist-500">Projected liquidity</dt>
            <dd className="mt-1 font-mono text-lg text-mist-50">{fmtUsdCompact(projected)}</dd>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <dt className="text-xs text-mist-500">Marginal $ per $1</dt>
            <dd className="mt-1 font-mono text-lg text-sun-300">{Number.isFinite(marginal) ? marginal.toFixed(0) : '—'}</dd>
          </div>
          <div className="col-span-2 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-sm leading-relaxed text-mist-400">
            {spendDelta === 0 ? (
              'Move the slider to compare budgets against today’s spend.'
            ) : (
              <>
                {spendDelta > 0 ? 'Raising' : 'Cutting'} spend by{' '}
                <span className="font-mono text-mist-50">{Math.abs(spendDelta)}%</span> changes liquidity by{' '}
                <span className={`font-mono ${liquidityDelta >= 0 ? 'text-turquoise-300' : 'text-carnelian-300'}`}>
                  {liquidityDelta >= 0 ? '+' : ''}
                  {liquidityDelta.toFixed(1)}%
                </span>
                .
              </>
            )}
          </div>
        </dl>
      </div>
      <div>
        <LineChart
          data={points}
          index="budget"
          rawX
          height={340}
          format="compact"
          series={[{ key: 'liquidity', name: 'Projected liquidity (USD)', color: palette.sun }]}
          reference={{ y: Math.round(now), label: 'Today', color: palette.lapis }}
        />
      </div>
    </div>
  )
}
