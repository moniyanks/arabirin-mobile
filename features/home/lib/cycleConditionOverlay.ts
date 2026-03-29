import type { SupportedPhase } from './types'

type CycleConditionOverlay = {
  noticeToday?: string[]
  insightOverride?: string
  heroMetaOverride?: string
  heroSubtitleOverride?: string
}

export function getCycleConditionOverlay({
  conditions,
  phase,
}: {
  conditions: string[]
  phase: SupportedPhase
}): CycleConditionOverlay | null {
  if (!conditions || conditions.length === 0) return null

  const lower = conditions.map((c) => c.toLowerCase())

  // FIBROIDS
  if (lower.includes('fibroids')) {
    return {
      noticeToday:
        phase === 'period'
          ? ['Flow', 'Clots', 'Pain', 'Pressure']
          : ['Flow', 'Pain', 'Energy'],
      heroSubtitleOverride:
        'Your cycle may feel heavier or more intense than expected. Focus on what your body is telling you .',
      heroMetaOverride: undefined,
      insightOverride:
        'Your cycle may not follow standard patterns. Noticing changes in flow, pressure, and discomfort can help you better understand what is normal for your body over time.',
    }
  }

  // PCOS
  if (lower.includes('pcos')) {
    return {
      noticeToday: ['Energy', 'Mood', 'Cervical fluid'],
      heroSubtitleOverride:
        'Cycle timing may be less predictable. Your body signals matter more than exact dates.',
      heroMetaOverride:
        'Predictions may vary. Focus on patterns instead of precision.',
      insightOverride:
        'Cycle timing may be irregular. Tracking body signals consistently will help you build a clearer understanding over time.',
    }
  }

  // ENDOMETRIOSIS
  if (lower.includes('endometriosis')) {
    return {
      noticeToday:
        phase === 'period'
          ? ['Pain', 'Energy', 'Rest']
          : ['Pain', 'Fatigue', 'Mood'],
      heroSubtitleOverride:
        'Pain and energy may shift in ways that don’t follow a typical cycle pattern.',
      heroMetaOverride:
        'Your experience may vary from standard cycle expectations.',
      insightOverride:
        'Pain and fatigue may not follow predictable timing. Tracking consistently can help you understand what your body needs in each phase.',
    }
  }

  return null
}