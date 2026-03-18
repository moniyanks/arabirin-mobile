import { parseLocalDate } from './cycleHelper'
import type { Period, SymptomLog } from '../context/AppDataContext'

const RULES = {
  MIN_CYCLES_FOR_STABILITY: 3,
  STABLE_CYCLE_VARIANCE_DAYS: 3,
  MIN_CYCLES_FOR_CONFIDENCE_MEDIUM: 3,
  MIN_CYCLES_FOR_CONFIDENCE_HIGH: 5,
  HEAVY_FLOW_THRESHOLD_COUNT: 3,
}

// ── Helpers ──

function getCycleLengths(periods: Period[]) {
  if (periods.length < 2) return []
  const sorted = [...periods].sort((a, b) => a.startDate.localeCompare(b.startDate))
  const lengths: number[] = []
  for (let i = 1; i < sorted.length; i++) {
    const diff = Math.round(
      (parseLocalDate(sorted[i].startDate).getTime() - parseLocalDate(sorted[i - 1].startDate).getTime())
      / 86400000
    )
    if (diff > 0) lengths.push(diff)
  }
  return lengths
}

function getPeriodLengths(periods: Period[]) {
  return periods
    .filter((p) => p.startDate && p.endDate)
    .map((p) => {
      const diff = Math.round(
        (parseLocalDate(p.endDate!).getTime() - parseLocalDate(p.startDate).getTime())
        / 86400000
      ) + 1
      return diff > 0 ? diff : null
    })
    .filter(Boolean) as number[]
}

function getMostFrequentValue(items: string[]) {
  if (!items.length) return null
  const counts: Record<string, number> = {}
  for (const item of items) counts[item] = (counts[item] || 0) + 1
  let maxKey = null, maxCount = 0
  for (const [key, count] of Object.entries(counts)) {
    if (count > maxCount) { maxKey = key; maxCount = count }
  }
  return { key: maxKey, count: maxCount }
}

function getSymptomFrequency(logs: SymptomLog[]) {
  const counts: Record<string, number> = {}
  for (const log of logs) {
    if (log.cramps && log.cramps !== 'none') counts.cramps = (counts.cramps || 0) + 1
    if (log.flow   && log.flow   !== 'none') counts.flow   = (counts.flow   || 0) + 1
    if (log.mood)   counts.mood   = (counts.mood   || 0) + 1
    if (log.energy) counts.energy = (counts.energy || 0) + 1
    for (const ex of log.extras || []) counts[ex] = (counts[ex] || 0) + 1
  }
  return counts
}

// ── Types ──

export type Insight = {
  id: string
  type: string
  severity: 'info' | 'attention' | 'supportive'
  title: string
  message: string
  confidence: 'low' | 'medium' | 'high'
}

export type BodyMetrics = {
  cycleLengths: number[]
  periodLengths: number[]
  avgCycleLength: number
  avgPeriodLength: number
  minCycle: number | null
  maxCycle: number | null
  cycleVariance: number | null
  heavyFlowCount: number
  crampsCount: number
  symptomFrequency: Record<string, number>
  mostFrequentSymptom: { key: string | null; count: number } | null
  mostFrequentEnergy: { key: string | null; count: number } | null
  predictionConfidence: 'low' | 'medium' | 'high'
  totalCycles: number
  totalLogs: number
}

// ── Metrics builder ──

export function buildBodyMetrics(
  periods: Period[],
  symptomLogs: SymptomLog[],
  profile: { cycle_length?: number; period_length?: number } | null
): BodyMetrics {
  const cycleLengths  = getCycleLengths(periods)
  const periodLengths = getPeriodLengths(periods)

  const avgCycleLength  = cycleLengths.length
    ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
    : profile?.cycle_length ?? 28

  const avgPeriodLength = periodLengths.length
    ? Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length)
    : profile?.period_length ?? 5

  const minCycle      = cycleLengths.length ? Math.min(...cycleLengths) : null
  const maxCycle      = cycleLengths.length ? Math.max(...cycleLengths) : null
  const cycleVariance = minCycle !== null && maxCycle !== null ? maxCycle - minCycle : null

  const symptomFrequency   = getSymptomFrequency(symptomLogs)
  const mostFrequentSymptom = getMostFrequentValue(
    Object.entries(symptomFrequency).flatMap(([k, c]) => Array(c).fill(k))
  )

  const energyCounts = symptomLogs.reduce((acc: Record<string, number>, log) => {
    if (log.energy) acc[log.energy] = (acc[log.energy] || 0) + 1
    return acc
  }, {})
  const mostFrequentEnergy = getMostFrequentValue(
    Object.entries(energyCounts).flatMap(([k, c]) => Array(c).fill(k))
  )

  const heavyFlowCount = symptomLogs.filter((l) => l.flow === 'heavy').length
  const crampsCount    = symptomLogs.filter((l) => l.cramps && l.cramps !== 'none').length

  let predictionConfidence: 'low' | 'medium' | 'high' = 'low'
  if (cycleLengths.length >= RULES.MIN_CYCLES_FOR_CONFIDENCE_HIGH)   predictionConfidence = 'high'
  else if (cycleLengths.length >= RULES.MIN_CYCLES_FOR_CONFIDENCE_MEDIUM) predictionConfidence = 'medium'

  return {
    cycleLengths, periodLengths, avgCycleLength, avgPeriodLength,
    minCycle, maxCycle, cycleVariance, heavyFlowCount, crampsCount,
    symptomFrequency, mostFrequentSymptom, mostFrequentEnergy,
    predictionConfidence, totalCycles: cycleLengths.length,
    totalLogs: symptomLogs.length,
  }
}

// ── Insight generators ──

const SYMPTOM_LABELS: Record<string, string> = {
  cramps: 'Cramps', flow: 'Flow changes', mood: 'Mood changes',
  energy: 'Energy shifts', bloating: 'Bloating', headache: 'Headaches',
  backPain: 'Back pain', breastTenderness: 'Breast tenderness',
  nausea: 'Nausea', insomnia: 'Sleep disruption',
}

export function generateInsights(metrics: BodyMetrics): Insight[] {
  const insights: (Insight | null)[] = []

  // Cycle stability
  if (metrics.totalCycles < RULES.MIN_CYCLES_FOR_STABILITY) {
    insights.push({
      id: 'cycle_confidence_building', type: 'cycle', severity: 'supportive',
      title: 'Building Accuracy',
      message: 'Log a few more cycles to unlock stronger body pattern insights.',
      confidence: metrics.predictionConfidence,
    })
  } else if (metrics.cycleVariance !== null && metrics.cycleVariance <= RULES.STABLE_CYCLE_VARIANCE_DAYS) {
    insights.push({
      id: 'cycle_stability', type: 'cycle', severity: 'info',
      title: 'Stable Cycle',
      message: `Your cycle has stayed between ${metrics.minCycle}–${metrics.maxCycle} days across recent cycles.`,
      confidence: metrics.predictionConfidence,
    })
  } else {
    insights.push({
      id: 'cycle_variability', type: 'cycle', severity: 'attention',
      title: 'Cycle Variability',
      message: 'Your cycle length varies more than usual. If this continues, it may be worth tracking closely.',
      confidence: metrics.predictionConfidence,
    })
  }

  // Heavy flow
  if (metrics.heavyFlowCount >= RULES.HEAVY_FLOW_THRESHOLD_COUNT) {
    insights.push({
      id: 'heavy_flow_pattern', type: 'health', severity: 'attention',
      title: 'Heavy Flow Pattern',
      message: 'Heavy bleeding has appeared repeatedly in your logs. Some women with similar patterns discuss fibroids or iron levels with a clinician.',
      confidence: 'medium',
    })
  }

  // Cramps
  if (metrics.crampsCount >= 3) {
    insights.push({
      id: 'cramps_pattern', type: 'symptom', severity: 'info',
      title: 'Cramps Pattern',
      message: 'Cramps appear frequently in your recent logs. Tracking when they occur can help you understand your cycle rhythm.',
      confidence: 'medium',
    })
  }

  // Most frequent symptom
  if (metrics.mostFrequentSymptom?.key) {
    insights.push({
      id: 'most_frequent_symptom', type: 'symptom', severity: 'info',
      title: 'Most Logged Symptom',
      message: `${SYMPTOM_LABELS[metrics.mostFrequentSymptom.key] || metrics.mostFrequentSymptom.key} is the most frequently logged pattern in your recent entries.`,
      confidence: 'medium',
    })
  }

  // Prediction confidence
  insights.push({
    id: 'prediction_confidence', type: 'fertility', severity: 'supportive',
    title: 'Prediction Confidence',
    message: {
      low:    'Your cycle predictions are still learning from your data.',
      medium: 'Your cycle predictions are getting more accurate as you log consistently.',
      high:   'Your cycle predictions are supported by a strong history of logged cycles.',
    }[metrics.predictionConfidence],
    confidence: metrics.predictionConfidence,
  })

  // Energy
  if (metrics.mostFrequentEnergy?.key) {
    insights.push({
      id: 'energy_pattern', type: 'symptom', severity: 'supportive',
      title: 'Energy Rhythm',
      message: `You most often log ${metrics.mostFrequentEnergy.key} energy in recent entries.`,
      confidence: 'low',
    })
  }

  return insights.filter(Boolean) as Insight[]
}