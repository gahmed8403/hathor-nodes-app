'use client'

/**
 * A single-series line chart with configurable decimal precision, for blog
 * figures whose values are too small for the shared dashboard formats.
 */
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function PreciseLineChart({
  data,
  index,
  dataKey,
  name,
  color,
  digits = 3,
  prefix = '',
  height = 240,
  baseline,
}: {
  data: Record<string, unknown>[]
  index: string
  dataKey: string
  name: string
  color: string
  digits?: number
  prefix?: string
  height?: number
  /** Draw the starting value as a dashed reference */
  baseline?: number
}) {
  const fmt = (v: number) => `${prefix}${v.toFixed(digits)}`
  const rows = baseline === undefined ? data : data.map((d) => ({ ...d, __base: baseline }))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="rgb(255 255 255 / 0.05)" vertical={false} />
        <XAxis
          dataKey={index}
          stroke="transparent"
          tickLine={false}
          axisLine={false}
          minTickGap={40}
          tick={{ fill: '#6d6b68', fontSize: 11, fontFamily: 'var(--font-geist-mono)' }}
        />
        <YAxis
          stroke="transparent"
          tickLine={false}
          axisLine={false}
          width={58}
          domain={['auto', 'auto']}
          tickFormatter={fmt}
          tick={{ fill: '#6d6b68', fontSize: 11, fontFamily: 'var(--font-geist-mono)' }}
        />
        <Tooltip
          cursor={{ stroke: 'rgb(255 255 255 / 0.15)' }}
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null
            const v = Number(payload.find((p) => p.dataKey === dataKey)?.value)
            return (
              <div className="rounded-xl border border-white/10 bg-ink-900/95 px-3 py-2.5 text-xs shadow-2xl">
                <p className="mb-1 font-mono text-mist-400">Block {String(label)}</p>
                <p className="flex items-center gap-2 text-mist-300">
                  <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                  {name}
                  <span className="ml-auto pl-4 font-mono text-mist-50">{fmt(v)}</span>
                </p>
              </div>
            )
          }}
        />
        {baseline !== undefined && (
          <Line dataKey="__base" stroke="rgb(255 255 255 / 0.25)" strokeDasharray="4 4" dot={false} activeDot={false} isAnimationActive={false} />
        )}
        <Line type="monotone" dataKey={dataKey} name={name} stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
