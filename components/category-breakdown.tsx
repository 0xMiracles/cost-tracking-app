import { formatRub } from '@/lib/categories'

type CategoryTotal = {
  category: string
  total: number
}

export function CategoryBreakdown({ items }: { items: CategoryTotal[] }) {
  if (items.length === 0) {
    return <p className="py-4 text-center text-sm text-muted-foreground">Нет данных за этот месяц</p>
  }

  const max = Math.max(...items.map((i) => i.total))

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, index) => (
        <li key={item.category} className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-card-foreground">{item.category}</span>
            <span className="font-medium text-card-foreground">{formatRub(item.total)}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={index === 0 ? 'h-full rounded-full bg-highlight' : 'h-full rounded-full bg-accent'}
              style={{ width: `${Math.max(4, (item.total / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
