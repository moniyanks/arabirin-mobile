import type { Period, SymptomLog, Profile } from '../../context/AppDataContext'
import type {
  ReportViewModel,
  TopSymptom,
  ConditionCard,
  QuestionSourceKey,
  SupportedMode,
} from './types'
import {
  DOCTOR_QUESTIONS,
  FALLBACK_MODE,
  FALLBACK_NAME,
  MAX_DOCTOR_QUESTIONS,
  MAX_TOP_SYMPTOMS,
  MODE_LABELS,
  RESEARCH_SOURCES,
} from './config'
import {
  escapeHtml,
  formatCycleRange,
  formatDateLong,
  formatDateShort,
  formatDays,
  getLatestPeriodStartDate,
  getPredictionConfidence,
  getSymptomLabel,
  isSupportedMode,
  safeString,
  sortPeriodsByStartDate,
} from './helpers'
import { buildBodyMetrics } from '../bodyIntelligence'
import {
  calculateConditionScore,
  getConditionsFromProfile,
  CONDITION_LABELS,
  SCORE_LEVEL_LABELS,
  type ConditionKey,
} from '../conditionIntelligence'
import { getFertileWindow, getNextPeriodDate } from '../cycleHelper'

function buildTopSymptoms(
  symptomFrequency: Record<string, number>
): TopSymptom[] {
  return Object.entries(symptomFrequency)
    .filter(([, count]) => typeof count === 'number' && Number.isFinite(count) && count > 0)
    .map(([key, count]) => ({
      key,
      label: getSymptomLabel(key),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, MAX_TOP_SYMPTOMS)
}

function buildDoctorQuestions(
  conditions: ConditionKey[],
  mode:       SupportedMode,
): string[] {
  const sourceKeys: QuestionSourceKey[] =
    conditions.length > 0
      ? (conditions as QuestionSourceKey[])
      : mode === 'ttc'
        ? ['ttc']
        : ['cycle']

  // Always append TTC questions for TTC users even if they have conditions
  if (mode === 'ttc' && !sourceKeys.includes('ttc')) {
    sourceKeys.push('ttc')
  }

  const uniqueQuestions = new Set<string>()

  for (const key of sourceKeys) {
    const questions = DOCTOR_QUESTIONS[key] ?? DOCTOR_QUESTIONS.cycle
    for (const question of questions) {
      if (uniqueQuestions.size >= MAX_DOCTOR_QUESTIONS) break
      uniqueQuestions.add(question)
    }
    if (uniqueQuestions.size >= MAX_DOCTOR_QUESTIONS) break
  }

  return [...uniqueQuestions]
}

function buildConditionCards(
  conditions:  ConditionKey[],
  symptomLogs: SymptomLog[],
  periods:     Period[],
  profile:     Profile,
): ConditionCard[] {
  return conditions.map((condition) => {
    const score = calculateConditionScore(condition, symptomLogs, periods, profile)
    return {
      name:         CONDITION_LABELS[condition] ?? condition,
      scoreLabel:   SCORE_LEVEL_LABELS[score.level] ?? score.level,
      signals:      score.signals.map((s) => ({ label: s.label, met: Boolean(s.met) })),
      enoughData:   Boolean(score.hasEnoughData),
      logsAnalysed: typeof score.logsAnalysed === 'number' ? score.logsAnalysed : 0,
    }
  })
}

export function buildAppointmentReportViewModel(
  profile:     Profile,
  periods:     Period[],
  symptomLogs: SymptomLog[],
): ReportViewModel {
  const sortedPeriods = sortPeriodsByStartDate(periods)
  const preparedFor   = escapeHtml(safeString(profile?.name, FALLBACK_NAME))
  const mode          = isSupportedMode(profile?.mode) ? profile!.mode : FALLBACK_MODE
  const conditions    = getConditionsFromProfile(profile?.conditions ?? [])
  const metrics       = buildBodyMetrics(sortedPeriods, symptomLogs, profile)

  // ── Dates ──
  const cycleLength    = profile?.cycle_length ?? 28
  const nextPeriod     = getNextPeriodDate(sortedPeriods, cycleLength)
  const fertile        = getFertileWindow(sortedPeriods, cycleLength)
  const lastPeriodDate = getLatestPeriodStartDate(sortedPeriods)

  const fertileWindow = fertile
    ? `${formatDateShort(fertile.fertileStart)} — ${formatDateShort(fertile.fertileEnd)}`
    : null

  // ── Flow counts ──
  const heavyFlow  = symptomLogs.filter((l) => l.flow === 'heavy').length
  const mediumFlow = symptomLogs.filter((l) => l.flow === 'medium').length
  const lightFlow  = symptomLogs.filter((l) => l.flow === 'light').length

  return {
    generatedDate:          formatDateLong(new Date()),
    preparedFor,
    modeLabel:              MODE_LABELS[mode],
    trackedConditionsLabel: conditions.length > 0
      ? conditions.map((c) => CONDITION_LABELS[c]).join(', ')
      : null,
    symptomEntryCount:  symptomLogs.length,
    periodsLoggedCount: sortedPeriods.length,
    cycleSummary: {
      avgCycleLength:       formatDays(metrics.avgCycleLength),
      avgPeriodLength:      formatDays(metrics.avgPeriodLength),
      cycleRange:           formatCycleRange(metrics.minCycle, metrics.maxCycle),
      lastPeriodStarted:    formatDateShort(lastPeriodDate),
      nextPeriodPredicted:  nextPeriod ? formatDateShort(nextPeriod) : null,
      fertileWindow,
      predictionConfidence: getPredictionConfidence(metrics.totalCycles),
    },
    flowSummary: {
      heavyFlow,
      mediumFlow,
      lightFlow,
      hasAnyFlow: (heavyFlow + mediumFlow + lightFlow) > 0,
    },
    topSymptoms:     buildTopSymptoms(metrics.symptomFrequency ?? {}),
    conditionCards:  buildConditionCards(conditions, symptomLogs, sortedPeriods, profile),
    questions:       buildDoctorQuestions(conditions, mode),
    researchSources: RESEARCH_SOURCES,
  }
}