'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/', label: 'Учёт' },
  { href: '/analysis', label: 'Анализ' },
]

export function NavTabs() {
  const pathname = usePathname()

  return (
    <nav aria-label="Разделы" className="flex gap-1 rounded-full bg-secondary p-1">
      {TABS.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? 'page' : undefined}
            className={
              active
                ? 'rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground'
                : 'rounded-full px-4 py-1.5 text-sm text-secondary-foreground hover:bg-border'
            }
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
