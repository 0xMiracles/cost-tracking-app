'use client'

import { useRef, useState, useTransition } from 'react'
import { addExpense } from '@/app/actions/expenses'
import { addCategory, deleteCategory } from '@/app/actions/categories'
import type { Category } from '@/lib/db/schema'

export function ExpenseForm({ categories }: { categories: Category[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const newCategoryRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [isCategoryPending, startCategoryTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [showManager, setShowManager] = useState(false)

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await addExpense(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        formRef.current?.reset()
      }
    })
  }

  function handleAddCategory() {
    const name = newCategoryRef.current?.value ?? ''
    setCategoryError(null)
    startCategoryTransition(async () => {
      const formData = new FormData()
      formData.set('name', name)
      const result = await addCategory(formData)
      if (result?.error) {
        setCategoryError(result.error)
      } else if (newCategoryRef.current) {
        newCategoryRef.current.value = ''
      }
    })
  }

  function handleDeleteCategory(id: number) {
    setCategoryError(null)
    startCategoryTransition(async () => {
      const result = await deleteCategory(id)
      if (result?.error) {
        setCategoryError(result.error)
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
        <div className="flex items-center justify-between">
          <label htmlFor="category" className="text-sm text-muted-foreground">
            Категория
          </label>
          <button
            type="button"
            onClick={() => setShowManager((v) => !v)}
            className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            {showManager ? 'Готово' : 'Изменить'}
          </button>
        </div>
        <select
          id="category"
          name="category"
          required
          defaultValue={categories[0]?.name ?? ''}
          className="w-full appearance-none rounded-xl bg-secondary px-4 py-3 text-sm text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {showManager && (
          <div className="mt-1 flex flex-col gap-2 rounded-xl bg-secondary/60 p-3">
            <ul className="flex flex-col gap-1">
              {categories.map((cat) => (
                <li key={cat.id} className="flex items-center justify-between gap-2 rounded-lg bg-card px-3 py-2">
                  <span className="min-w-0 truncate text-sm text-card-foreground">{cat.name}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id)}
                    disabled={isCategoryPending}
                    aria-label={`Удалить категорию ${cat.name}`}
                    className="shrink-0 text-xs text-muted-foreground hover:text-destructive disabled:opacity-50"
                  >
                    Удалить
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                ref={newCategoryRef}
                type="text"
                placeholder="Новая категория"
                maxLength={40}
                className="min-w-0 flex-1 rounded-lg bg-card px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={isCategoryPending}
                className="shrink-0 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                Добавить
              </button>
            </div>
            {categoryError && <p className="text-sm text-destructive">{categoryError}</p>}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <label htmlFor="spentAt" className="text-sm text-muted-foreground">
            Дата
          </label>
          <input
            id="spentAt"
            name="spentAt"
            type="date"
            defaultValue={today}
            className="w-full min-w-0 appearance-none rounded-xl bg-secondary px-3 py-2.5 text-sm text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <label htmlFor="note" className="text-sm text-muted-foreground">
            Заметка
          </label>
          <input
            id="note"
            name="note"
            type="text"
            placeholder="Необязательно"
            className="w-full min-w-0 rounded-xl bg-secondary px-3 py-2.5 text-sm text-secondary-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
