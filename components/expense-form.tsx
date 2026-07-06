'use client'

import { useRef, useState, useTransition } from 'react'
import { addExpense } from '@/app/actions/expenses'
import { CATEGORIES } from '@/lib/categories'

export function ExpenseForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState<string>(CATEGORIES[0])

  function handleSubmit(formData: FormData) {
    setError(null)
    formData.set('category', category)
    startTransition(async () => {
      const result = await addExpense(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        formRef.current?.reset()
      }
    })
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="amount" className="text-sm text-muted-foreground">
          Сумма
        </label>
        <div className="relative">
          <input
            id="amount"
            name="amount"
            type="text"
            inputMode="decimal"
            placeholder="0"
            required
            className="w-full rounded-xl bg-secondary px-4 py-3 text-2xl font-semibold text-secondary-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">{'₽'}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-muted-foreground">Категория</span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={
                category === cat
                  ? 'rounded-full bg-primary px-3 py-1.5 text-sm text-primary-foreground'
                  : 'rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground hover:bg-border'
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="spentAt" className="text-sm text-muted-foreground">
            Дата
          </label>
          <input
            id="spentAt"
            name="spentAt"
            type="date"
            defaultValue={today}
            className="w-full rounded-xl bg-secondary px-4 py-2.5 text-sm text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="note" className="text-sm text-muted-foreground">
            Заметка
          </label>
          <input
            id="note"
            name="note"
            type="text"
            placeholder="Необязательно"
            className="w-full rounded-xl bg-secondary px-4 py-2.5 text-sm text-secondary-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? 'Сохраняю…' : 'Добавить расход'}
      </button>
    </form>
  )
}
