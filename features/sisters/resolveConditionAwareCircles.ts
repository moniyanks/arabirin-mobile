import { CONDITION_CATALOG } from '../../constants/conditions'
import type { ConditionKey } from '../../types/conditions'

export type SistersCircleOption = {
  key: string
  label: string
}

const DEFAULT_SISTERS_CIRCLES: SistersCircleOption[] = [
  { key: 'all', label: 'All' },
  { key: 'general', label: 'Cycle Support' }
]

export function resolveConditionAwareCircles(
  conditions: ConditionKey[] = []
): SistersCircleOption[] {
  const conditionCircles = conditions
    .map((key) => CONDITION_CATALOG[key])
    .filter(Boolean)
    .sort((a, b) => b.priority - a.priority)
    .map((condition) => ({
      key: condition.key,
      label: condition.label
    }))

  const seen = new Set<string>()
  const resolvedCircles: SistersCircleOption[] = []

  for (const circle of [...DEFAULT_SISTERS_CIRCLES, ...conditionCircles]) {
    if (!seen.has(circle.key)) {
      seen.add(circle.key)
      resolvedCircles.push(circle)
    }
  }

  return resolvedCircles
}