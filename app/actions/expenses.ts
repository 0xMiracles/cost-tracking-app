'use server'

import { db } from '@/lib/db'
import { expenses } from '@/lib/db/schema'
import { desc, eq, gte } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function addExpense(formData: FormData) {
  const amount = Number.parseFloat(String(formData.get('amount') ?? '').replace(',', '.'))
  const category = String(formData.get('category') ?? '').trim()
  const note = String(formData.get('note') ?? '').trim()
  const spentAt = String(formData.get('spentAt') ?? '').trim()

  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: 'Введите корректную сумму' }
  }
  if (!category) {
    return { error: 'Выберите категорию' }
  }

  await db.insert(expenses).values({
    amount: amount.toFixed(2),
    category,
    note: note || null,
    spentAt: spentAt || new Date().toISOString().slice(0, 10),
  })

  revalidatePath('/')
  return { success: true }
}

export async function deleteExpense(id: number) {
  await db.delete(expenses).where(eq(expenses.id, id))
  revalidatePath('/')
}

export async function getRecentExpenses(limit = 200) {
  return db
    .select()
    .from(expenses)
    .orderBy(desc(expenses.spentAt), desc(expenses.createdAt))
    .limit(limit)
}

export async function getExpensesSince(dateISO: string) {
  return db
    .select()
    .from(expenses)
    .where(gte(expenses.spentAt, dateISO))
    .orderBy(desc(expenses.spentAt), desc(expenses.createdAt))
}
