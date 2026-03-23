import { differenceInDays, parseISO } from 'date-fns'
import type { Period, SymptomLog } from '../context/AppDataContext'
import { buildBodyMetrics } from './bodyIntelligence'
import { getFertileWindow, toLocalDateStr } from './cycleHelper'

// ── Types ──
export type FertileWindowStatus =
  | 'before_fertile'
  | 'in_fertile'
  | 'ovulation_day'
  | 'after_ovulation'
  | 'no_data'

export type CycleQuality = 'optimal' | 'good' | 'fair' | 'needs_attention'
export type LutealStatus = 'normal' | 'short' | 'unknown'

export type FertilityInsight = {
  fertileStart:         string | null
  fertileEnd:           string | null
  ovulationDay:         string | null
  daysUntilFertile:     number | null
  daysUntilOvulation:   number | null
  fertileWindowStatus:  FertileWindowStatus
  cycleQuality:         CycleQuality
  cycleQualityScore:    number
  cycleQualityFactors:  string[]
  lutealPhaseLength:    number | null
  lutealStatus:         LutealStatus
  confidence:           'low' | 'medium' | 'high'
  cyclesAnalysed:       number
  avgCycleLength:       number
  cervicalMucusLogs:    number
  ovulationPainLogs:    number
  spottingLogs:         number
}

// ── Luteal phase — new, not in any existing util ──
function getLutealLengths(periods: Period[]): number[] {
  if (periods.length < 2) return []
  const sorted = [...periods].sort((a, b) => a.startDate.localeCompare(b.startDate))
  const lengths: number[] = []
  for (let i = 0; i < sorted.length - 1; i++) {
    const cycleLen = differenceInDays(
      parseISO(sorted[i + 1].startDate),
      parseISO(sorted[i].startDate)
    )
    const luteal = cycleLen - 14
    if (luteal > 0 && luteal < 20) lengths.push(luteal)
  }
  return lengths
}

// ── Cycle quality — new, not in any existing util ──
function calculateCycleQuality(
  cycleVariance: number | null,
  avgCycleLength: number,
  lutealLengths: number[],
  heavyFlowCount: number
): { score: number; quality: CycleQuality; factors: string[] } {
  let score = 100
  const factors: string[] = []

  if (cycleVariance !== null && cycleVariance > 14) {
    score -= 25
    factors.push('Highly variable cycle length')
  } else if (cycleVariance !== null && cycleVariance > 7) {
    score -= 15
    factors.push('Moderately variable cycle length')
  }

  if (avgCycleLength < 21 || avgCycleLength > 35) {
    score -= 20
    factors.push(`Cycle length outside typical range (${avgCycleLength} days)`)
  }

  if (lutealLengths.length > 0) {
    const avgLuteal = lutealLengths.reduce((a, b) => a + b, 0) / lutealLengths.length
    if (avgLuteal < 10) {
      score -= 25
      factors.push('Short luteal phase may affect implantation')
    } else if (avgLuteal < 12) {
      score -= 10
      factors.push('Luteal phase on the shorter side')
    }
  }

  if (heavyFlowCount >= 5) {
    score -= 15
    factors.push('Frequent heavy flow')
  } else if (heavyFlowCount >= 3) {
    score -= 8
    factors.push('Some heavy flow logged')
  }

  if (factors.length === 0) {
    factors.push('Regular cycle pattern')
    factors.push('Cycle length in typical range')
  }

  score = Math.max(0, Math.min(100, score))

  const quality: CycleQuality =
    score >= 80 ? 'optimal' :
    score >= 60 ? 'good'    :
    score >= 40 ? 'fair'    : 'needs_attention'

  return { score, quality, factors }
}

// ── Main export — reuses existing utils, computes only what's new ──
export function calculateFertilityInsight(
  periods:     Period[],
  symptomLogs: SymptomLog[],
  profile:     { cycle_length?: number; period_length?: number } | null
): FertilityInsight {
  // Reuse existing bodyIntelligence metrics
  const metrics = buildBodyMetrics(periods, symptomLogs, profile)
  const { avgCycleLength, cycleVariance, heavyFlowCount } = metrics

  // Reuse existing cycleHelper fertile window
  const fw = getFertileWindow(periods, avgCycleLength)

  // TTC-specific symptom counts — new
  const cervicalMucusLogs = symptomLogs.filter((l) => l.extras?.includes('cervicalMucus')).length
  const ovulationPainLogs = symptomLogs.filter((l) => l.extras?.includes('ovulationPain')).length
  const spottingLogs      = symptomLogs.filter((l) => l.extras?.includes('spotting')).length

  if (!periods.length || !fw) {
    return {
      fertileStart: null, fertileEnd: null, ovulationDay: null,
      daysUntilFertile: null, daysUntilOvulation: null,
      fertileWindowStatus: 'no_data',
      cycleQuality: 'fair', cycleQualityScore: 50, cycleQualityFactors: [],
      lutealPhaseLength: null, lutealStatus: 'unknown',
      confidence: 'low', cyclesAnalysed: 0,
      avgCycleLength, cervicalMucusLogs, ovulationPainLogs, spottingLogs,
    }
  }

  // Fertile window status — new
  const todayStr = toLocalDateStr(new Date())
  let fertileWindowStatus: FertileWindowStatus
  if      (todayStr < fw.fertileStart)   fertileWindowStatus = 'before_fertile'
  else if (todayStr === fw.ovulationDay) fertileWindowStatus = 'ovulation_day'
  else if (todayStr <= fw.fertileEnd)    fertileWindowStatus = 'in_fertile'
  else                                   fertileWindowStatus = 'after_ovulation'

  const daysUntilFertile    = Math.max(differenceInDays(parseISO(fw.fertileStart), new Date()), 0)
  const daysUntilOvulation  = differenceInDays(parseISO(fw.ovulationDay), new Date())

  // Luteal phase — new
  const lutealLengths    = getLutealLengths(periods)
  const lutealPhaseLength = lutealLengths.length
    ? Math.round(lutealLengths.reduce((a, b) => a + b, 0) / lutealLengths.length)
    : null
  const lutealStatus: LutealStatus =
    lutealPhaseLength === null ? 'unknown' :
    lutealPhaseLength < 10    ? 'short'   : 'normal'

  // Cycle quality — new
  const { score, quality, factors } = calculateCycleQuality(
    cycleVariance, avgCycleLength, lutealLengths, heavyFlowCount
  )

  const confidence: 'low' | 'medium' | 'high' =
    metrics.totalCycles >= 5 ? 'high' :
    metrics.totalCycles >= 3 ? 'medium' : 'low'

  return {
    fertileStart:        fw.fertileStart,
    fertileEnd:          fw.fertileEnd,
    ovulationDay:        fw.ovulationDay,
    daysUntilFertile,
    daysUntilOvulation,
    fertileWindowStatus,
    cycleQuality:        quality,
    cycleQualityScore:   score,
    cycleQualityFactors: factors,
    lutealPhaseLength,
    lutealStatus,
    confidence,
    cyclesAnalysed:      metrics.totalCycles,
    avgCycleLength,
    cervicalMucusLogs,
    ovulationPainLogs,
    spottingLogs,
  }
}

export const CYCLE_QUALITY_LABELS: Record<CycleQuality, string> = {
  optimal:         'Optimal',
  good:            'Good',
  fair:            'Fair',
  needs_attention: 'Needs attention',
}

export const CYCLE_QUALITY_COLORS: Record<CycleQuality, string> = {
  optimal:         '#9BA88D',
  good:            '#9BA88D',
  fair:            '#F3C98B',
  needs_attention: '#D99B9B',
}

export const FERTILE_STATUS_MESSAGES: Record<FertileWindowStatus, string> = {
  before_fertile:  'Your fertile window is coming up. This is a good time to track symptoms closely.',
  in_fertile:      'You are in your fertile window. This is your most important time if you are trying to conceive.',
  ovulation_day:   'This is your estimated ovulation day — your peak fertility moment this cycle.',
  after_ovulation: 'Your fertile window has passed for this cycle. Focus on rest and self-care.',
  no_data:         'Log your first period to unlock your fertility window predictions.',
}