/** All dashboard demo data runs up to this date. */
export const DATA_END = '2026-09-30'
export const DAY = 86_400_000
export const END = new Date(DATA_END + 'T00:00:00Z').getTime()
export const dateLabel = (t: number) => new Date(t).toISOString().slice(0, 10)
