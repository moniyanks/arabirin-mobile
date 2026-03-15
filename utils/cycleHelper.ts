import { parseISO, format, addDays, differenceInDays, isToday, isBefore, isAfter } from 'date-fns'

export type Period = { id: string; startDate: string; endDate: string | null }
export type FertileWindow = { fertileStart: string; fertileEnd: string; ovulationDay: string }
export type PhaseKey = 'period' | 'follicular' | 'fertile' | 'ovulation' | 'luteal' | 'unknown'
export type PhaseInfo = { phase: PhaseKey; message: string; showDay: boolean }

export const parseLocalDate = (d: string) => parseISO(d)
export const toLocalDateStr = (d: Date) => format(d, 'yyyy-MM-dd')
export const todayStr = () => toLocalDateStr(new Date())
export const daysBetween = (a: string, b: string) =>
  Math.abs(differenceInDays(parseLocalDate(b), parseLocalDate(a)))

export const getNextPeriodDate = (periods: Period[], cycleLength: number) => {
  if (!periods.length) return null
  const last = periods[periods.length - 1]
  return toLocalDateStr(addDays(parseLocalDate(last.startDate), cycleLength))
}

export const getCurrentCycleDay = (periods: Period[], cycleLength: number) => {
  if (!periods.length) return null
  const last = periods[periods.length - 1]
  const day = differenceInDays(new Date(), parseLocalDate(last.startDate)) + 1
  if (day < 1 || day > cycleLength) return null
  return day
}

export const getFertileWindow = (periods: Period[], cycleLength: number): FertileWindow | null => {
  if (!periods.length) return null
  const last = periods[periods.length - 1]
  const ovulation = addDays(parseLocalDate(last.startDate), cycleLength - 14)
  return {
    fertileStart: toLocalDateStr(addDays(ovulation, -5)),
    fertileEnd: toLocalDateStr(addDays(ovulation, 1)),
    ovulationDay: toLocalDateStr(ovulation),
  }
}

export const getPredictedPeriods = (
  periods: Period[], cycleLength: number, periodLength: number, count = 12
) => {
  if (!periods.length) return []
  const last = periods[periods.length - 1]
  return Array.from({ length: count }, (_, i) => {
    const start = addDays(parseLocalDate(last.startDate), cycleLength * (i + 1))
    return {
      startDate: toLocalDateStr(start),
      endDate: toLocalDateStr(addDays(start, periodLength - 1)),
    }
  })
}

export const getAllFertileWindows = (periods: Period[], cycleLength: number): FertileWindow[] => {
  if (!periods.length) return []
  const last = periods[periods.length - 1]
  return Array.from({ length: 13 }, (_, i) => {
    const cycleStart = addDays(parseLocalDate(last.startDate), cycleLength * i)
    const ovulation = addDays(cycleStart, cycleLength - 14)
    return {
      fertileStart: toLocalDateStr(addDays(ovulation, -5)),
      fertileEnd: toLocalDateStr(addDays(ovulation, 1)),
      ovulationDay: toLocalDateStr(ovulation),
    }
  })
}

export const isTodayPeriodDay = (periods: Period[]) => {
  const today = new Date()
  return periods.some((p) => {
    const start = parseLocalDate(p.startDate)
    const end = p.endDate ? parseLocalDate(p.endDate) : start
    return isToday(start) || isToday(end) || (!isBefore(today, start) && !isAfter(today, end))
  })
}

export const formatDate = (dateStr: string) =>
  dateStr ? format(parseLocalDate(dateStr), 'd MMM yyyy') : ''

export const getPhaseInfo = (
  currentDay: number | null, cycleLength: number, periodLength: number
): PhaseInfo => {
  if (!currentDay || !cycleLength || !periodLength)
    return { phase: 'unknown', message: '', showDay: false }
  const ovulationDay = cycleLength - 13
  const fertileStart = ovulationDay - 5
  const fertileEnd = ovulationDay + 1
  const daysUntilPeriod = cycleLength - currentDay + 1
  const fertileDaysLeft = fertileEnd - currentDay + 1

  if (currentDay <= periodLength)
    return { phase: 'period', message: `Day ${currentDay} of your period`, showDay: true }
  if (currentDay < fertileStart)
    return { phase: 'follicular', message: 'Rising Energy 🌱', showDay: false }
  if (currentDay >= fertileStart && currentDay <= fertileEnd) {
    if (currentDay === ovulationDay)
      return { phase: 'ovulation', message: 'Peak Day ✨', showDay: false }
    return {
      phase: 'fertile',
      message: `Fertile Window 🌿 · ${Math.max(fertileDaysLeft, 1)} days left`,
      showDay: false,
    }
  }
  return { phase: 'luteal', message: `Period in ${daysUntilPeriod} days 🌙`, showDay: false }
}
