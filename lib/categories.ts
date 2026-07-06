export const CATEGORIES = [
  'Продукты',
  'Кафе и рестораны',
  'Транспорт',
  'Жильё и коммуналка',
  'Здоровье',
  'Развлечения',
  'Одежда',
  'Подписки',
  'Другое',
] as const

export type Category = (typeof CATEGORIES)[number]

export function formatRub(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

export function formatDateRu(dateISO: string): string {
  const d = new Date(`${dateISO}T00:00:00`)
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(d)
}
