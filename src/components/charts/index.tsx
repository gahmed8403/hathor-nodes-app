'use client'

/**
 * Thin, themed wrappers around Recharts so every dashboard chart shares the
 * same axes, grid, tooltip and palette.
 */
import {
  Area,
  AreaChart as RAreaChart,
  Bar,
  BarChart as RBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RLineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart as RScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'
import { fmtCompact, fmtPct, fmtUsdCompact } from '@/lib/format'
import { palette } from '@/lib/palette'
import { useSyncExternalStore } from 'react'

export { palette }


function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
/** Skip chart animations for people who prefer reduced motion */
function useAnimate() {
  return !useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  )
}

const axisProps = {
  stroke: 'transparent',
  tick: { fill: '#6d6b68', fontSize: 11, fontFamily: 'var(--font-geist-mono)' },
  tickLine: false,
  axisLine: false,
} as const

const grid = <CartesianGrid stroke="rgb(255 255 255 / 0.05)" vertical={false} />

type Formatter = (v: number) => string

/** Named formats — props must be serializable so server pages can pass them. */
export type Format = 'number' | 'compact' | 'usd' | 'pct' | 'pct0'
const formats: Record<Format, Formatter> = {
  number: (v) => v.toLocaleString('en-US', { maximumFractionDigits: 2 }),
  compact: fmtCompact,
  usd: fmtUsdCompact,
  pct: (v) => fmtPct(v, 1),
  pct0: (v) => fmtPct(v, 0),
}

type TooltipEntry = {
  dataKey?: unknown
  name?: unknown
  value?: unknown
  color?: string
  payload?: { color?: string }
}

function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter = formats.number,
  formatLabel,
}: {
  active?: boolean
  payload?: readonly TooltipEntry[]
  label?: unknown
  valueFormatter?: Formatter
  formatLabel?: (l: string) => string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="min-w-40 rounded-xl border border-white/10 bg-ink-900/95 px-3 py-2.5 text-xs shadow-2xl backdrop-blur">
      {label !== undefined && label !== '' && label !== null && (
        <p className="mb-1.5 font-mono text-mist-400">{formatLabel ? formatLabel(String(label)) : String(label)}</p>
      )}
      <ul className="space-y-1">
        {payload.map((p) => (
          <li key={String(p.dataKey ?? p.name)} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-mist-300">
              <span className="h-2 w-2 rounded-full" style={{ background: p.color ?? p.payload?.color }} />
              {String(p.name)}
            </span>
            <span className="font-mono text-mist-50">{valueFormatter(Number(p.value))}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const legend = (
  <Legend
    iconType="circle"
    iconSize={8}
    itemSorter={null}
    wrapperStyle={{ fontSize: 12, color: '#b8b4aa', paddingTop: 12 }}
  />
)

export type Series = { key: string; name: string; color: string }

const isIsoDate = (d: unknown): d is string => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)
const shortDate = (d: string) =>
  isIsoDate(d) ? new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) : d
const monthYear = (d: string) =>
  isIsoDate(d) ? new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }) : d
/** Day-level ticks for short ranges, month + year once a series spans ~10 months */
function axisDateFormatter(data: Record<string, unknown>[], index: string) {
  const first = data[0]?.[index]
  const last = data[data.length - 1]?.[index]
  if (!isIsoDate(first) || !isIsoDate(last)) return shortDate
  const span = new Date(last).getTime() - new Date(first).getTime()
  return span > 300 * 86_400_000 ? monthYear : shortDate
}

export function AreaChart({
  data,
  index,
  series,
  stacked = false,
  height = 300,
  format = 'compact',
  showLegend = true,
}: {
  data: Record<string, unknown>[]
  index: string
  series: Series[]
  stacked?: boolean
  height?: number
  format?: Format
  showLegend?: boolean
}) {
  const animate = useAnimate()
  const valueFormatter = formats[format]
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RAreaChart data={data} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={stacked ? 0.55 : 0.35} />
              <stop offset="100%" stopColor={s.color} stopOpacity={stacked ? 0.15 : 0} />
            </linearGradient>
          ))}
        </defs>
        {grid}
        <XAxis dataKey={index} {...axisProps} tickFormatter={axisDateFormatter(data, index)} minTickGap={36} />
        <YAxis {...axisProps} tickFormatter={valueFormatter} width={56} />
        <Tooltip
          content={(p) => <ChartTooltip {...p} valueFormatter={valueFormatter} formatLabel={shortDate} />}
          cursor={{ stroke: 'rgb(255 255 255 / 0.15)' }}
        />
        {showLegend && legend}
        {series.map((s) => (
          <Area
            isAnimationActive={animate}
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={1.75}
            fill={`url(#fill-${s.key})`}
            stackId={stacked ? 'a' : undefined}
            activeDot={{ r: 3.5, strokeWidth: 0 }}
          />
        ))}
      </RAreaChart>
    </ResponsiveContainer>
  )
}

export function LineChart({
  data,
  index,
  series,
  height = 300,
  format = 'number',
  reference,
  rawX = false,
}: {
  data: Record<string, unknown>[]
  index: string
  series: (Series & { dashed?: boolean })[]
  height?: number
  format?: Format
  reference?: { y: number; label: string; color?: string }
  /** Show X values as-is instead of formatting them as dates */
  rawX?: boolean
}) {
  const animate = useAnimate()
  const valueFormatter = formats[format]
  const xFmt = rawX ? (v: string) => v : axisDateFormatter(data, index)
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RLineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        {grid}
        <XAxis dataKey={index} {...axisProps} tickFormatter={xFmt} minTickGap={36} />
        <YAxis {...axisProps} tickFormatter={valueFormatter} width={48} />
        <Tooltip
          content={(p) => <ChartTooltip {...p} valueFormatter={valueFormatter} formatLabel={xFmt} />}
          cursor={{ stroke: 'rgb(255 255 255 / 0.15)' }}
        />
        {legend}
        {reference && (
          <ReferenceLine
            y={reference.y}
            stroke={reference.color ?? palette.carnelian}
            strokeDasharray="5 5"
            label={{ value: reference.label, position: 'insideTopRight', fill: reference.color ?? palette.carnelian, fontSize: 11 }}
          />
        )}
        {series.map((s) => (
          <Line
            isAnimationActive={animate}
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={2}
            strokeDasharray={s.dashed ? '5 5' : undefined}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </RLineChart>
    </ResponsiveContainer>
  )
}

export function BarChart({
  data,
  index,
  series,
  stacked = false,
  layout = 'horizontal',
  height = 300,
  format = 'compact',
  showLegend = true,
  colorByValue,
  yWidth = 110,
  maxValue,
}: {
  data: Record<string, unknown>[]
  index: string
  series: Series[]
  stacked?: boolean
  /** "vertical" draws horizontal bars with categories down the Y axis */
  layout?: 'horizontal' | 'vertical'
  height?: number
  format?: Format
  showLegend?: boolean
  /** Colour each bar by its sign (positive/negative) — single-series only */
  colorByValue?: { positive: string; negative: string }
  yWidth?: number
  maxValue?: number
}) {
  const animate = useAnimate()
  const valueFormatter = formats[format]
  const vertical = layout === 'vertical'
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart data={data} layout={layout} margin={{ top: 4, right: 8, left: vertical ? 0 : -8, bottom: 0 }} barCategoryGap="22%">
        <CartesianGrid stroke="rgb(255 255 255 / 0.05)" vertical={vertical} horizontal={!vertical} />
        {vertical ? (
          <>
            <XAxis type="number" {...axisProps} tickFormatter={valueFormatter} domain={maxValue ? [0, maxValue] : undefined} ticks={maxValue === 100 ? [0, 25, 50, 75, 100] : undefined} />
            <YAxis type="category" dataKey={index} {...axisProps} width={yWidth} tick={{ ...axisProps.tick, fill: '#b8b4aa' }} interval={0} />
          </>
        ) : (
          <>
            <XAxis dataKey={index} {...axisProps} interval="preserveStartEnd" minTickGap={8} />
            <YAxis {...axisProps} tickFormatter={valueFormatter} width={52} domain={maxValue ? [0, maxValue] : undefined} ticks={maxValue === 100 ? [0, 25, 50, 75, 100] : undefined} />
          </>
        )}
        <Tooltip
          content={(p) => <ChartTooltip {...p} valueFormatter={valueFormatter} />}
          cursor={{ fill: 'rgb(255 255 255 / 0.03)' }}
        />
        {showLegend && series.length > 1 && legend}
        {series.map((s, i) => (
          <Bar
            isAnimationActive={animate}
            key={s.key}
            dataKey={s.key}
            name={s.name}
            fill={s.color}
            stackId={stacked ? 'a' : undefined}
            radius={stacked ? (i === series.length - 1 ? (vertical ? [0, 4, 4, 0] : [4, 4, 0, 0]) : 0) : vertical ? [0, 4, 4, 0] : [4, 4, 0, 0]}
            maxBarSize={vertical ? 18 : 36}
          >
            {colorByValue &&
              data.map((row, j) => (
                <Cell key={j} fill={Number(row[s.key]) >= 0 ? colorByValue.positive : colorByValue.negative} />
              ))}
          </Bar>
        ))}
      </RBarChart>
    </ResponsiveContainer>
  )
}

export function DonutChart({
  data,
  height = 260,
  format = 'compact',
  centerLabel,
  centerValue,
}: {
  data: { name: string; value: number; color: string }[]
  height?: number
  format?: Format
  centerLabel?: string
  centerValue?: string
}) {
  const animate = useAnimate()
  const valueFormatter = formats[format]
  const total = data.reduce((a, d) => a + d.value, 0)
  return (
    <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="relative" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
            isAnimationActive={animate}
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="64%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="none"
              cornerRadius={4}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip content={(p) => <ChartTooltip {...p} label="" valueFormatter={valueFormatter} />} />
          </PieChart>
        </ResponsiveContainer>
        {(centerLabel || centerValue) && (
          <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
            {centerValue && <p className="font-mono text-xl text-mist-50">{centerValue}</p>}
            {centerLabel && <p className="mt-0.5 text-[0.7rem] uppercase tracking-wider text-mist-500">{centerLabel}</p>}
          </div>
        )}
      </div>
      <ul className="space-y-2.5 text-sm">
        {data.map((d) => (
          <li key={d.name} className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2.5 text-mist-300">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
              <span className="truncate">{d.name}</span>
            </span>
            <span className="font-mono text-mist-50 tabular-nums">
              {((d.value / total) * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ScatterChart({
  data,
  x,
  y,
  z,
  name,
  height = 320,
  xLabel,
  yLabel,
  xFormat = 'compact',
  yFormat = 'compact',
  color = palette.sun,
}: {
  data: Record<string, unknown>[]
  x: string
  y: string
  z?: string
  name: string
  height?: number
  xLabel: string
  yLabel: string
  xFormat?: Format
  yFormat?: Format
  color?: string
}) {
  const animate = useAnimate()
  const xFormatter = formats[xFormat]
  const yFormatter = formats[yFormat]
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RScatterChart margin={{ top: 8, right: 12, left: -4, bottom: 16 }}>
        <CartesianGrid stroke="rgb(255 255 255 / 0.05)" />
        <XAxis
          type="number"
          dataKey={x}
          name={xLabel}
          scale="log"
          domain={['auto', 'auto']}
          {...axisProps}
          tickFormatter={xFormatter}
          label={{ value: xLabel, position: 'insideBottom', offset: -10, fill: '#6d6b68', fontSize: 11 }}
        />
        <YAxis
          type="number"
          dataKey={y}
          name={yLabel}
          scale="log"
          domain={['auto', 'auto']}
          {...axisProps}
          tickFormatter={yFormatter}
          width={60}
        />
        {z && <ZAxis type="number" dataKey={z} range={[40, 420]} />}
        <Tooltip
          cursor={{ strokeDasharray: '3 3', stroke: 'rgb(255 255 255 / 0.2)' }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const row = payload[0].payload as Record<string, unknown>
            return (
              <div className="rounded-xl border border-white/10 bg-ink-900/95 px-3 py-2.5 text-xs shadow-2xl">
                <p className="font-medium text-mist-50">{String(row.pool)}</p>
                <p className="mt-1 text-mist-400">
                  {xLabel}: <span className="font-mono text-mist-100">{xFormatter(Number(row[x]))}</span>
                </p>
                <p className="text-mist-400">
                  {yLabel}: <span className="font-mono text-mist-100">{yFormatter(Number(row[y]))}</span>
                </p>
              </div>
            )
          }}
        />
        <Scatter isAnimationActive={animate} name={name} data={data} fill={color} fillOpacity={0.75} stroke={color} />
      </RScatterChart>
    </ResponsiveContainer>
  )
}
