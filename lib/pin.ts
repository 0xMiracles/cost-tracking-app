import 'server-only'

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { appSettings } from '@/lib/db/schema'

const COOKIE_NAME = 'expense_auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180 // 180 дней

async function getSetting(key: string): Promise<string | null> {
  const rows = await db.select().from(appSettings).where(eq(appSettings.key, key)).limit(1)
  return rows[0]?.value ?? null
}

async function setSetting(key: string, value: string) {
  await db
    .insert(appSettings)
    .values({ key, value })
    .onConflictDoUpdate({ target: appSettings.key, set: { value, updatedAt: new Date() } })
}

export function hashPin(pin: string, salt: string): string {
  return scryptSync(pin, salt, 32).toString('hex')
}

export async function isPinConfigured(): Promise<boolean> {
  return (await getSetting('pin_hash')) !== null
}

export async function savePin(pin: string) {
  const salt = randomBytes(16).toString('hex')
  const sessionSecret = randomBytes(32).toString('hex')
  await setSetting('pin_salt', salt)
  await setSetting('pin_hash', hashPin(pin, salt))
  await setSetting('session_secret', sessionSecret)
}

export async function checkPin(pin: string): Promise<boolean> {
  const [salt, storedHash] = await Promise.all([getSetting('pin_salt'), getSetting('pin_hash')])
  if (!salt || !storedHash) return false
  const candidate = Buffer.from(hashPin(pin, salt), 'hex')
  const stored = Buffer.from(storedHash, 'hex')
  return candidate.length === stored.length && timingSafeEqual(candidate, stored)
}

function sessionToken(secret: string): string {
  return createHmac('sha256', secret).update('authed').digest('hex')
}

export async function grantSession() {
  const secret = await getSetting('session_secret')
  if (!secret) return
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, sessionToken(secret), {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === 'development' ? 'none' : 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function isAuthed(): Promise<boolean> {
  const secret = await getSetting('session_secret')
  if (!secret) return false
  const cookieStore = await cookies()
  const value = cookieStore.get(COOKIE_NAME)?.value
  if (!value) return false
  const expected = sessionToken(secret)
  const a = Buffer.from(value)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export type AuthStatus = 'setup' | 'locked' | 'ok'

export async function getAuthStatus(): Promise<AuthStatus> {
  if (!(await isPinConfigured())) return 'setup'
  return (await isAuthed()) ? 'ok' : 'locked'
}
