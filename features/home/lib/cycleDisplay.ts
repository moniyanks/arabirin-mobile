import { getPhaseLabel, getPhaseSupportMessage, getRingInnerLabel } from '../../../utils/homeHelper'
import type { SupportedPhase } from './types'

export function getCycleRingProgress(currentCycleDay: number | null, cycleLength: number): number {
  if (!currentCycleDay || !cycleLength || cycleLength <= 0) return 0
  return Math.min(currentCycleDay / cycleLength, 1)
}

export function getCycleRingStatusText({
  phase,
  currentCycleDay,
  cycleLength,
  nextPeriodDisplay
}: {
  phase: SupportedPhase
  currentCycleDay: number | null
  cycleLength: number
  nextPeriodDisplay: string
}): string {
  if (phase === 'fertile') return 'Your body may be showing more fertile signs now.'
  if (phase === 'ovulation') return 'You may be near ovulation.'
  if (phase === 'period') {
    return currentCycleDay
      ? `Day ${currentCycleDay} of your period`
      : 'You are in your period phase.'
  }
  if (phase === 'luteal') return `Your next period may begin around ${nextPeriodDisplay}.`
  if (phase === 'follicular') {
    return currentCycleDay
      ? `You are in the early part of your cycle.`
      : 'You are in the follicular phase.'
  }
  return 'Keep logging to make your rhythm clearer over time.'
}

export function getCycleInsightMessage(phase: SupportedPhase): string {
  switch (phase) {
    case 'period':
      return 'This is a useful time to notice flow, pain, rest, and energy. Over time, these logs can help you understand how your period actually feels in your body.'
    case 'follicular':
      return 'This phase often brings a gradual shift in energy, mood, and momentum. Tracking now can help you notice what tends to return after menstruation.'
    case 'fertile':
      return 'You may notice changes in cervical fluid, body awareness, desire, or energy around this phase. Logging them makes these patterns easier to recognize.'
    case 'ovulation':
      return 'Ovulation can come with subtle physical or emotional changes. Paying attention here may help you better understand your timing.'
    case 'luteal':
      return 'This phase may bring shifts in mood, sleep, appetite, and physical comfort. Tracking consistently can help you see what tends to happen before your period.'
    case 'unknown':
    default:
      return 'Your body reveals patterns over time. The more consistently you log, the more clearly those rhythms begin to take shape.'
  }
}

export function getSafePhaseLabel(phase: SupportedPhase): string {
  if (phase === 'unknown') return 'CYCLE'
  return getPhaseLabel(phase)
}

export function getSafePhaseSupportMessage(phase: SupportedPhase): string {
  if (phase === 'unknown') return 'Keep logging to build your rhythm'
  return getPhaseSupportMessage(phase)
}

export function getSafeRingInnerLabel(phase: SupportedPhase): string {
  if (phase === 'unknown') return 'Today'
  return getRingInnerLabel(phase)
}
