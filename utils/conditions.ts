import { CONDITION_CATALOG } from '../constants/conditions'
import type { ConditionDefinition, ConditionKey } from '../types/conditions'

const CONDITION_ALIASES: Record<string, ConditionKey> = {
  fibroids: 'fibroids',

  pcos: 'pcos',

  endometriosis: 'endometriosis',
  endo: 'endometriosis',

  'maternal health': 'maternal_health',
  maternal_health: 'maternal_health',
  maternal: 'maternal_health',

  'pregnancy loss': 'pregnancy_loss',
  pregnancy_loss: 'pregnancy_loss',
  loss: 'pregnancy_loss',

  'sickle cell': 'sickle_cell',
  sickle_cell: 'sickle_cell',

  thalassemia: 'thalassemia'
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