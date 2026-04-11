import { getGestationalAge, getTrimester, getWeeksRemaining } from './pregnancyHelper'

type PregnancyHomeInsight = {
  weekLabel: string
  trimesterLabel: string
  dueDateLabel: string
  supportTitle: string
  supportMessage: string
  weeksRemainingLabel: string
}

function formatDisplayDate(value: string): string {
  const date = new Date(`${value}T00:00:00`)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getPregnancySupportMessage(weeks: number): { title: string; message: string } {
  if (weeks <= 13) {
    return {
      title: 'A new chapter is taking shape',
      message:
        'This season can bring fatigue, tenderness, nausea, or emotional shifts. A gentle check-in can help you notice what feels true for you.'
    }
  }

  if (weeks <= 27) {
    return {
      title: 'Your body may be finding a new rhythm',
      message:
        'Some women notice more steadiness in this stage, while others still need rest and softness. Keep checking in with what your body is asking for.'
    }
  }

  return {
    title: 'Your body is carrying more each week',
    message:
      'This stage can bring heaviness, stretching, and changing energy. Let today’s check-in help you notice what support feels most helpful.'
  }
}

export function getPregnancyHomeInsight(params: {
  lmpDate: string | null
  dueDate: string | null
  now?: Date
}): PregnancyHomeInsight | null {
  const { lmpDate, dueDate, now = new Date() } = params

  if (!lmpDate || !dueDate) return null

  const { weeks, days } = getGestationalAge(lmpDate, now)
  const trimester = getTrimester(weeks)
  const weeksRemaining = getWeeksRemaining(lmpDate, now)
  const support = getPregnancySupportMessage(weeks)

  return {
    weekLabel: `Week ${weeks}, Day ${days}`,
    trimesterLabel:
      trimester === 1
        ? 'First trimester'
        : trimester === 2
          ? 'Second trimester'
          : 'Third trimester',
    dueDateLabel: `Due ${formatDisplayDate(dueDate)}`,
    supportTitle: support.title,
    supportMessage: support.message,
    weeksRemainingLabel:
      weeksRemaining > 0
        ? `${weeksRemaining} week${weeksRemaining === 1 ? '' : 's'} to go`
        : 'Near your due date'
  }
}
