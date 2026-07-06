'use server'

import { db } from '@/lib/db'
import { expenses } from '@/lib/db/schema'
import { isAuthed } from '@/lib/pin'
import { and, desc, eq, gte, lte } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function addExpense(formData: FormData) {
  if (!(await isAuthed())) return { error: 'Нет доступа' }

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

export async function updateExpense(id: number, formData: FormData) {
  if (!(await isAuthed())) return { error: 'Нет доступа' }

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
  if (!/^\d{4}-\d{2}-\d{2}$/.test(spentAt)) {
    return { error: 'Укажите дату' }
  }

  await db
    .update(expenses)
    .set({
      amount: amount.toFixed(2),
      category,
      note: note || null,
      spentAt,
    })
    .where(eq(expenses.id, id))

  revalidatePath('/')
  revalidatePath('/analysis')
  return { success: true }
}

export async function deleteExpense(id: number) {
  if (!(await isAuthed())) return { error: 'Нет доступа' }

  await db.delete(expenses).where(eq(expenses.id, id))
  revalidatePath('/')
}

export async function getExpensesBetween(fromISO: string, toISO: string) {
  return db
    .select()
    .from(expenses)
    .where(and(gte(expenses.spentAt, fromISO), lte(expenses.spentAt, toISO)))
    .orderBy(desc(expenses.spentAt), desc(expenses.createdAt))
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
