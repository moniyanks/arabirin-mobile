import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns'
import type { AppMode } from '../constants/appMode'
import type { Period, SymptomLog, Profile } from '../types/appData'

export type CycleStatus =
  | 'hidden'
  | 'insufficient_data'
  | 'on_track'
  | 'period_expected'
  | 'awaiting_user_update'
  | 'period_overdue'
  | 'journey_check_in'

type GetCycleStatusArgs = {
  mode: AppMode
  periods: Period[]
  cycleLength: number | null
  todayStr: string
  symptomLogs: SymptomLog[]
}

function addDaysToDateStr(dateStr: string, days: number): string {
  return format(addDays(parseISO(dateStr), days), 'yyyy-MM-dd')
}

function diffInDays(a: string, b: string): number {
  return differenceInCalendarDays(parseISO(a), parseISO(b))
}

function hasRecentLogs(logs: SymptomLog[], todayStr: string, windowDays = 14): boolean {
  const today = parseISO(todayStr)

  return logs.some((log) => {
    const logDate = parseISO(log.log_date)
    const diff = differenceInCalendarDays(today, logDate)
    return diff >= 0 && diff <= windowDays
  })
}

export function getCycleStatus({
  mode,
  periods,
  cycleLength,
  todayStr,
  symptomLogs
}: GetCycleStatusArgs): CycleStatus {
  if (mode !== 'cycle' && mode !== 'ttc') {
    return 'hidden'
  }

  if (!cycleLength || periods.length < 2) {
    return 'insufficient_data'
  }

  const sortedPeriods = [...periods].sort((a, b) => a.startDate.localeCompare(b.startDate))

  const lastPeriod = sortedPeriods[sortedPeriods.length - 1]
  const expectedNextPeriodStart = addDaysToDateStr(lastPeriod.startDate, cycleLength)
  const daysPastExpected = diffInDays(todayStr, expectedNextPeriodStart)
  const recentLogsExist = hasRecentLogs(symptomLogs, todayStr, 14)

  if (daysPastExpected < 0) {
    return 'on_track'
  }

  if (daysPastExpected >= 0 && daysPastExpected <= 2) {
    return 'period_expected'
  }

  if (!recentLogsExist) {
    return 'awaiting_user_update'
  }

  if (daysPastExpected >= 3 && daysPastExpected <= 6) {
    return 'period_overdue'
  }

  return 'journey_check_in'
}

export function getCycleStatusCopy(status: CycleStatus): {
  title: string
  body: string
} {
  switch (status) {
    case 'period_expected':
      return {
        title: 'Your next period may be close',
        body: 'Based on your cycle pattern, your next period may be approaching soon.'
      }

    case 'awaiting_user_update':
      return {
        title: 'We’re waiting for your next update',
        body: 'Log your next period or check-in so your body insight stays aligned with you.'
      }

    case 'period_overdue':
      return {
        title: 'Your cycle may be asking for a check-in',
        body: 'Your next period has not been logged yet. Bodies can shift for many reasons.'
      }

    case 'journey_check_in':
      return {
        title: 'A gentle journey check-in',
        body: 'Your pattern may have changed. If something new is unfolding, you can tell Àràbìrìn.'
      }

    case 'on_track':
      return {
        title: 'Your cycle rhythm looks steady',
        body: 'We’ll keep learning from your logged patterns as you continue checking in.'
      }

    case 'insufficient_data':
      return {
        title: 'Keep logging to build your body insight',
        body: 'The more you log, the more personalised your cycle guidance becomes.'
      }

    default:
      return {
        title: '',
        body: ''
      }
  }
}

export function shouldShowJourneyCard(profile: Profile, status: CycleStatus): boolean {
  if (!profile) return false
  if (profile.mode !== 'cycle' && profile.mode !== 'ttc') return false
  return status !== 'hidden'
}
