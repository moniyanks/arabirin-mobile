const MS_PER_DAY = 24 * 60 * 60 * 1000
const PREGNANCY_LENGTH_DAYS = 280

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatDateOnly(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function differenceInDays(later: Date, earlier: Date): number {
  const laterDay = startOfLocalDay(later).getTime()
  const earlierDay = startOfLocalDay(earlier).getTime()
  return Math.floor((laterDay - earlierDay) / MS_PER_DAY)
}

export function calculateDueDateFromLmp(lmpDate: string): string {
  const lmp = parseDateOnly(lmpDate)
  return formatDateOnly(addDays(lmp, PREGNANCY_LENGTH_DAYS))
}

export function calculateLmpFromDueDate(dueDate: string): string {
  const due = parseDateOnly(dueDate)
  return formatDateOnly(addDays(due, -PREGNANCY_LENGTH_DAYS))
}

export function getGestationalAge(lmpDate: string, now: Date = new Date()) {
  const lmp = parseDateOnly(lmpDate)
  const totalDays = Math.max(0, differenceInDays(now, lmp))
  const weeks = Math.floor(totalDays / 7)
  const days = totalDays % 7

  return {
    totalDays,
    weeks,
    days
  }
}

export function getTrimester(weeks: number): 1 | 2 | 3 {
  if (weeks <= 13) return 1
  if (weeks <= 27) return 2
  return 3
}

export function getWeeksRemaining(lmpDate: string, now: Date = new Date()): number {
  const { totalDays } = getGestationalAge(lmpDate, now)
  return Math.max(0, Math.ceil((280 - totalDays) / 7))
}
