import { FERTILE_STATUS_MESSAGES } from '../../../utils/fertilityIntelligence'
import type { SupportedPhase } from './types'
import { formatShortDate, mapConfidenceLabel } from './formatters'
import { getCycleInsightMessage } from './cycleDisplay'

type FertileStatus = keyof typeof FERTILE_STATUS_MESSAGES

export function buildTtcHeroContent(fertilityInsight: any) {
  const fertileStatus = fertilityInsight.fertileWindowStatus as FertileStatus

  const statusMessage =
    FERTILE_STATUS_MESSAGES[fertileStatus] ??
    'Keep logging to improve fertile predictions.'

  const title =
    fertileStatus === 'no_data'
      ? 'Start building a clearer view of your fertile rhythm'
      : fertileStatus === 'in_fertile'
        ? 'You are likely within your fertile window'
        : fertileStatus === 'ovulation_day'
          ? 'Today may be your estimated ovulation day'
          : fertileStatus === 'after_ovulation'
            ? 'Your fertile window has likely passed for this cycle'
            : `${fertilityInsight.daysUntilFertile ?? 0} day${
                fertilityInsight.daysUntilFertile === 1 ? '' : 's'
              } until your fertile window`

  const subtitle = fertilityInsight.ovulationDay
    ? `Estimated ovulation: ${formatShortDate(fertilityInsight.ovulationDay)}`
    : statusMessage

  const meta = fertilityInsight.fertileStart
    ? `${formatShortDate(fertilityInsight.fertileStart)} to ${formatShortDate(
        fertilityInsight.fertileEnd
      )}`
    : 'Consistency improves confidence over time.'

  return {
    badge:
      fertileStatus === 'in_fertile' || fertileStatus === 'ovulation_day'
        ? 'FERTILE WINDOW'
        : 'TRYING TO CONCEIVE',
    title,
    subtitle,
    meta,
    confidenceLabel: mapConfidenceLabel(fertilityInsight.confidence),
    fertileStatus,
  }
}

export function buildTtcInsightMessage(fertilityInsight: any): string {
  const fertileStatus = fertilityInsight.fertileWindowStatus as FertileStatus

  if (fertileStatus === 'in_fertile' || fertileStatus === 'ovulation_day') {
    return 'You may be in a stronger window for conception. Logging body signs consistently can help you better understand your fertile pattern.'
  }

  if (fertileStatus === 'after_ovulation') {
    return 'Your fertile window has likely passed for this cycle. Continued tracking can improve clarity for the next one.'
  }

  return 'Fertility patterns become clearer when cycle dates and body signs are logged consistently over time.'
}

export function buildPregnancyInsightMessage(pregnancyOverlay: any): {
  title: string
  message: string
} {
  return {
    title: pregnancyOverlay?.title || 'Body insight',
    message:
      pregnancyOverlay?.message ||
      'Pregnancy can bring subtle shifts in energy, sleep, and physical comfort. Gentle tracking helps you notice what is changing over time.',
  }
}

export function buildCycleInsightMessage(phase: SupportedPhase): {
  title: string
  message: string
} {
  return {
    title: 'Body insight',
    message: getCycleInsightMessage(phase),
  }
}