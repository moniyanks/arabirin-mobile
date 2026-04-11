import type { ConditionDefinition, ConditionKey } from '../types/conditions'

export type { ConditionDefinition, ConditionKey }

export const CONDITION_CATALOG: Record<ConditionKey, ConditionDefinition> = {
  fibroids: {
    key: 'fibroids',
    label: 'Fibroids',
    circleTitle: 'Fibroids',
    priority: 100
  },
  endometriosis: {
    key: 'endometriosis',
    label: 'Endometriosis',
    shortLabel: 'Endo',
    circleTitle: 'Endometriosis',
    priority: 95
  },
  pcos: {
    key: 'pcos',
    label: 'PCOS',
    circleTitle: 'PCOS',
    priority: 90
  },
  maternal_health: {
    key: 'maternal_health',
    label: 'Maternal Health',
    circleTitle: 'Maternal Health',
    priority: 85
  },
  pregnancy_loss: {
    key: 'pregnancy_loss',
    label: 'Pregnancy Loss',
    circleTitle: 'Pregnancy Loss',
    priority: 84
  },
  sickle_cell: {
    key: 'sickle_cell',
    label: 'Sickle cell',
    circleTitle: 'Sickle cell',
    priority: 80
  },
  thalassemia: {
    key: 'thalassemia',
    label: 'Thalassemia',
    circleTitle: 'Thalassemia',
    priority: 70
  }
}

export const CONDITION_LIST = Object.values(CONDITION_CATALOG)