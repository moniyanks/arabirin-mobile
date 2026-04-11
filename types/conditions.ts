export type ConditionKey =
  | 'fibroids'
  | 'pcos'
  | 'endometriosis'
  | 'sickle_cell'
  | 'thalassemia'
  | 'maternal_health'
  | 'pregnancy_loss'

export type ConditionDefinition = {
  key: ConditionKey
  label: string
  shortLabel?: string
  circleTitle: string
  priority: number
}