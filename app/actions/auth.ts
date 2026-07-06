'use server'

import { revalidatePath } from 'next/cache'
import { checkPin, grantSession, isPinConfigured, savePin } from '@/lib/pin'

export async function setupPin(formData: FormData) {
  const pin = String(formData.get('pin') ?? '').trim()
  const confirm = String(formData.get('confirm') ?? '').trim()

  if (pin.length < 4) {
    return { error: 'Код должен быть не короче 4 символов' }
  }
  if (pin !== confirm) {
    return { error: 'Коды не совпадают' }
  }
  if (await isPinConfigured()) {
    return { error: 'Код уже установлен' }
  }

  await savePin(pin)
  await grantSession()
  revalidatePath('/')
  return { success: true }
}

export async function enterPin(formData: FormData) {
  const pin = String(formData.get('pin') ?? '').trim()
  if (!pin) {
    return { error: 'Введите код' }
  }

  const valid = await checkPin(pin)
  if (!valid) {
    return { error: 'Неверный код' }
  }

  await grantSession()
  revalidatePath('/')
  return { success: true }
}
