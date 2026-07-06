import { getExpensesBetween } from '@/app/actions/expenses'
import { CategoryBreakdown } from '@/components/category-breakdown'
import { ExpenseList } from '@/components/expense-list'
import { MonthPicker } from '@/components/month-picker'
import { NavTabs } from '@/components/nav-tabs'
import { PinScreen } from '@/components/pin-screen'
import { SpendingChart } from '@/components/spending-chart'
import { formatRub } from '@/lib/categories'
import { getAuthStatus } from '@/lib/pin'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Анализ — Мои расходы',
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export default async function AnalysisPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>
}) {
  const authStatus = await getAuthStatus()
  if (authStatus === 'setup') return <PinScreen mode="setup" />
  if (authStatus === 'locked') return <PinScreen mode="enter" />

  const { m } = await searchParams
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const month = /^\d{4}-\d{2}$/.test(m ?? '') ? (m as string) : currentMonth

  const [year, monthNum] = month.split('-').map(Number)
  const daysInMonth = new Date(year, monthNum, 0).getDate()
  const fromISO = `${month}-01`
  const toISO = `${month}-${String(daysInMonth).padStart(2, '0')}`

  const expenses = await getExpensesBetween(fromISO, toISO)

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0)

  const categoryMap = new Map<string, number>()
  for (const e of expenses) {
    categoryMap.set(e.category, (categoryMap.get(e.category) ?? 0) + Number(e.amount))
  }
  const categoryTotals = Array.from(categoryMap.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)

  const todayISO = toISODate(now)
  const isCurrentMonth = month === currentMonth
  const chartDays = isCurrentMonth ? now.getDate() : daysInMonth
  const chartData = Array.from({ length: chartDays }, (_, i) => {
    const iso = `${month}-${String(i + 1).padStart(2, '0')}`
    const dayTotal = expenses
      .filter((e) => e.spentAt === iso)
      .reduce((sum, e) => sum + Number(e.amount), 0)
    return {
      date: iso,
      label: String(i + 1),
      total: dayTotal,
      isToday: iso === todayISO,
    }
  })

  const daysWithSpending = new Set(expenses.map((e) => e.spentAt)).size
  const avgPerDay = chartDays > 0 ? total / chartDays : 0
  const monthLabel = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(
    new Date(year, monthNum - 1, 1),
  )

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-balance">Анализ расходов</h1>
          <p className="text-sm text-muted-foreground">Статистика за любой месяц</p>
        </div>
        <NavTabs />
      </header>

      <div className="mx-auto w-full max-w-sm">
        <MonthPicker month={month} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <section
          aria-label="Итого за выбранный месяц"
          className="flex flex-col justify-between gap-6 rounded-3xl bg-highlight p-6 text-highlight-foreground"
        >
          <p className="text-sm font-medium capitalize">{monthLabel}</p>
          <div>
            <p className="text-4xl font-semibold tracking-tight">{formatRub(total)}</p>
            <p className="mt-1 text-sm opacity-70">общий расход</p>
          </div>
        </section>

        <section
          aria-label="В среднем в день"
          className="flex flex-col justify-between gap-6 rounded-3xl bg-accent p-6 text-accent-foreground"
        >
          <p className="text-sm font-medium">В среднем</p>
          <div>
            <p className="text-4xl font-semibold tracking-tight">{formatRub(Math.round(avgPerDay))}</p>
            <p className="mt-1 text-sm opacity-70">в день</p>
          </div>
        </section>

        <section
          aria-label="Записей за месяц"
          className="flex flex-col justify-between gap-6 rounded-3xl bg-card p-6 text-card-foreground"
        >
          <p className="text-sm font-medium text-muted-foreground">Записей</p>
          <div>
            <p className="text-4xl font-semibold tracking-tight">{expenses.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {'дней с тратами: '}
              {daysWithSpending}
            </p>
          </div>
        </section>
      </div>

      <section className="rounded-3xl bg-card p-6" aria-label="Динамика расходов за месяц">
        <h2 className="mb-2 text-lg font-semibold">По дням</h2>
        {expenses.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Нет расходов за этот месяц</p>
        ) : (
          <SpendingChart data={chartData} />
        )}
      </section>

      <section className="rounded-3xl bg-card p-6" aria-label="Расходы по категориям">
        <h2 className="mb-4 text-lg font-semibold">По категориям</h2>
        <CategoryBreakdown items={categoryTotals} />
      </section>

      <section className="rounded-3xl bg-card p-6" aria-label="Все траты за месяц">
        <h2 className="mb-4 text-lg font-semibold">Все траты за месяц</h2>
        {expenses.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Нет расходов за этот месяц</p>
        ) : (
          <ExpenseList expenses={expenses} />
        )}
      </section>
    </main>
  )
}
