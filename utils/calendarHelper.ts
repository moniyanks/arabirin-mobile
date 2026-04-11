import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek
} from 'date-fns'
import type { Period, FertileWindow } from './cycleHelper'

export type CalendarDayState = {
  date: Date
  dateStr: string
  inCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isPeriod: boolean
  isPredictedPeriod: boolean
  isFertile: boolean
  isOvulation: boolean
}

export function getMonthLabel(monthDate: Date) {
  return format(monthDate, 'MMMM yyyy')
}

export function buildMonthGrid(
  monthDate: Date,
  selectedDate: Date,
  periods: Period[],
  predictedPeriods: Array<{ startDate: string; endDate: string }>,
  fertileWindows: FertileWindow[]
): CalendarDayState[] {
  const monthStart = startOfMonth(monthDate)
  const monthEnd = endOfMonth(monthDate)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const days: CalendarDayState[] = []
  let cursor = gridStart

  while (cursor <= gridEnd) {
    const dateStr = format(cursor, 'yyyy-MM-dd')

    const isPeriod = periods.some((p) => {
      const start = p.startDate
      const end = p.endDate ?? p.startDate
      return dateStr >= start && dateStr <= end
    })

    const isPredictedPeriod = predictedPeriods.some((p) => {
      return dateStr >= p.startDate && dateStr <= p.endDate
    })

    const fertileMatch = fertileWindows.find(
      (w) => dateStr >= w.fertileStart && dateStr <= w.fertileEnd
    )

    const ovulationMatch = fertileWindows.find((w) => dateStr === w.ovulationDay)

    days.push({
      date: cursor,
      dateStr,
      inCurrentMonth: isSameMonth(cursor, monthDate),
      isToday: isSameDay(cursor, new Date()),
      isSelected: isSameDay(cursor, selectedDate),
      isPeriod,
      isPredictedPeriod,
      isFertile: !!fertileMatch,
      isOvulation: !!ovulationMatch
    })

    cursor = addDays(cursor, 1)
  }

  return days
}

export function getWeekdayLabels() {
  return ['S', 'M', 'T', 'W', 'T', 'F', 'S']
}

export function goToPreviousMonth(monthDate: Date) {
  return addMonths(monthDate, -1)
}

export function goToNextMonth(monthDate: Date) {
  return addMonths(monthDate, 1)
}
export function getSelectedDateInfo(params: {
  mode?: string
  isPeriod: boolean
  isPredictedPeriod: boolean
  isFertile: boolean
  isOvulation: boolean
}) {
  const { mode, isPeriod, isPredictedPeriod, isFertile, isOvulation } = params

  if (mode !== 'cycle') {
    return {
      title: 'Daily check-in',
      message: 'Use this day to log symptoms, notes, and anything you want to keep track of.'
    }
  }

  if (isPeriod) {
    return {
      title: 'Period day',
      message: 'You logged this day as part of your period.'
    }
  }

  if (isOvulation) {
    return {
      title: 'Ovulation',
      message:
        'This is your estimated ovulation day, when your ovary is most likely to release an egg.'
    }
  }

  if (isFertile) {
    return {
      title: 'Fertile window',
      message:
        'You are in your fertile window, the days leading up to ovulation when pregnancy is most likely.'
    }
  }

  if (isPredictedPeriod) {
    return {
      title: 'Predicted period',
      message:
        'This day falls within your predicted next period based on your recent cycle history.'
    }
  }

  return {
    title: 'No logged event',
    message: 'No period or fertility event is currently associated with this date.'
  }
}
