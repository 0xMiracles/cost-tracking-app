'use server'

import { asc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { categories } from '@/lib/db/schema'
import { isAuthed } from '@/lib/pin'

export async function getCategories() {
  return db.select().from(categories).orderBy(asc(categories.id))
}

export async function addCategory(formData: FormData) {
  if (!(await isAuthed())) return { error: 'Нет доступа' }

  const name = String(formData.get('name') ?? '').trim()
  if (!name) {
    return { error: 'Введите название категории' }
  }
  if (name.length > 40) {
    return { error: 'Название слишком длинное (до 40 символов)' }
  }

  const existing = await db.select().from(categories).where(eq(categories.name, name)).limit(1)
  if (existing.length > 0) {
    return { error: 'Такая категория уже есть' }
  }

  await db.insert(categories).values({ name })
  revalidatePath('/')
  return { success: true }
}

export async function deleteCategory(id: number) {
  if (!(await isAuthed())) return { error: 'Нет доступа' }

  await db.delete(categories).where(eq(categories.id, id))
  revalidatePath('/')
  return { success: true }
}
