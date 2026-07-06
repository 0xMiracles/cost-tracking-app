import { getRecentExpenses } from '@/app/actions/expenses'
import { getCategories } from '@/app/actions/categories'
import { CategoryBreakdown } from '@/components/category-breakdown'
import { ExpenseForm } from '@/components/expense-form'
import { ExpenseList } from '@/components/expense-list'
import { NavTabs } from '@/components/nav-tabs'
import { PinScreen } from '@/components/pin-screen'
import { SpendingChart } from '@/components/spending-chart'
import { formatDateRu, formatRub } from '@/lib/categories'
import { getAuthStatus } from '@/lib/pin'

export const dynamic = 'force-dynamic'

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export default async function HomePage() {
  const authStatus = await getAuthStatus()
  if (authStatus === 'setup') return <PinScreen mode="setup" />
  if (authStatus === 'locked') return <PinScreen mode="enter" />

  const [expenses, categories] = await Promise.all([getRecentExpenses(), getCategories()])

  const now = new Date()
  const todayISO = toISODate(now)
  const monthStartISO = `${todayISO.slice(0, 7)}-01`

  const monthExpenses = expenses.filter((e) => e.spentAt >= monthStartISO)
  const monthTotal = monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const todayTotal = expenses
    .filter((e) => e.spentAt === todayISO)
    .reduce((sum, e) => sum + Number(e.amount), 0)

  const dayOfMonth = now.getDate()
  const avgPerDay = dayOfMonth > 0 ? monthTotal / dayOfMonth : 0

  // Daily totals for the current month (1st through today)
  const chartData = Array.from({ length: dayOfMonth }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), i + 1)
    const iso = toISODate(d)
    const total = expenses
      .filter((e) => e.spentAt === iso)
      .reduce((sum, e) => sum + Number(e.amount), 0)
    return {
      date: iso,
      label: formatDateRu(iso),
      total,
      isToday: iso === todayISO,
    }
  })

  // Category totals for the current month
  const categoryMap = new Map<string, number>()
  for (const e of monthExpenses) {
    categoryMap.set(e.category, (categoryMap.get(e.category) ?? 0) + Number(e.amount))
  }
  const categoryTotals = Array.from(categoryMap.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)

  const monthName = new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(now)

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-balance">Мои расходы</h1>
          <p className="text-sm text-muted-foreground">Личный учёт затрат</p>
        </div>
        <NavTabs />
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <section
          aria-label="Итого за месяц"
          className="flex flex-col justify-between gap-6 rounded-3xl bg-highlight p-6 text-highlight-foreground"
        >
          <p className="text-sm font-medium capitalize">{monthName}</p>
          <div>
            <p className="text-4xl font-semibold tracking-tight">{formatRub(monthTotal)}</p>
            <p className="mt-1 text-sm opacity-70">потрачено за месяц</p>
          </div>
        </section>

        <section
          aria-label="Сегодня"
          className="flex flex-col justify-between gap-6 rounded-3xl bg-accent p-6 text-accent-foreground"
        >
          <p className="text-sm font-medium">Сегодня</p>
          <div>
            <p className="text-4xl font-semibold tracking-tight">{formatRub(todayTotal)}</p>
            <p className="mt-1 text-sm opacity-70">
              {'в среднем '}
              {formatRub(Math.round(avgPerDay))}
              {' в день'}
            </p>
          </div>
        </section>

        <section
          aria-label="Записей за месяц"
          className="flex flex-col justify-between gap-6 rounded-3xl bg-card p-6 text-card-foreground"
        >
          <p className="text-sm font-medium text-muted-foreground">Записей за месяц</p>
          <div>
            <p className="text-4xl font-semibold tracking-tight">{monthExpenses.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {'категорий: '}
              {categoryTotals.length}
            </p>
          </div>
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <section className="rounded-3xl bg-card p-6 md:col-span-2" aria-label="Добавить расход">
          <h2 className="mb-4 text-lg font-semibold">Новый расход</h2>
          <ExpenseForm categories={categories} />
        </section>

        <div className="flex flex-col gap-4 md:col-span-3">
          <section className="rounded-3xl bg-card p-6" aria-label="Динамика расходов">
            <h2 className="mb-2 text-lg font-semibold capitalize">{monthName}</h2>
            <SpendingChart data={chartData} />
          </section>

          <section className="rounded-3xl bg-card p-6" aria-label="Расходы по категориям">
            <h2 className="mb-4 text-lg font-semibold">По категориям за месяц</h2>
            <CategoryBreakdown items={categoryTotals} />
          </section>
        </div>
      </div>

      <section className="rounded-3xl bg-card p-6" aria-label="История расходов">
        <h2 className="mb-4 text-lg font-semibold">История</h2>
        <ExpenseList expenses={expenses} categories={categories} />
      </section>
    </main>
  )
}
