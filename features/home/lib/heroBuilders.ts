import { formatDate } from '../../../utils/cycleHelper'
import type { HomeViewModel } from '../types'
import type { SupportedPhase } from './types'
import {
  getCycleRingProgress,
  getCycleRingStatusText,
  getSafePhaseLabel,
  getSafePhaseSupportMessage,
  getSafeRingInnerLabel,
} from './cycleDisplay'
import { buildTtcHeroContent } from './contentBuilders'
import { formatShortDate } from './formatters'

export function buildCycleHero({
  currentCycleDay,
  cycleLength,
  nextPeriodDate,
  phase,
}: {
  currentCycleDay: number | null
  cycleLength: number
  nextPeriodDate: string | Date | null
  phase: SupportedPhase
}): HomeViewModel['hero'] {
  const nextPeriodDisplay = nextPeriodDate
    ? typeof nextPeriodDate === 'string'
      ? formatDate(nextPeriodDate)
      : formatShortDate(nextPeriodDate.toISOString())
    : '—'

  return {
    kind: 'cycle',
    badge: getSafePhaseLabel(phase),
    title: currentCycleDay ? `Cycle day ${currentCycleDay}` : 'Your cycle rhythm',
    subtitle: getSafePhaseSupportMessage(phase),
    meta: nextPeriodDate
      ? `Next period: ${nextPeriodDisplay}`
      : undefined,
    ringLabel: getSafeRingInnerLabel(phase),
    ringStatus: getCycleRingStatusText({
      phase,
      currentCycleDay,
      cycleLength,
      nextPeriodDisplay,
    }),
    ringProgress: getCycleRingProgress(currentCycleDay, cycleLength),
  }
}

export function buildTtcHero(
  fertilityInsight: any
): HomeViewModel['hero'] {
  const heroContent = buildTtcHeroContent(fertilityInsight)

  return {
    kind: 'ttc',
    badge: heroContent.badge,
    title: heroContent.title,
    subtitle: heroContent.subtitle,
    meta: heroContent.meta,
    confidenceLabel: heroContent.confidenceLabel,
  }
}

export function buildPregnancyHero(
  pregnancyInsight: any
): HomeViewModel['hero'] {
  return {
    kind: 'pregnancy',
    badge: pregnancyInsight?.trimesterLabel || 'PREGNANCY',
    title: pregnancyInsight?.weekLabel || 'Your pregnancy journey',
    subtitle:
      pregnancyInsight?.dueDateLabel ||
      'Add your pregnancy timeline to make this space more personal.',
    meta:
      pregnancyInsight?.weeksRemainingLabel ||
      'Track how your body feels as this season unfolds.',
  }
}

export function buildGenericHero(): HomeViewModel['hero'] {
  return {
    kind: 'generic',
    badge: 'BODY CARE',
    title: 'Your body, in context',
    subtitle: 'Small check-ins help meaningful patterns emerge.',
    meta: 'Keep going gently.',
  }
}