import { differenceInCalendarDays, parseISO } from 'date-fns'

export type StreakStatus = 'active' | 'grace' | 'inactive'

export type StreakInsight = {
  count: number
  status: StreakStatus
  title: string
  subtitle: string
  lastLoggedDate: string | null
}

const MAX_FRONT_GRACE_DAYS = 1

function toDateOnly(value: string): string {
  return value.slice(0, 10)
}

function getTodayDateOnly(): string {
  return new Date().toISOString().slice(0, 10)
}

function getUniqueSortedLogDates(logDates: string[]): string[] {
  return Array.from(
    new Set(
      logDates
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
        .map(toDateOnly)
    )
  ).sort((a, b) => b.localeCompare(a))
}

type StreakComputation = {
  count: number
  status: StreakStatus
  lastLoggedDate: string | null
}

function computeStreak(logDates: string[], todayDateOnly: string = getTodayDateOnly()): StreakComputation {
  const uniqueDates = getUniqueSortedLogDates(logDates)

  if (uniqueDates.length === 0) {
    return {
      count: 0,
      status: 'inactive',
      lastLoggedDate: null,
    }
  }

  const today = parseISO(todayDateOnly)
  const mostRecentLog = parseISO(uniqueDates[0])
  const daysSinceMostRecentLog = differenceInCalendarDays(today, mostRecentLog)

  if (daysSinceMostRecentLog > MAX_FRONT_GRACE_DAYS) {
    return {
      count: 0,
      status: 'inactive',
      lastLoggedDate: uniqueDates[0],
    }
  }

  let count = 1

  for (let i = 1; i < uniqueDates.length; i += 1) {
    const previous = parseISO(uniqueDates[i - 1])
    const current = parseISO(uniqueDates[i])

    const difference = differenceInCalendarDays(previous, current)

    if (difference === 1) {
      count += 1
      continue
    }

    break
  }

  return {
    count,
    status: daysSinceMostRecentLog === 0 ? 'active' : 'grace',
    lastLoggedDate: uniqueDates[0],
  }
}

function buildCopy(result: StreakComputation): Pick<StreakInsight, 'title' | 'subtitle'> {
  if (result.status === 'inactive' || result.count === 0) {
    return {
      title: 'Today’s body check-in',
      subtitle: 'Log even one symptom, mood, or energy shift to begin.',
    }
  }

  if (result.status === 'grace') {
    return {
      title: 'Today’s body check-in',
      subtitle: 'You’re still in rhythm. A check-in today keeps it going.',
    }
  }

  return {
    title: 'Today’s body check-in',
    subtitle: 'You checked in today.',
  }
}

export function getStreakInsight(logDates: string[], todayDateOnly?: string): StreakInsight {
  const computed = computeStreak(logDates, todayDateOnly)
  const copy = buildCopy(computed)

  return {
    count: computed.count,
    status: computed.status,
    title: copy.title,
    subtitle: copy.subtitle,
    lastLoggedDate: computed.lastLoggedDate,
  }
}