import { differenceInCalendarDays, format, parseISO } from 'date-fns'

export type CheckInRhythmStatus = 'active' | 'grace' | 'inactive'

export type CheckInRhythmInsight = {
  count: number
  status: CheckInRhythmStatus
  title: string
  subtitle: string
  lastLoggedDate: string | null
  hasCheckedInToday: boolean
}

const MAX_FRONT_GRACE_DAYS = 1

function toDateOnly(value: string): string {
  return value.slice(0, 10)
}

function getTodayDateOnly(): string {
  return format(new Date(), 'yyyy-MM-dd')
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

type CheckInRhythmComputation = {
  count: number
  status: CheckInRhythmStatus
  lastLoggedDate: string | null
}

function computeCheckInRhythm(
  logDates: string[],
  todayDateOnly: string = getTodayDateOnly()
): CheckInRhythmComputation {
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

function buildCopy(
  result: CheckInRhythmComputation
): Pick<CheckInRhythmInsight, 'title' | 'subtitle'> {
  if (result.status === 'inactive' || result.count === 0) {
    return {
      title: 'Check in today',
      subtitle: 'Begin building your rhythm with one gentle check-in.',
    }
  }

  if (result.status === 'grace') {
    return {
      title: 'Check in today',
      subtitle: 'You’re still in rhythm. A check-in today keeps it going.',
    }
  }

  return {
    title: 'You checked in today',
    subtitle: 'Your rhythm is building, one check-in at a time.',
  }
}

export function getCheckInRhythmInsight(
  logDates: string[],
  todayDateOnly?: string
): CheckInRhythmInsight {
  const effectiveToday = todayDateOnly ?? getTodayDateOnly()
  const computed = computeCheckInRhythm(logDates, effectiveToday)
  const copy = buildCopy(computed)

  return {
    count: computed.count,
    status: computed.status,
    title: copy.title,
    subtitle: copy.subtitle,
    lastLoggedDate: computed.lastLoggedDate,
    hasCheckedInToday: computed.lastLoggedDate === effectiveToday,
  }
}