import { FERTILE_STATUS_MESSAGES } from '../../../utils/fertilityIntelligence'
import type { SupportedPhase } from './types'
import { formatShortDate, mapConfidenceLabel } from './formatters'

type FertileStatus = keyof typeof FERTILE_STATUS_MESSAGES

function getPhaseAwareCycleMessage(phase: SupportedPhase): string {
  switch (phase) {
    case 'period':
      return 'Flow may still feel heavier today. Pay attention to your energy and avoid overextending.'

    case 'follicular':
      return 'Energy is likely starting to return. This can be a good time to ease back into focus and routine.'

    case 'fertile':
      return 'Your body may feel more open, alert, or responsive right now. Notice patterns without forcing certainty.'

    case 'ovulation':
      return 'You may be near ovulation. Energy, awareness, or body sensitivity can feel more noticeable around this time.'

    case 'luteal':
      return 'Energy and mood may feel less steady now. Give yourself a little more buffer and pay attention to what your body needs.'

    default:
      return 'Small, consistent check-ins help turn daily experiences into patterns you can actually understand.'
  }
}

export function buildTtcHeroContent(fertilityInsight: any) {
  const fertileStatus = fertilityInsight.fertileWindowStatus as FertileStatus

  const statusMessage =
    FERTILE_STATUS_MESSAGES[fertileStatus] ?? 'Keep logging to improve fertile predictions.'

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
    fertileStatus
  }
}

export function buildTtcInsightMessage(fertilityInsight: any): string {
  const fertileStatus = fertilityInsight.fertileWindowStatus as FertileStatus

  if (fertileStatus === 'in_fertile' || fertileStatus === 'ovulation_day') {
    return 'Your body may be giving clearer fertility cues right now. Notice what feels present without forcing certainty.'
  }

  if (fertileStatus === 'after_ovulation') {
    return 'This window may be closing for now. Staying aware of your body’s rhythm can make future patterns easier to recognise.'
  }

  return 'Fertility patterns often become clearer with gentle, consistent awareness over time.'
}

export function buildPregnancyInsightMessage(pregnancyOverlay: any): {
  title: string
  message: string
} {
  return {
    title: pregnancyOverlay?.title || 'Body insight',
    message:
      pregnancyOverlay?.message ||
      'Your body is moving through steady change. Gentle awareness can help you notice shifts in energy, rest, and physical comfort over time.'
  }
}

export function buildCycleInsightMessage(phase: SupportedPhase): {
  title: string
  message: string
} {
  return {
    title: 'Body insight',
    message: getPhaseAwareCycleMessage(phase)
  }
}
