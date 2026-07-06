'use client'

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { formatRub } from '@/lib/categories'

export type DayPoint = {
  date: string
  label: string
  total: number
  isToday: boolean
}

export function SpendingChart({
  data,
  onDayClick,
  selectedDate,
}: {
  data: DayPoint[]
  onDayClick?: (date: string) => void
  selectedDate?: string | null
}) {
  const clickable = Boolean(onDayClick)

  return (
    <div className="h-48 w-full" role="img" aria-label="График расходов по дням">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <Tooltip
            cursor={{ fill: 'var(--muted)', opacity: 0.5 }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const point = payload[0].payload as DayPoint
              return (
                <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-sm">
                  <p className="font-medium">{point.label}</p>
                  <p>{formatRub(point.total)}</p>
                  {clickable && <p className="mt-0.5 text-muted-foreground">Нажмите, чтобы посмотреть траты</p>}
                </div>
              )
            }}
          />
          <Bar
            dataKey="total"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
            className={clickable ? 'cursor-pointer' : undefined}
            onClick={(entry) => {
              const point = entry as unknown as DayPoint
              if (onDayClick && point?.date) onDayClick(point.date)
            }}
          >
            {data.map((entry) => (
              <Cell
                key={entry.date}
                fill={
                  selectedDate === entry.date
                    ? 'var(--chart-2)'
                    : entry.isToday
                      ? 'var(--chart-3)'
                      : 'var(--chart-5)'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
