import { format, formatDistanceToNow, isToday, isTomorrow, isPast } from 'date-fns'
import { vi } from 'date-fns/locale'

export function formatDate(date) {
  if (!date) return '—'
  const d = new Date(date)
  if (isToday(d)) return 'Hôm nay'
  if (isTomorrow(d)) return 'Ngày mai'
  return format(d, 'dd/MM/yyyy')
}

export function formatDateTime(date) {
  if (!date) return '—'
  return format(new Date(date), 'HH:mm dd/MM/yyyy')
}

export function timeAgo(date) {
  if (!date) return '—'
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi })
}

export function isOverdue(date) {
  if (!date) return false
  return isPast(new Date(date))
}

export function formatMinutes(mins) {
  if (!mins) return '0p'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h${m > 0 ? m + 'p' : ''}` : `${m}p`
}

export function slugify(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
}

export function truncate(str, n = 80) {
  if (!str) return ''
  return str.length > n ? str.slice(0, n) + '...' : str
}

export function parseTagInput(raw) {
  return raw.split(/[,;\s]+/).map(t => t.trim()).filter(Boolean)
}
