'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteExpense } from '@/app/actions/expenses'
import { formatDateRu, formatRub } from '@/lib/categories'
import type { Expense } from '@/lib/db/schema'

export function ExpenseList({ expenses }: { expenses: Expense[] }) {
  const [isPending, startTransition] = useTransition()

  if (expenses.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Пока нет расходов. Добавьте первый через форму.
      </p>
    )
  }

  const groups = new Map<string, Expense[]>()
  for (const e of expenses) {
    const list = groups.get(e.spentAt) ?? []
    list.push(e)
    groups.set(e.spentAt, list)
  }

  return (
    <div className="flex flex-col gap-5">
      {Array.from(groups.entries()).map(([date, items]) => (
        <div key={date} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">{formatDateRu(date)}</h3>
            <span className="text-sm text-muted-foreground">
              {formatRub(items.reduce((sum, e) => sum + Number(e.amount), 0))}
            </span>
          </div>
          <ul className="flex flex-col gap-1.5">
            {items.map((expense) => (
              <li
                key={expense.id}
                className="group flex items-center justify-between gap-3 rounded-xl bg-secondary px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-secondary-foreground">{expense.category}</p>
                  {expense.note && (
                    <p className="truncate text-xs text-muted-foreground">{expense.note}</p>
                  )}
                </div>
                <span className="text-sm font-semibold text-secondary-foreground">
                  {formatRub(Number(expense.amount))}
                </span>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => startTransition(() => deleteExpense(expense.id))}
                  aria-label={`Удалить расход ${expense.category} ${formatRub(Number(expense.amount))}`}
                  className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-border hover:text-destructive disabled:opacity-50"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
