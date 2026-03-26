import { CONDITION_CATALOG, ConditionDefinition, ConditionKey } from '../constants/conditions'

const CONDITION_ALIASES: Record<string, ConditionKey> = {
  fibroids: 'fibroids',
  pcos: 'pcos',
  'sickle cell': 'sickle_cell',
  sickle_cell: 'sickle_cell',
  thalassemia: 'thalassemia',
}

export function normalizeConditionKey(value: string): ConditionKey | null {
  const normalized = value.trim().toLowerCase()
  return CONDITION_ALIASES[normalized] || null
}

export function normalizeConditionKeys(values: string[] = []): ConditionKey[] {
  const seen = new Set<ConditionKey>()

  for (const value of values) {
    const key = normalizeConditionKey(value)
    if (key) {
      seen.add(key)
    }
  }

  return Array.from(seen)
}

export function getConditionDefinitions(values: string[] = []): ConditionDefinition[] {
  return normalizeConditionKeys(values)
    .map((key) => CONDITION_CATALOG[key])
    .sort((a, b) => b.priority - a.priority)
}