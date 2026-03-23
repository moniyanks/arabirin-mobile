import type { Period, SymptomLog } from '../context/AppDataContext'
import { buildBodyMetrics, type BodyMetrics } from './bodyIntelligence'

// ── Constants ──
export const MIN_LOGS_FOR_SCORE  = 20
export const MIN_WEEKS_FOR_SCORE = 8

// ── Types ──
export type ScoreLevel    = 'low' | 'moderate' | 'notable'
export type ConditionKey  = 'fibroids' | 'endo' | 'pcos'

export type SignalResult = {
  label:  string
  met:    boolean
  weight: number
  detail: string
}

export type ConditionScore = {
  condition:      ConditionKey
  level:          ScoreLevel
  percentage:     number
  signals:        SignalResult[]
  hasEnoughData:  boolean
  logsAnalysed:   number
  weeksOfData:    number
}

// ── Helpers ──
function getScoreLevel(pct: number): ScoreLevel {
  if (pct >= 61) return 'notable'
  if (pct >= 31) return 'moderate'
  return 'low'
}

function getWeeksOfData(logs: SymptomLog[]): number {
  if (logs.length < 2) return 0
  const sorted = [...logs].sort((a, b) => a.log_date.localeCompare(b.log_date))
  return Math.floor(
    (new Date(sorted[sorted.length - 1].log_date).getTime() -
     new Date(sorted[0].log_date).getTime()) / (86400000 * 7)
  )
}

// ── Scorers — all read from BodyMetrics, compute nothing new ──

function scoreFibroids(m: BodyMetrics): SignalResult[] {
  const sf = m.symptomFrequency
  return [
    {
      label:  'Heavy flow pattern',
      met:    m.heavyFlowCount >= 3,
      weight: 30,
      detail: `Heavy flow logged ${m.heavyFlowCount} time${m.heavyFlowCount !== 1 ? 's' : ''}`,
    },
    {
      label:  'Extended period length',
      met:    m.periodLengths.some((l) => l > 7),
      weight: 20,
      detail: m.periodLengths.some((l) => l > 7)
        ? 'One or more periods lasted longer than 7 days'
        : 'No periods longer than 7 days logged',
    },
    {
      label:  'Pelvic pressure',
      met:    (sf['pelvicPressure'] ?? 0) >= 2,
      weight: 20,
      detail: `Pelvic pressure logged ${sf['pelvicPressure'] ?? 0} time${(sf['pelvicPressure'] ?? 0) !== 1 ? 's' : ''}`,
    },
    {
      label:  'Severe cramping',
      met:    m.crampsCount >= 2,
      weight: 15,
      detail: `Cramps logged ${m.crampsCount} time${m.crampsCount !== 1 ? 's' : ''}`,
    },
    {
      label:  'Bloating pattern',
      met:    (sf['bloating'] ?? 0) >= 3,
      weight: 15,
      detail: `Bloating logged ${sf['bloating'] ?? 0} time${(sf['bloating'] ?? 0) !== 1 ? 's' : ''}`,
    },
  ]
}

function scoreEndo(m: BodyMetrics): SignalResult[] {
  const sf = m.symptomFrequency
  return [
    {
      label:  'Severe cramping pattern',
      met:    m.crampsCount >= 3,
      weight: 30,
      detail: `Cramps logged ${m.crampsCount} time${m.crampsCount !== 1 ? 's' : ''}`,
    },
    {
      label:  'Pain during sex',
      met:    (sf['painDuringSex'] ?? 0) >= 2,
      weight: 25,
      detail: `Pain during sex logged ${sf['painDuringSex'] ?? 0} time${(sf['painDuringSex'] ?? 0) !== 1 ? 's' : ''}`,
    },
    {
      label:  'Heavy flow pattern',
      met:    m.heavyFlowCount >= 2,
      weight: 20,
      detail: `Heavy flow logged ${m.heavyFlowCount} time${m.heavyFlowCount !== 1 ? 's' : ''}`,
    },
    {
      label:  'Pelvic pain',
      met:    (sf['pelvicPain'] ?? 0) >= 2,
      weight: 15,
      detail: `Pelvic pain logged ${sf['pelvicPain'] ?? 0} time${(sf['pelvicPain'] ?? 0) !== 1 ? 's' : ''}`,
    },
    {
      label:  'Persistent fatigue',
      met:    (sf['fatigue'] ?? 0) >= 3,
      weight: 10,
      detail: `Fatigue logged ${sf['fatigue'] ?? 0} time${(sf['fatigue'] ?? 0) !== 1 ? 's' : ''}`,
    },
  ]
}

function scorePcos(m: BodyMetrics): SignalResult[] {
  const sf = m.symptomFrequency
  return [
    {
      label:  'Irregular cycle pattern',
      met:    (m.cycleVariance ?? 0) > 7,
      weight: 35,
      detail: m.cycleVariance !== null
        ? `Cycle length varies by up to ${Math.round(m.cycleVariance)} days`
        : 'Not enough cycles to assess regularity',
    },
    {
      label:  'Spotting between periods',
      met:    (sf['spotting'] ?? 0) >= 2,
      weight: 25,
      detail: `Spotting logged ${sf['spotting'] ?? 0} time${(sf['spotting'] ?? 0) !== 1 ? 's' : ''}`,
    },
    {
      label:  'Hair thinning pattern',
      met:    (sf['hairLoss'] ?? 0) >= 2,
      weight: 20,
      detail: `Hair thinning logged ${sf['hairLoss'] ?? 0} time${(sf['hairLoss'] ?? 0) !== 1 ? 's' : ''}`,
    },
    {
      label:  'Acne pattern',
      met:    (sf['acne'] ?? 0) >= 3,
      weight: 20,
      detail: `Acne logged ${sf['acne'] ?? 0} time${(sf['acne'] ?? 0) !== 1 ? 's' : ''}`,
    },
  ]
}

// ── Main export ──
export function calculateConditionScore(
  condition:   ConditionKey,
  logs:        SymptomLog[],
  periods:     Period[],
  profile:     { cycle_length?: number; period_length?: number } | null
): ConditionScore {
  const metrics       = buildBodyMetrics(periods, logs, profile)
  const weeksOfData   = getWeeksOfData(logs)
  const hasEnoughData = logs.length >= MIN_LOGS_FOR_SCORE && weeksOfData >= MIN_WEEKS_FOR_SCORE

  const signals =
    condition === 'fibroids' ? scoreFibroids(metrics) :
    condition === 'endo'     ? scoreEndo(metrics)     :
                               scorePcos(metrics)

  const percentage = signals
    .filter((s) => s.met)
    .reduce((sum, s) => sum + s.weight, 0)

  return {
    condition,
    level:         getScoreLevel(percentage),
    percentage,
    signals,
    hasEnoughData,
    logsAnalysed:  logs.length,
    weeksOfData,
  }
}

export function getConditionsFromProfile(conditions: string[]): ConditionKey[] {
  const valid: ConditionKey[] = ['fibroids', 'endo', 'pcos']
  return conditions.filter((c): c is ConditionKey => valid.includes(c as ConditionKey))
}

export const CONDITION_LABELS: Record<ConditionKey, string> = {
  fibroids: 'Fibroids',
  endo:     'Endometriosis',
  pcos:     'PCOS',
}

export const CONDITION_COLORS: Record<ConditionKey, string> = {
  fibroids: '#D99B9B',
  endo:     '#9B8FD9',
  pcos:     '#9BB5D9',
}

export const SCORE_LEVEL_LABELS: Record<ScoreLevel, string> = {
  low:      'Low similarity',
  moderate: 'Moderate similarity',
  notable:  'Notable similarity',
}

export const SCORE_DESCRIPTIONS: Record<ConditionKey, Record<ScoreLevel, string>> = {
  fibroids: {
    low:      'Your logged patterns show low similarity to fibroid-associated profiles. Continue logging to build a clearer picture.',
    moderate: 'Some of your logged patterns are consistent with symptoms commonly associated with fibroids. Worth mentioning to your healthcare provider.',
    notable:  'Several logged patterns show notable similarity to fibroid-associated profiles. We recommend discussing this with your healthcare provider.',
  },
  endo: {
    low:      'Your logged patterns show low similarity to endometriosis-associated profiles. Continue logging to build a clearer picture.',
    moderate: 'Some of your logged patterns are consistent with symptoms commonly associated with endometriosis. Worth mentioning to your healthcare provider.',
    notable:  'Several logged patterns show notable similarity to endometriosis-associated profiles. We recommend discussing this with your healthcare provider.',
  },
  pcos: {
    low:      'Your logged patterns show low similarity to PCOS-associated profiles. Continue logging to build a clearer picture.',
    moderate: 'Some of your logged patterns are consistent with symptoms commonly associated with PCOS. Worth mentioning to your healthcare provider.',
    notable:  'Several logged patterns show notable similarity to PCOS-associated profiles. We recommend discussing this with your healthcare provider.',
  },
}