'use client'

import { useRouter } from 'next/navigation'

export function MonthPicker({ month }: { month: string }) {
  const router = useRouter()

  function shift(delta: number) {
    const [y, m] = month.split('-').map(Number)
    const d = new Date(y, m - 1 + delta, 1)
    const next = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    router.push(`/analysis?m=${next}`)
  }

  const [y, m] = month.split('-').map(Number)
  const label = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(new Date(y, m - 1, 1))

  const nowMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  const isCurrent = month >= nowMonth

  return (
    <div className="flex items-center justify-between gap-2 rounded-full bg-secondary p-1.5">
      <button
        type="button"
        onClick={() => shift(-1)}
        aria-label="Предыдущий месяц"
        className="flex size-9 items-center justify-center rounded-full bg-card text-card-foreground hover:bg-border"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate text-sm font-medium capitalize text-secondary-foreground">{label}</span>
        <label htmlFor="month-input" className="sr-only">
          Выбрать месяц
        </label>
        <input
          id="month-input"
          type="month"
          value={month}
          onChange={(e) => {
            if (e.target.value) router.push(`/analysis?m=${e.target.value}`)
          }}
          className="w-8 cursor-pointer appearance-none rounded-lg bg-transparent text-transparent focus:outline-none focus:ring-2 focus:ring-ring [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          aria-label="Выбрать месяц из календаря"
        />
      </div>
      <button
        type="button"
        onClick={() => shift(1)}
        disabled={isCurrent}
        aria-label="Следующий месяц"
        className="flex size-9 items-center justify-center rounded-full bg-card text-card-foreground hover:bg-border disabled:opacity-40"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  )
}
