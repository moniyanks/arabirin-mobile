export type CommunityTopicKey =
  | 'heavy_bleeding'
  | 'painful_periods'
  | 'cycle_irregularity'
  | 'trying_to_conceive'

export type CommunityTopicDefinition = {
  key: CommunityTopicKey
  label: string
  priority: number
}

export const COMMUNITY_TOPIC_CATALOG: Record<CommunityTopicKey, CommunityTopicDefinition> = {
  heavy_bleeding: {
    key: 'heavy_bleeding',
    label: 'Heavy bleeding',
    priority: 100
  },
  painful_periods: {
    key: 'painful_periods',
    label: 'Painful periods',
    priority: 90
  },
  cycle_irregularity: {
    key: 'cycle_irregularity',
    label: 'Cycle irregularity',
    priority: 80
  },
  trying_to_conceive: {
    key: 'trying_to_conceive',
    label: 'Trying to conceive',
    priority: 70
  }
}
