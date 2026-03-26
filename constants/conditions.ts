export type ConditionKey =
  | 'fibroids'
  | 'pcos'
  | 'sickle_cell'
  | 'thalassemia'

export type ConditionDefinition = {
  key: ConditionKey
  label: string
  shortLabel?: string
  circleTitle: string
  priority: number
}

export const CONDITION_CATALOG: Record<ConditionKey, ConditionDefinition> = {
  fibroids: {
    key: 'fibroids',
    label: 'Fibroids',
    circleTitle: 'Fibroids',
    priority: 100,
  },
  pcos: {
    key: 'pcos',
    label: 'PCOS',
    circleTitle: 'PCOS',
    priority: 90,
  },
  sickle_cell: {
    key: 'sickle_cell',
    label: 'Sickle cell',
    circleTitle: 'Sickle cell',
    priority: 80,
  },
  thalassemia: {
    key: 'thalassemia',
    label: 'Thalassemia',
    circleTitle: 'Thalassemia',
    priority: 70,
  },
}