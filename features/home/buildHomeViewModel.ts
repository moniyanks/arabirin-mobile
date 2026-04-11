import { HOME_CONFIG } from './homeConfig'
import type { BuildHomeViewModelParams, HomeShortcut, HomeViewModel } from './types'
import { getGreetingText } from '../../utils/greetingHelper'
import { normalizeAppMode } from '../../constants/appMode'
import { getCurrentCycleDay, getNextPeriodDate, getPhaseInfo } from '../../utils/cycleHelper'
import { calculateFertilityInsight } from '../../utils/fertilityIntelligence'
import { getPregnancyHomeInsight } from '../../utils/pregnancyHomeHelper'
import { getContextAwarePregnancyOverlay } from '../../utils/contextAwarePregnancyHelper'
import type { SupportedPhase } from './lib/types'
import { normalizePhase } from './lib/normalizePhase'
import { getContextLabel, getPrimaryActionLabel } from './lib/labels'
import { extractPregnancyWeek } from './lib/formatters'
import {
  buildCycleInsightMessage,
  buildPregnancyInsightMessage,
  buildTtcInsightMessage
} from './lib/contentBuilders'
import {
  buildCycleHero,
  buildGenericHero,
  buildPregnancyHero,
  buildTtcHero
} from './lib/heroBuilders'
import { getCycleConditionOverlay } from './lib/cycleConditionOverlay'
import { getCheckInRhythmInsight } from '../../utils/streakHelper'

type FertilityInsightLike = ReturnType<typeof calculateFertilityInsight>
type CycleConditionOverlay = ReturnType<typeof getCycleConditionOverlay>

const CYCLE_SHORTCUTS: HomeShortcut[] = [
  { key: 'flow', label: 'Flow', icon: '◉' },
  { key: 'cramps', label: 'Cramps', icon: '⚡' },
  { key: 'mood', label: 'Mood', icon: '💭' },
  { key: 'energy', label: 'Energy', icon: '✦' },
  { key: 'sleep', label: 'Sleep', icon: '◌' }
]

const TTC_SHORTCUTS: HomeShortcut[] = [
  { key: 'cervicalMucus', label: 'CM', icon: '💧' },
  { key: 'ovulationPain', label: 'O-Pain', icon: '⚡' },
  { key: 'spotting', label: 'Spotting', icon: '◉' },
  { key: 'mood', label: 'Mood', icon: '💭' },
  { key: 'energy', label: 'Energy', icon: '✦' }
]

const PREGNANCY_SHORTCUTS: HomeShortcut[] = [
  { key: 'energy', label: 'Energy', icon: '✦' },
  { key: 'mood', label: 'Mood', icon: '💭' },
  { key: 'sleep', label: 'Sleep', icon: '◌' },
  { key: 'pain', label: 'Pain', icon: '⚡' },
  { key: 'notes', label: 'Notes', icon: '◉' }
]

const DEFAULT_SHORTCUTS: HomeShortcut[] = [
  { key: 'energy', label: 'Energy', icon: '✦' },
  { key: 'mood', label: 'Mood', icon: '💭' },
  { key: 'sleep', label: 'Sleep', icon: '◌' }
]

export function buildHomeViewModel({
  profile,
  periods,
  symptomLogs,
  cycleLength,
  periodLength
}: BuildHomeViewModelParams): HomeViewModel {
  const mode = normalizeAppMode(profile?.mode)
  const config = HOME_CONFIG[mode]
  const greeting = getGreetingText()

  const currentCycleDay = getCurrentCycleDay(periods, cycleLength)
  const nextPeriodDate = getNextPeriodDate(periods, cycleLength)

  const rawPhaseInfo = getPhaseInfo(currentCycleDay, cycleLength, periodLength)
  const phase = normalizePhase(rawPhaseInfo.phase)

  const fertilityInsight =
    mode === 'ttc' ? calculateFertilityInsight(periods, symptomLogs, profile) : null

  const pregnancyInsight =
    mode === 'pregnant'
      ? getPregnancyHomeInsight({
          lmpDate: profile?.pregnancy_lmp_date ?? null,
          dueDate: profile?.pregnancy_due_date ?? null
        })
      : null

  const pregnancyOverlay =
    mode === 'pregnant' && pregnancyInsight
      ? getContextAwarePregnancyOverlay({
          conditions: profile?.conditions || [],
          weeks: extractPregnancyWeek(pregnancyInsight.weekLabel)
        })
      : null

  const cycleConditionOverlay =
    mode === 'cycle'
      ? getCycleConditionOverlay({
          conditions: profile?.conditions || [],
          phase
        })
      : null
  const logDates = extractLogDatesFromSymptomLogs(symptomLogs)
  const rhythm = getCheckInRhythmInsight(logDates)

  return {
    mode,
    greeting,
    contextLabel: getContextLabel(mode),
    hero: buildHero({
      mode,
      currentCycleDay,
      cycleLength,
      nextPeriodDate,
      phase,
      fertilityInsight,
      pregnancyInsight,
      cycleConditionOverlay
    }),
    insight: buildInsight({
      mode,
      phase,
      fertilityInsight,
      pregnancyOverlay,
      cycleConditionOverlay
    }),
    noticeToday:
      cycleConditionOverlay?.noticeToday ??
      buildNoticeToday({
        mode,
        phase,
        pregnancyOverlay
      }),
    rhythm,
    primaryAction: {
      label: getPrimaryActionLabel(mode),
      route: '/(tabs)/calendar'
    },
    shortcuts: getShortcuts(mode),
    quickActions: config.quickActions,
    sections: config.sections,
    showSistersPreview: config.showSistersPreview,
    showDisclaimer: config.showDisclaimer,
    emptyState: buildEmptyState({
      mode,
      periods,
      symptomLogs,
      pregnancyInsight
    })
  }
}

function buildHero({
  mode,
  currentCycleDay,
  cycleLength,
  nextPeriodDate,
  phase,
  fertilityInsight,
  pregnancyInsight,
  cycleConditionOverlay
}: {
  mode: string
  currentCycleDay: number | null
  cycleLength: number
  nextPeriodDate: string | Date | null
  phase: SupportedPhase
  fertilityInsight: FertilityInsightLike | null
  pregnancyInsight: ReturnType<typeof getPregnancyHomeInsight> | null
  cycleConditionOverlay: CycleConditionOverlay
}): HomeViewModel['hero'] {
  if (mode === 'ttc' && fertilityInsight) {
    return buildTtcHero(fertilityInsight)
  }

  if (mode === 'pregnant') {
    return buildPregnancyHero(pregnancyInsight)
  }

  if (mode === 'cycle') {
    const baseHero = buildCycleHero({
      currentCycleDay,
      cycleLength,
      nextPeriodDate,
      phase
    })

    if (baseHero?.kind === 'cycle' && cycleConditionOverlay) {
      return {
        ...baseHero,
        subtitle: cycleConditionOverlay.heroSubtitleOverride ?? baseHero.subtitle,
        meta: cycleConditionOverlay.heroMetaOverride ?? baseHero.meta
      }
    }

    return baseHero
  }

  return buildGenericHero()
}

function buildInsight({
  mode,
  phase,
  fertilityInsight,
  pregnancyOverlay,
  cycleConditionOverlay
}: {
  mode: string
  phase: SupportedPhase
  fertilityInsight: FertilityInsightLike | null
  pregnancyOverlay: ReturnType<typeof getContextAwarePregnancyOverlay> | null
  cycleConditionOverlay: CycleConditionOverlay
}) {
  if (mode === 'pregnant') {
    return buildPregnancyInsightMessage(pregnancyOverlay)
  }

  if (mode === 'ttc' && fertilityInsight) {
    return {
      title: 'Body insight',
      message: buildTtcInsightMessage(fertilityInsight)
    }
  }

  if (mode === 'cycle') {
    if (cycleConditionOverlay?.insightOverride) {
      return {
        title: 'Body insight',
        message: cycleConditionOverlay.insightOverride
      }
    }

    return buildCycleInsightMessage(phase)
  }

  return {
    title: 'Body insight',
    message:
      'Small, consistent check-ins help turn daily experiences into patterns you can actually understand.'
  }
}

function buildNoticeToday({
  mode,
  phase,
  pregnancyOverlay
}: {
  mode: string
  phase: SupportedPhase
  pregnancyOverlay: ReturnType<typeof getContextAwarePregnancyOverlay> | null
}): string[] {
  if (mode === 'pregnant') {
    if (Array.isArray(pregnancyOverlay?.focusAreas) && pregnancyOverlay.focusAreas.length) {
      return pregnancyOverlay.focusAreas
    }
    return ['Energy', 'Rest', 'Hydration']
  }

  if (mode === 'ttc') {
    return ['Cervical fluid', 'Ovulation signs', 'Mood']
  }

  if (mode === 'cycle') {
    switch (phase) {
      case 'period':
        return ['Flow', 'Cramps', 'Energy', 'Rest']
      case 'follicular':
        return ['Energy', 'Mood', 'Focus']
      case 'fertile':
        return ['Cervical fluid', 'Energy', 'Desire']
      case 'ovulation':
        return ['Ovulation pain', 'Energy', 'Awareness']
      case 'luteal':
        return ['Mood', 'Sleep', 'Cravings']
      default:
        return ['Energy', 'Mood', 'Sleep']
    }
  }

  return ['Energy', 'Mood', 'Sleep']
}

function getShortcuts(mode: string): HomeShortcut[] {
  switch (mode) {
    case 'ttc':
      return TTC_SHORTCUTS
    case 'pregnant':
      return PREGNANCY_SHORTCUTS
    case 'cycle':
      return CYCLE_SHORTCUTS
    default:
      return DEFAULT_SHORTCUTS
  }
}

function extractLogDatesFromSymptomLogs(symptomLogs: any[]): string[] {
  return symptomLogs
    .map((log) => {
      if (typeof log?.logged_at === 'string') return log.logged_at
      if (typeof log?.created_at === 'string') return log.created_at
      if (typeof log?.date === 'string') return log.date
      if (typeof log?.log_date === 'string') return log.log_date
      return null
    })
    .filter((value): value is string => Boolean(value))
}

function buildEmptyState({
  mode,
  periods,
  symptomLogs,
  pregnancyInsight
}: {
  mode: string
  periods: unknown[]
  symptomLogs: unknown[]
  pregnancyInsight: ReturnType<typeof getPregnancyHomeInsight> | null
}) {
  const hasPeriods = periods.length > 0
  const hasLogs = symptomLogs.length > 0

  if (mode === 'pregnant') {
    const hasPregnancyTimeline =
      Boolean(pregnancyInsight?.weekLabel) || Boolean(pregnancyInsight?.dueDateLabel)

    if (hasLogs || hasPregnancyTimeline) {
      return null
    }

    return {
      title: 'Begin your pregnancy tracking',
      description: 'Start with a gentle daily check-in.',
      ctaLabel: 'Log today’s check-in'
    }
  }

  if (hasPeriods || hasLogs) {
    return null
  }

  switch (mode) {
    case 'ttc':
      return {
        title: 'Start tracking your fertile rhythm',
        description: 'Log your cycle and body signs to build fertility insights.',
        ctaLabel: 'Log your first entry'
      }

    case 'cycle':
      return {
        title: 'Start tracking your cycle',
        description: 'Add your first log to begin building your rhythm.',
        ctaLabel: 'Log your first entry'
      }

    default:
      return {
        title: 'Start tracking',
        description: 'A few small logs can unlock meaningful insights.',
        ctaLabel: 'Log today’s check-in'
      }
  }
}
