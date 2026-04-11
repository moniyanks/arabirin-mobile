import { compareAsc, format, parseISO, isValid } from 'date-fns'
import type { Period } from '../../types/appData'
import type { ReportMetricValue, SupportedMode } from './types'
import { MODE_LABELS, SYMPTOM_LABELS } from './config'

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function safeString(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback
}

export function isSupportedMode(value: unknown): value is SupportedMode {
  return typeof value === 'string' && value in MODE_LABELS
}

function normalizeDateInput(value: string | Date | null | undefined): Date | null {
  if (!value) {
    return null
  }

  if (value instanceof Date) {
    return isValid(value) ? value : null
  }

  try {
    const parsed = parseISO(value)
    return isValid(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function formatDateShort(date: string | Date | null | undefined): string {
  const normalized = normalizeDateInput(date)

  if (!normalized) {
    return 'Not available'
  }

  try {
    return format(normalized, 'd MMM yyyy')
  } catch {
    return 'Not available'
  }
}

export function formatDateLong(date: Date): string {
  return format(date, 'd MMMM yyyy')
}

export function formatDays(value: ReportMetricValue): string {
  return typeof value === 'number' && Number.isFinite(value) ? `${value} days` : 'Not enough data'
}

export function formatCycleRange(
  minValue: ReportMetricValue,
  maxValue: ReportMetricValue
): string | null {
  const hasMin = typeof minValue === 'number' && Number.isFinite(minValue)
  const hasMax = typeof maxValue === 'number' && Number.isFinite(maxValue)

  if (!hasMin || !hasMax) {
    return null
  }

  return `${minValue} to ${maxValue} days`
}

export function getPredictionConfidence(
  totalCycles: ReportMetricValue
): 'High' | 'Good' | 'Building' {
  if (typeof totalCycles !== 'number' || !Number.isFinite(totalCycles)) {
    return 'Building'
  }

  if (totalCycles >= 5) return 'High'
  if (totalCycles >= 3) return 'Good'
  return 'Building'
}

export function sortPeriodsByStartDate(periods: Period[]): Period[] {
  return [...periods].sort((a, b) => {
    try {
      return compareAsc(parseISO(a.startDate), parseISO(b.startDate))
    } catch {
      return 0
    }
  })
}

export function getLatestPeriodStartDate(periods: Period[]): string | null {
  if (!periods.length) {
    return null
  }

  const sorted = sortPeriodsByStartDate(periods)
  return sorted[sorted.length - 1]?.startDate ?? null
}

export function getSymptomLabel(key: string): string {
  return SYMPTOM_LABELS[key] ?? key
}
