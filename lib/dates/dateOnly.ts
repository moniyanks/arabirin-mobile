import { AppError } from '../errors/appError'

export type DateOnlyString = `${number}-${number}-${number}`

function assertValidParts(year: number, month: number, day: number): void {
  const date = new Date(year, month - 1, day, 12, 0, 0, 0)

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new AppError({
      code: 'DATE_ERROR',
      message: `Invalid calendar date: ${year}-${month}-${day}`,
      userMessage: 'A date in your health timeline is invalid.',
    })
  }
}

export function parseDateOnly(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!match) {
    throw new AppError({
      code: 'DATE_ERROR',
      message: `Invalid date-only format: ${value}`,
      userMessage: 'A date in your health timeline is invalid.',
    })
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  assertValidParts(year, month, day)

  return new Date(year, month - 1, day, 12, 0, 0, 0)
}

export function formatDateOnly(date: Date): DateOnlyString {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}` as DateOnlyString
}

export function todayDateOnly(): DateOnlyString {
  return formatDateOnly(new Date())
}

export function addDaysDateOnly(value: string, days: number): DateOnlyString {
  const date = parseDateOnly(value)
  date.setDate(date.getDate() + days)
  return formatDateOnly(date)
}

export function diffDaysDateOnly(from: string, to: string): number {
  const fromDate = parseDateOnly(from)
  const toDate = parseDateOnly(to)
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((toDate.getTime() - fromDate.getTime()) / msPerDay)
}

export function isDateOnlyInRange(
  target: string,
  start: string,
  end: string | null
): boolean {
  const targetDate = parseDateOnly(target).getTime()
  const startDate = parseDateOnly(start).getTime()
  const endDate = parseDateOnly(end ?? start).getTime()

  return targetDate >= startDate && targetDate <= endDate
}

export function compareDateOnly(a: string, b: string): number {
  return parseDateOnly(a).getTime() - parseDateOnly(b).getTime()
}