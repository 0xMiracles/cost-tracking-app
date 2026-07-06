'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { ExpenseList } from '@/components/expense-list'
import { SpendingChart, type DayPoint } from '@/components/spending-chart'
import { formatDateRu, formatRub } from '@/lib/categories'
import type { Category, Expense } from '@/lib/db/schema'

export function DayExplorer({
  chartData,
  expenses,
  categories,
}: {
  chartData: DayPoint[]
  expenses: Expense[]
  categories: Category[]
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const dayExpenses = selectedDate ? expenses.filter((e) => e.spentAt === selectedDate) : []
  const dayTotal = dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Нажмите на столбец, чтобы посмотреть все траты за этот день
      </p>
      <SpendingChart
        data={chartData}
        selectedDate={selectedDate}
        onDayClick={(date) => setSelectedDate((prev) => (prev === date ? null : date))}
      />

      {selectedDate && (
        <div className="flex flex-col gap-3 rounded-2xl bg-secondary/60 p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold">{formatDateRu(selectedDate)}</h3>
              <p className="text-sm text-muted-foreground">
                {dayExpenses.length === 0
                  ? 'Нет расходов'
                  : `${dayExpenses.length} ${dayExpenses.length === 1 ? 'запись' : 'записей'} на ${formatRub(dayTotal)}`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedDate(null)}
              aria-label="Закрыть траты за день"
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          {dayExpenses.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              В этот день трат не было
            </p>
          ) : (
            <ExpenseList expenses={dayExpenses} categories={categories} />
          )}
        </div>
      )}
    </div>
  )
}
