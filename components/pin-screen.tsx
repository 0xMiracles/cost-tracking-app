'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { enterPin, setupPin } from '@/app/actions/auth'

export function PinScreen({ mode }: { mode: 'setup' | 'enter' }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = mode === 'setup' ? await setupPin(formData) : await enterPin(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl bg-card p-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-highlight text-highlight-foreground">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-balance">
            {mode === 'setup' ? 'Придумайте код доступа' : 'Введите код доступа'}
          </h1>
          <p className="text-sm text-muted-foreground text-pretty">
            {mode === 'setup'
              ? 'Этот код будет защищать ваши расходы. Запомните его — восстановить будет нельзя.'
              : 'Расходы защищены кодом. Введите его, чтобы продолжить.'}
          </p>
        </div>

        <form action={handleSubmit} className="flex flex-col gap-3">
          <label htmlFor="pin" className="sr-only">
            Код доступа
          </label>
          <input
            id="pin"
            name="pin"
            type="password"
            inputMode="numeric"
            autoComplete={mode === 'setup' ? 'new-password' : 'current-password'}
            placeholder={mode === 'setup' ? 'Новый код (минимум 4 символа)' : 'Код доступа'}
            required
            autoFocus
            className="w-full rounded-xl bg-secondary px-4 py-3 text-center text-lg tracking-widest text-secondary-foreground placeholder:text-sm placeholder:tracking-normal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {mode === 'setup' && (
            <>
              <label htmlFor="confirm" className="sr-only">
                Повторите код
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                inputMode="numeric"
                autoComplete="new-password"
                placeholder="Повторите код"
                required
                className="w-full rounded-xl bg-secondary px-4 py-3 text-center text-lg tracking-widest text-secondary-foreground placeholder:text-sm placeholder:tracking-normal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </>
          )}

          {error && <p className="text-center text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? 'Проверяю…' : mode === 'setup' ? 'Сохранить код' : 'Войти'}
          </button>
        </form>
      </div>
    </main>
  )
}
