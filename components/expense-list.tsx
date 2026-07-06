'use client'

import { useState, useTransition } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { deleteExpense, updateExpense } from '@/app/actions/expenses'
import { formatDateRu, formatRub } from '@/lib/categories'
import type { Category, Expense } from '@/lib/db/schema'

function EditExpenseForm({
  expense,
  categories,
  onClose,
}: {
  expense: Expense
  categories: Category[]
  onClose: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await updateExpense(expense.id, formData)
      if (result?.error) {
        setError(result.error)
      } else {
        onClose()
      }
    })
  }

  const hasCategory = categories.some((c) => c.name === expense.category)

  return (
    <form action={handleSubmit} className="flex flex-col gap-2.5 rounded-xl bg-secondary p-4">
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex min-w-0 flex-col gap-1">
          <label htmlFor={`edit-amount-${expense.id}`} className="text-xs text-muted-foreground">
            Сумма
          </label>
          <input
            id={`edit-amount-${expense.id}`}
            name="amount"
            type="text"
            inputMode="decimal"
            required
            defaultValue={Number(expense.amount) % 1 === 0 ? String(Number(expense.amount)) : expense.amount}
            className="w-full min-w-0 rounded-lg bg-card px-3 py-2 text-sm font-semibold text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <label htmlFor={`edit-category-${expense.id}`} className="text-xs text-muted-foreground">
            Категория
          </label>
          <select
            id={`edit-category-${expense.id}`}
            name="category"
            required
            defaultValue={expense.category}
            className="w-full min-w-0 appearance-none rounded-lg bg-card px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {!hasCategory && <option value={expense.category}>{expense.category}</option>}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <label htmlFor={`edit-date-${expense.id}`} className="text-xs text-muted-foreground">
            Дата
          </label>
          <input
            id={`edit-date-${expense.id}`}
            name="spentAt"
            type="date"
            required
            defaultValue={expense.spentAt}
            className="w-full min-w-0 appearance-none rounded-lg bg-card px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <label htmlFor={`edit-note-${expense.id}`} className="text-xs text-muted-foreground">
            Заметка
          </label>
          <input
            id={`edit-note-${expense.id}`}
            name="note"
            type="text"
            placeholder="Необязательно"
            defaultValue={expense.note ?? ''}
            className="w-full min-w-0 rounded-lg bg-card px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {isPending ? 'Сохраняю…' : 'Сохранить'}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="rounded-lg bg-card px-3 py-2 text-sm text-card-foreground disabled:opacity-50"
        >
          Отмена
        </button>
      </div>
    </form>
  )
}

export function ExpenseList({
  expenses,
  categories = [],
}: {
  expenses: Expense[]
  categories?: Category[]
}) {
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<number | null>(null)

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
            {items.map((expense) =>
              editingId === expense.id ? (
                <li key={expense.id}>
                  <EditExpenseForm
                    expense={expense}
                    categories={categories}
                    onClose={() => setEditingId(null)}
                  />
                </li>
              ) : (
                <li
                  key={expense.id}
                  className="group flex items-center justify-between gap-2 rounded-xl bg-secondary px-4 py-3"
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
                  <div className="flex shrink-0 items-center">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => setEditingId(expense.id)}
                      aria-label={`Изменить расход ${expense.category} ${formatRub(Number(expense.amount))}`}
                      className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-border hover:text-foreground disabled:opacity-50"
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => startTransition(() => deleteExpense(expense.id))}
                      aria-label={`Удалить расход ${expense.category} ${formatRub(Number(expense.amount))}`}
                      className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-border hover:text-destructive disabled:opacity-50"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ),
            )}
          </ul>
        </div>
      ))}
    </div>
  )
}
