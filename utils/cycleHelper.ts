import { format } from 'date-fns'
import {
  addDaysDateOnly,
  compareDateOnly,
  diffDaysDateOnly,
  formatDateOnly,
  isDateOnlyInRange,
  parseDateOnly,
  todayDateOnly
} from '../lib/dates/dateOnly'

export type Period = { id: string; startDate: string; endDate: string | null }
export type FertileWindow = { fertileStart: string; fertileEnd: string; ovulationDay: string }
export type PhaseKey = 'period' | 'follicular' | 'fertile' | 'ovulation' | 'luteal' | 'unknown'
export type PhaseInfo = { phase: PhaseKey; message: string; showDay: boolean }

export const parseLocalDate = (d: string) => parseDateOnly(d)
export const toLocalDateStr = (d: Date) => formatDateOnly(d)
export const todayStr = () => todayDateOnly()

export const daysBetween = (a: string, b: string) => Math.abs(diffDaysDateOnly(a, b))

export const getNextPeriodDate = (periods: Period[], cycleLength: number) => {
  if (!periods.length) return null
  const last = periods[periods.length - 1]
  return addDaysDateOnly(last.startDate, cycleLength)
}

export const getCurrentCycleDay = (periods: Period[], cycleLength: number) => {
  if (!periods.length) return null
  const last = periods[periods.length - 1]
  const day = diffDaysDateOnly(last.startDate, todayDateOnly()) + 1
  if (day < 1 || day > cycleLength) return null
  return day
}

export const getFertileWindow = (periods: Period[], cycleLength: number): FertileWindow | null => {
  if (!periods.length) return null
  const last = periods[periods.length - 1]
  const ovulationDay = addDaysDateOnly(last.startDate, cycleLength - 14)

  return {
    fertileStart: addDaysDateOnly(ovulationDay, -5),
    fertileEnd: addDaysDateOnly(ovulationDay, 1),
    ovulationDay
  }
}

export const getPredictedPeriods = (
  periods: Period[],
  cycleLength: number,
  periodLength: number,
  count = 12
) => {
  if (!periods.length) return []

  const last = periods[periods.length - 1]

  return Array.from({ length: count }, (_, index) => {
    const startDate = addDaysDateOnly(last.startDate, cycleLength * (index + 1))
    const endDate = addDaysDateOnly(startDate, periodLength - 1)

    return {
      startDate,
      endDate
    }
  })
}

export const getAllFertileWindows = (periods: Period[], cycleLength: number): FertileWindow[] => {
  if (!periods.length) return []

  const last = periods[periods.length - 1]

  return Array.from({ length: 13 }, (_, index) => {
    const cycleStart = addDaysDateOnly(last.startDate, cycleLength * index)
    const ovulationDay = addDaysDateOnly(cycleStart, cycleLength - 14)

    return {
      fertileStart: addDaysDateOnly(ovulationDay, -5),
      fertileEnd: addDaysDateOnly(ovulationDay, 1),
      ovulationDay
    }
  })
}

export const isTodayPeriodDay = (periods: Period[]) => {
  const today = todayDateOnly()

  return periods.some((period) => isDateOnlyInRange(today, period.startDate, period.endDate))
}

export const formatDate = (dateStr: string) =>
  dateStr ? format(parseDateOnly(dateStr), 'd MMM yyyy') : ''

export const getPhaseInfo = (
  currentDay: number | null,
  cycleLength: number,
  periodLength: number
): PhaseInfo => {
  if (!currentDay || !cycleLength || !periodLength) {
    return { phase: 'unknown', message: '', showDay: false }
  }

  const ovulationDay = cycleLength - 13
  const fertileStart = ovulationDay - 5
  const fertileEnd = ovulationDay + 1
  const daysUntilPeriod = cycleLength - currentDay + 1
  const fertileDaysLeft = fertileEnd - currentDay + 1

  if (currentDay <= periodLength) {
    return { phase: 'period', message: `Day ${currentDay} of your period`, showDay: true }
  }

  if (currentDay < fertileStart) {
    return { phase: 'follicular', message: 'Rising Energy 🌱', showDay: false }
  }

  if (currentDay >= fertileStart && currentDay <= fertileEnd) {
    if (currentDay === ovulationDay) {
      return { phase: 'ovulation', message: 'Peak Day ✨', showDay: false }
    }

    return {
      phase: 'fertile',
      message: `Fertile Window 🌿 · ${Math.max(fertileDaysLeft, 1)} days left`,
      showDay: false
    }
  }

  return { phase: 'luteal', message: `Period in ${daysUntilPeriod} days 🌙`, showDay: false }
}

export const sortPeriodsAscending = (periods: Period[]): Period[] => {
  return [...periods].sort((a, b) => compareDateOnly(a.startDate, b.startDate))
}
